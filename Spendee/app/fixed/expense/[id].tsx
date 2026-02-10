import FixedExpenseModal from '@/components/FixedExpenseModal'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import useFixedExpenseDetail from '@/hooks/fixed-expenses/useFixedExpenseDetail'
import useFixedExpenses from '@/hooks/fixed-expenses/useFixedExpenses'
import { getPaymentMethodIcon } from '@/lib/utils'
import { useLocalSearchParams } from 'expo-router'
import { Calendar, Edit3, Tag, Trash2 } from 'lucide-react-native'
import React, { useState } from 'react'
import { Alert, ScrollView, View } from 'react-native'

export default function FixedExpenseDetailScreen() {
  const { id } = useLocalSearchParams()
  const expenseId = Number(id)
  console.log(expenseId)

  const { fixedExpenseDetail: expense, isFixedExpenseLoading } =
    useFixedExpenseDetail(expenseId)
  const { deleteFixedExpense, editFixedExpense } = useFixedExpenses()

  const [isEditModalVisible, setIsEditModalVisible] = useState(false)

  if (isFixedExpenseLoading)
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Cargando...</Text>
      </View>
    )
  if (!expense)
    return (
      <View className="flex-1 justify-center items-center">
        <Text>No se encontró el gasto</Text>
      </View>
    )

  const PaymentIcon = getPaymentMethodIcon(expense.metodoPago)

  const handleDelete = () => {
    Alert.alert(
      'Eliminar Gasto',
      '¿Estás seguro de que querés borrar este gasto fijo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deleteFixedExpense(expenseId),
        },
      ],
    )
  }

  return (
    <ScrollView className="flex-1 p-6">
      <View className="items-center my-8">
        <Text className="text-muted-foreground mb-2">Monto mensual</Text>
        <Text className="text-5xl font-bold text-primary">
          $ {Number(expense.gasto).toLocaleString()}
        </Text>
      </View>

      <Card className="gap-4 p-6 rounded-[32px] border border-border">
        <DetailRow icon={Tag} label="Nombre" value={expense.nombre} />
        <DetailRow
          icon={Calendar}
          label="Día de vencimiento"
          value={`Día ${expense.diaDeVencimiento}`}
        />
        <DetailRow
          icon={PaymentIcon}
          label="Método de pago"
          value={expense.metodoPago}
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

      <FixedExpenseModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        isSubmitting={false}
        onSubmit={(data) => {
          editFixedExpense({ id: expenseId, data: data })
          setIsEditModalVisible(false)
        }}
        initialData={expense}
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
