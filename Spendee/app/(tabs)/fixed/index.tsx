import Container from '@/components/Container'
import ItemCard from '@/components/ItemCard'
import OnboardingFixed from '@/components/pages/OnboardingFixed'
import Section from '@/components/Section'
import SectionCard from '@/components/SectionCard'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import useFixedExpenses from '@/hooks/fixed-expenses/useFixedExpenses'
import useFixedIncomes from '@/hooks/fixed-incomes/useFixedIncomes'
import {
  formatCurrencyShort,
  getPaymentMethodIcon,
  getProximosVencimientos,
} from '@/lib/utils'
import { Frequency } from '@/services/fixed-income.service'
import { router } from 'expo-router'
import { CalendarDays } from 'lucide-react-native'
import { useState } from 'react'
import { FlatList, View } from 'react-native'

export default function FixedPage() {
  const [incomeModalVisible, setIncomeModalVisible] = useState(false)
  const [expenseModalVisible, setExpenseModalVisible] = useState(false)

  const { fixedExpenses, isFixedExpensesLoading } = useFixedExpenses()
  const { fixedIncomes, isFixedIncomesLoading } = useFixedIncomes()

  if (isFixedExpensesLoading || isFixedIncomesLoading)
    return <Container activity />
  if (!fixedExpenses || !fixedIncomes) return null

  const hasIncomes = fixedIncomes.length > 0
  const hasExpenses = fixedExpenses.length > 0

  if (!hasIncomes || !hasExpenses) {
    const isStep1 = !hasIncomes

    return (
      <OnboardingFixed
        isStep1={isStep1}
        incomeModalVisible={incomeModalVisible}
        expenseModalVisible={expenseModalVisible}
        setIncomeModalVisible={setIncomeModalVisible}
        setExpenseModalVisible={setExpenseModalVisible}
      />
    )
  }

  const totalGastosFijos = fixedExpenses.reduce(
    (acc, curr) => acc + Number(curr.gasto),
    0,
  )
  const totalIngresosFijos = fixedIncomes.reduce((acc, curr) => {
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

  const dineroLibre = totalIngresosFijos - totalGastosFijos

  return (
    <Container activity={isFixedExpensesLoading || isFixedIncomesLoading}>
      <Section title="Tu Dinero Libre">
        <SectionCard>
          <CalendarDays size={32} color="gray" />
          <View className="flex flex-col items-center gap-4">
            <View className="flex items-center">
              <Text className="text-muted-foreground">
                Total en Ingresos Fijos (mensual)
              </Text>
              <Button
                variant="ghost"
                size="lg"
                onPress={() => router.push('/fixed/fixed-incomes')}
              >
                <Text className="text-3xl font-bold">
                  $
                  {new Intl.NumberFormat('es-AR', {
                    maximumFractionDigits: 0,
                  }).format(totalIngresosFijos)}
                </Text>
              </Button>
            </View>
            <View className="flex items-center">
              <Text className="text-muted-foreground">
                Total en Gastos Fijos (mensual)
              </Text>
              <Button
                variant="ghost"
                size="lg"
                onPress={() => router.push('/fixed/fixed-expenses')}
              >
                <Text className="text-3xl font-bold">
                  $
                  {new Intl.NumberFormat('es-AR', {
                    maximumFractionDigits: 0,
                  }).format(totalGastosFijos)}
                </Text>
              </Button>
            </View>
          </View>
          <View className="pt-4 border-t border-border">
            <View className="flex-row items-center justify-between">
              {dineroLibre < 0 ? (
                <Text className="text-center">
                  Actualmente estás{' '}
                  <Text className="text-destructive">
                    gastando $
                    {new Intl.NumberFormat('es-AR', {
                      maximumFractionDigits: 0,
                    }).format(-dineroLibre)}{' '}
                    más
                  </Text>{' '}
                  de lo que te ingresa
                </Text>
              ) : (
                <>
                  <Text className="text-center">
                    Te quedarán{' '}
                    <Text className="text-green-500 font-semibold">
                      ${new Intl.NumberFormat('es-AR').format(dineroLibre)}
                    </Text>{' '}
                    libres
                  </Text>
                </>
              )}
            </View>
          </View>
        </SectionCard>
      </Section>

      <Section title="Próximos Vencimientos">
        <FlatList
          scrollEnabled={false}
          data={getProximosVencimientos(fixedExpenses)}
          renderItem={({ item }) => {
            return (
              <ItemCard
                title={item.nombre}
                description={`Vence el día ${item.diaDeVencimiento} de cada mes`}
                badgeText={`$${formatCurrencyShort(item.gasto)}`}
                icon={getPaymentMethodIcon(item.metodoPago)}
                onPress={() =>
                  router.push({
                    pathname: '/fixed/expense/[id]',
                    params: { id: item.id },
                  })
                }
              />
            )
          }}
        />
      </Section>
    </Container>
  )
}
