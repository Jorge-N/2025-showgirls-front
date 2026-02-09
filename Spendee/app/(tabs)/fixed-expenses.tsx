import Container from '@/components/Container'
import FixedExpenseModal from '@/components/FixedExpenseModal'
import FixedIncomeModal from '@/components/FixedIncomeModal'
import ItemCard from '@/components/ItemCard'
import Section from '@/components/Section'
import SectionCard from '@/components/SectionCard'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import useFixedExpenses from '@/hooks/fixed-expenses/useFixedExpenses'
import useFixedIncomes from '@/hooks/fixed-incomes/useFixedIncomes'
import { CalendarDays, CreditCard } from 'lucide-react-native'
import { useState } from 'react'
import { FlatList, View } from 'react-native'

export default function FixedExpensesPage() {
  const [incomeModalVisible, setIncomeModalVisible] = useState(false)
  const [expenseModalVisible, setExpenseModalVisible] = useState(false)

  const {
    fixedExpenses,
    isFixedExpensesLoading,
    createFixedExpense,
    isCreatingFixedExpense,
  } = useFixedExpenses()
  const {
    fixedIncomes,
    isFixedIncomesLoading,
    createFixedIncome,
    isCreatingFixedIncome,
  } = useFixedIncomes()

  if (isFixedExpensesLoading || isFixedIncomesLoading)
    return <Container activity />
  if (!fixedExpenses || !fixedIncomes) return null

  const hasIncomes = fixedIncomes.length > 0
  const hasExpenses = fixedExpenses.length > 0

  if (!hasIncomes || !hasExpenses) {
    const isStep1 = !hasIncomes

    return (
      <Container>
        <View className="flex-1 justify-center items-center p-6">
          <View className="bg-primary/10 p-6 rounded-full mb-6">
            <CalendarDays size={80} color="#16a34a" />
          </View>

          <Text className="text-3xl font-bold text-center mb-2">
            {isStep1 ? '¡Empecemos tu plan!' : 'Casi listo...'}
          </Text>

          <Text className="text-muted-foreground text-center text-lg mb-8">
            {isStep1
              ? 'Para calcular tu dinero libre, primero necesitamos saber cuánto dinero recibes de forma regular.'
              : 'Perfecto. Ahora añade tus gastos fijos (alquiler, Netflix, servicios) para completar tu flujo mensual.'}
          </Text>

          <Button
            variant="ghost"
            onPress={() => {
              if (isStep1) {
                setIncomeModalVisible(true)
              } else {
                setExpenseModalVisible(true)
              }
            }}
          >
            <Text>
              {isStep1 ? 'Añadir mi primer ingreso' : 'Añadir mi primer gasto'}
            </Text>
          </Button>
        </View>

        <FixedIncomeModal
          visible={incomeModalVisible}
          onClose={() => setIncomeModalVisible(false)}
          onSubmit={(data) => createFixedIncome(data)}
          isSubmitting={isCreatingFixedIncome}
        />
        <FixedExpenseModal
          visible={expenseModalVisible}
          onClose={() => setExpenseModalVisible(false)}
          onSubmit={(data) => createFixedExpense(data)}
          isSubmitting={isCreatingFixedExpense}
        />
      </Container>
    )
  }

  const totalFijos = fixedExpenses.reduce((acc, curr) => acc + curr.gasto, 0)

  return (
    <Container activity={isFixedExpensesLoading || isFixedIncomesLoading}>
      <Section title="Tus Gastos Fijos">
        <SectionCard className="bg-primary/10">
          <CalendarDays size={32} color="gray" />
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-muted-foreground">
                Total en Gastos Fijos
              </Text>
              <Text className="text-3xl font-bold">
                ${new Intl.NumberFormat('es-AR').format(totalFijos)}
              </Text>
            </View>
          </View>
          <View className="pt-4 border-t border-border">
            <View className="flex-row items-center justify-between">
              <Text>Te quedarán</Text>
              <Text className="text-green-500 font-bold">$45.000</Text>
              <Text>libres tras estos pagos</Text>
            </View>
          </View>
        </SectionCard>
      </Section>

      <Section title="Próximos Vencimientos">
        <FlatList
          scrollEnabled={false}
          data={fixedExpenses}
          renderItem={({ item }) => {
            const isK = item.gasto % 1000 === 0
            const isM = item.gasto % 1000000 === 0
            return (
              <ItemCard
                title={item.nombre}
                description={`Vence el día ${item.diaDeVencimiento} de cada mes`}
                badgeText={`$${isK ? item.gasto / 1000 + 'K' : isM ? item.gasto / 1000000 + 'M' : item.gasto}`}
                icon={CreditCard}
                onPress={() => {}}
              />
            )
          }}
        />
      </Section>
    </Container>
  )
}
