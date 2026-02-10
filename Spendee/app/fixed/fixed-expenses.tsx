import Container from '@/components/Container'
import FixedExpenseModal from '@/components/FixedExpenseModal'
import ItemCard from '@/components/ItemCard'
import Section from '@/components/Section'
import SectionCard from '@/components/SectionCard'
import { Button } from '@/components/ui/button'
import DollarSignSpinner from '@/components/ui/DollarSignSpinner'
import { Text } from '@/components/ui/text'
import useFixedExpenses from '@/hooks/fixed-expenses/useFixedExpenses'
import { getPaymentMethodIcon } from '@/lib/utils'
import { router } from 'expo-router'
import { CalendarDays, CreditCard, Plus } from 'lucide-react-native'
import { useState } from 'react'
import { FlatList, View } from 'react-native'

export default function FixedExpensesPage() {
  const {
    fixedExpenses,
    isFixedExpensesLoading,
    createFixedExpense,
    isCreatingFixedExpense,
  } = useFixedExpenses()

  const [expenseModalVisible, setExpenseModalVisible] = useState(false)

  if (!fixedExpenses) {
    return (
      <Container>
        <DollarSignSpinner />
      </Container>
    )
  }
  const totalMensual = fixedExpenses.reduce(
    (acc, curr) => acc + Number(curr.gasto),
    0,
  )

  return (
    <Container activity={isCreatingFixedExpense}>
      <FixedExpenseModal
        visible={expenseModalVisible}
        onClose={() => setExpenseModalVisible(false)}
        onSubmit={(data) => createFixedExpense(data)}
        isSubmitting={isCreatingFixedExpense}
      />
      <Section title="Tus Gastos Fijos">
        <SectionCard className="bg-primary/10">
          <CalendarDays size={32} color="gray" />
          <View className="flex-row justify-between items-center">
            <View className="flex items-center">
              <Text className="text-muted-foreground">
                Total en Gastos Fijos (mensual)
              </Text>
              <Text className="text-3xl font-bold">
                ${new Intl.NumberFormat('es-AR').format(totalMensual)}
              </Text>
            </View>
          </View>
        </SectionCard>
        <Button variant="ghost" onPress={() => setExpenseModalVisible(true)}>
          <Plus color="white" size={15} />
          <Text>Añadir gasto fijo</Text>
        </Button>
      </Section>

      <Section>
        <FlatList
          scrollEnabled={false}
          data={fixedExpenses}
          renderItem={({ item }) => {
            const icon =
              item.metodoPago === 'tarjeta'
                ? CreditCard
                : item.metodoPago === ''
            const isK = item.gasto % 1000 === 0
            const isM = item.gasto % 1000000 === 0
            return (
              <ItemCard
                title={item.nombre}
                description={`Vence el ${item.diaDeVencimiento} de cada mes`}
                badgeText={`$${isK && !isM ? item.gasto / 1000 + 'K' : isM ? item.gasto / 1000000 + 'M' : item.gasto}`}
                icon={getPaymentMethodIcon(item.metodoPago)}
                onPress={() => {
                  router.push({
                    pathname: '/fixed/expense/[id]',
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
