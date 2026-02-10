import FixedIncomeModal from '@/components/FixedIncomeModal'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import useFixedIncomeDetail from '@/hooks/fixed-incomes/useFixedIncomeDetail'
import useFixedIncomes from '@/hooks/fixed-incomes/useFixedIncomes'
import { Frequency } from '@/services/fixed-income.service'
import { useLocalSearchParams } from 'expo-router'
import { DollarSign, Edit3, Repeat, Trash2 } from 'lucide-react-native'
import React, { useState } from 'react'
import { Alert, ScrollView, View } from 'react-native'

export default function FixedIncomeDetailScreen() {
  const { id } = useLocalSearchParams()
  const incomeId = Number(id)

  const { fixedIncomeDetail: income, isFixedIncomeLoading } =
    useFixedIncomeDetail(incomeId)
  const { deleteFixedIncome, editFixedIncome } = useFixedIncomes()

  const [isEditModalVisible, setIsEditModalVisible] = useState(false)

  if (isFixedIncomeLoading)
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Cargando...</Text>
      </View>
    )

  if (!income)
    return (
      <View className="flex-1 justify-center items-center">
        <Text>No se encontró el ingreso</Text>
      </View>
    )

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Ingreso',
      '¿Estás seguro de que querés borrar este ingreso fijo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deleteFixedIncome(incomeId),
        },
      ],
    )
  }

  const frecuencia = income.frecuencia as unknown as keyof typeof Frequency
  let valorMensualizado = 0

  if (frecuencia === 'WEEKLY') {
    valorMensualizado = income.ingreso * 4
  } else if (frecuencia === 'YEARLY') {
    valorMensualizado = income.ingreso / 12
  } else {
    valorMensualizado = income.ingreso
  }

  return (
    <ScrollView className="flex-1 p-6">
      <View className="items-center my-8">
        <Text className="text-muted-foreground mb-2">Monto del ingreso</Text>
        <Text className="text-5xl font-bold text-primary">
          $ {Number(income.ingreso).toLocaleString()}
        </Text>
      </View>

      <Card className="gap-4 p-6 rounded-[32px] border border-border">
        <DetailRow
          icon={DollarSign}
          label="Monto Nominal"
          value={`$ ${Number(income.ingreso).toLocaleString()}`}
        />
        {}
        <DetailRow
          icon={DollarSign}
          label="Monto Mensual"
          value={`$ ${Number(valorMensualizado).toLocaleString()}`}
        />
        <DetailRow
          icon={Repeat}
          label="Frecuencia"
          value={
            Frequency[income.frecuencia as unknown as keyof typeof Frequency] ||
            income.frecuencia
          }
          isCapitalized
        />
      </Card>

      <View className="flex-row gap-4 mt-10">
        <Button
          variant="outline"
          className="flex-1 flex-row gap-2 border-destructive"
          onPress={handleDelete}
        >
          <Trash2 size={18} color="#ef4444" />
          <Text className="text-destructive">Eliminar</Text>
        </Button>

        <Button
          className="flex-1 flex-row gap-2"
          onPress={() => setIsEditModalVisible(true)}
        >
          <Edit3 size={18} color="black" />
          <Text>Editar</Text>
        </Button>
      </View>

      <FixedIncomeModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        isSubmitting={false}
        initialData={income}
        onSubmit={(data) => {
          editFixedIncome({ id: incomeId, data: data })
          setIsEditModalVisible(false)
        }}
      />
    </ScrollView>
  )
}

function DetailRow({ icon: Icon, label, value, isCapitalized = false }: any) {
  return (
    <View className="flex-row items-center justify-between py-2">
      <View className="flex-row items-center gap-3">
        <View className="p-2 bg-background rounded-full">
          <Icon size={18} color="gray" />
        </View>
        <Text className="text-muted-foreground">{label}</Text>
      </View>
      <Text className={`font-medium ${isCapitalized ? 'capitalize' : ''}`}>
        {value}
      </Text>
    </View>
  )
}
