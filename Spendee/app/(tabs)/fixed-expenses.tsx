import Container from '@/components/Container'
import ItemCard from '@/components/ItemCard'
import Section from '@/components/Section'
import SectionCard from '@/components/SectionCard'
import { Text } from '@/components/ui/text'
import { CalendarDays, CreditCard } from 'lucide-react-native'
import { FlatList, View } from 'react-native'
// import useFixedExpenses from '@/hooks/useFixedExpenses' // Tendrías que crearlo

export default function FixedExpensesPage() {
  // Supongamos que traes estos datos de un nuevo hook
  const fixedExpenses = [
    {
      id: 1,
      nombre: 'Netflix',
      monto: 5000,
      dia: 10,
      categoria: 'Entretenimiento',
    },
    { id: 2, nombre: 'Alquiler', monto: 200000, dia: 1, categoria: 'Hogar' },
    { id: 3, nombre: 'Alquiler', monto: 100, dia: 1, categoria: 'Hogar' },
  ]

  const totalFijos = fixedExpenses.reduce((acc, curr) => acc + curr.monto, 0)

  return (
    <Container>
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
          {}
          <View className="pt-4 border-t border-border">
            <Text className="text-muted-foreground">
              Te quedarán{' '}
              <Text className="text-green-500 font-bold">$45.000</Text> libres
              tras estos pagos.
            </Text>
          </View>
        </SectionCard>
      </Section>

      <Section title="Próximos Vencimientos">
        <FlatList
          scrollEnabled={false}
          data={fixedExpenses}
          renderItem={({ item }) => {
            const isK = item.monto % 1000 === 0
            const isM = item.monto % 1000000 === 0
            return (
              <ItemCard
                title={item.nombre}
                description={`Vence el día ${item.dia} de cada mes`}
                badgeText={`$${isK ? item.monto / 1000 + 'K' : isM ? item.monto / 1000000 + 'M' : item.monto}`}
                icon={CreditCard}
                onPress={() => {
                  /* Modal para editar o marcar como pagado */
                }}
              />
            )
          }}
        />
      </Section>
    </Container>
  )
}
