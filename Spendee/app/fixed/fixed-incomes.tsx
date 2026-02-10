import Container from '@/components/Container'
import FixedIncomeModal from '@/components/FixedIncomeModal'
import ItemCard from '@/components/ItemCard'
import Section from '@/components/Section'
import SectionCard from '@/components/SectionCard'
import { Button } from '@/components/ui/button'
import DollarSignSpinner from '@/components/ui/DollarSignSpinner'
import { Text } from '@/components/ui/text'
import useFixedIncomes from '@/hooks/fixed-incomes/useFixedIncomes'
import { formatCurrencyShort } from '@/lib/utils'
import { Frequency } from '@/services/fixed-income.service'
import { router } from 'expo-router'
import { CalendarDays, DollarSign, Plus } from 'lucide-react-native'
import { useState } from 'react'
import { FlatList, View } from 'react-native'

export default function FixedIncomesPage() {
  const { fixedIncomes, createFixedIncome, isCreatingFixedIncome } =
    useFixedIncomes()

  const [incomeModalVisible, setIncomeModalVisible] = useState(false)

  if (!fixedIncomes) {
    return (
      <Container>
        <DollarSignSpinner />
      </Container>
    )
  }
  const totalMensual = fixedIncomes.reduce((acc, curr) => {
    const monto = Number(curr.ingreso)
    const frecuencia = curr.frecuencia as unknown as keyof typeof Frequency
    let valorMensualizado = 0

    if (frecuencia === 'WEEKLY') {
      valorMensualizado = monto * 4
    } else if (frecuencia === 'YEARLY') {
      valorMensualizado = monto / 12
    } else {
      valorMensualizado = monto
    }

    return acc + valorMensualizado
  }, 0)

  return (
    <Container activity={isCreatingFixedIncome}>
      <FixedIncomeModal
        visible={incomeModalVisible}
        onClose={() => setIncomeModalVisible(false)}
        onSubmit={(data) => createFixedIncome(data)}
        isSubmitting={isCreatingFixedIncome}
      />
      <Section title="Tus Ingresos Fijos">
        <SectionCard className="bg-primary/10">
          <CalendarDays size={32} color="gray" />
          <View className="flex-row justify-between items-center">
            <View className="flex items-center">
              <Text className="text-muted-foreground">
                Total en Ingresos Fijos (mensual)
              </Text>
              <Text className="text-3xl font-bold">
                ${new Intl.NumberFormat('es-AR').format(totalMensual)}
              </Text>
            </View>
          </View>
        </SectionCard>
        <Button variant="ghost" onPress={() => setIncomeModalVisible(true)}>
          <Plus color="white" size={15} />
          <Text>Añadir ingreso fijo</Text>
        </Button>
      </Section>

      <Section>
        <FlatList
          scrollEnabled={false}
          data={fixedIncomes}
          renderItem={({ item }) => {
            return (
              <ItemCard
                title={'Ingreso'}
                description={
                  Frequency[
                    item.frecuencia as unknown as keyof typeof Frequency
                  ]
                }
                badgeText={`$${formatCurrencyShort(item.ingreso)}`}
                icon={DollarSign}
                onPress={() => {
                  router.push({
                    pathname: '/fixed/income/[id]',
                    params: { id: item.id },
                  })
                }}
              />
            )
          }}
        />
      </Section>
    </Container>
  )
}
