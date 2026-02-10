import useFixedExpenses from '@/hooks/fixed-expenses/useFixedExpenses'
import useFixedIncomes from '@/hooks/fixed-incomes/useFixedIncomes'
import { CalendarDays } from 'lucide-react-native'
import { Text, View } from 'react-native'
import Container from '../Container'
import FixedExpenseModal from '../FixedExpenseModal'
import FixedIncomeModal from '../FixedIncomeModal'
import { Button } from '../ui/button'

interface OnboardingFixedProps {
  isStep1: boolean
  setIncomeModalVisible: (_bool: boolean) => void
  setExpenseModalVisible: (_bool: boolean) => void
  incomeModalVisible: boolean
  expenseModalVisible: boolean
}

export default function OnboardingFixed({
  isStep1,
  setIncomeModalVisible,
  setExpenseModalVisible,
  incomeModalVisible,
  expenseModalVisible,
}: OnboardingFixedProps) {
  const { createFixedExpense, isCreatingFixedExpense } = useFixedExpenses()
  const { createFixedIncome, isCreatingFixedIncome } = useFixedIncomes()
  return (
    <Container>
      <View className="flex-1 justify-center items-center p-6">
        <View className="bg-primary/10 p-6 rounded-full mb-6">
          <CalendarDays size={80} color="#16a34a" />
        </View>

        <Text className="text-3xl font-bold text-center mb-2 text-primary">
          {isStep1 ? '¡Empecemos tu plan!' : 'Casi listo...'}
        </Text>

        <Text className="text-muted-foreground text-center text-lg mb-8">
          {isStep1
            ? 'Para comenzar con tu seguimiento de gastos fijos, primero necesitamos saber cuánto dinero recibís de forma regular.'
            : 'Perfecto. Ahora añadí un gasto fijos (alquiler, Netflix, servicios) para completar tu flujo mensual.'}
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
          <Text className="text-primary">
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
