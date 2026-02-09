import DayWheelPicker from '@/components/ui/DayWheelPicker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import useCategories from '@/hooks/useCategories'
import { getIcon } from '@/lib/getIcon'
import { cn } from '@/lib/utils'
import {
  ChevronRight,
  CreditCard,
  Landmark,
  ReceiptText,
  Wallet,
} from 'lucide-react-native'
import React, { useState } from 'react'
import {
  FlatList,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native'
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated'
import ItemButton from './ItemButton'
import { Badge } from './ui/badge'

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
})

const METODOS_PAGO = [
  { id: 'tarjeta', label: 'Tarjeta', icon: CreditCard },
  { id: 'efectivo', label: 'Efectivo', icon: Wallet },
  { id: 'debito', label: 'Débito Auto.', icon: Landmark },
  { id: 'transferencia', label: 'Transf.', icon: ReceiptText },
]

interface FixedExpenseModalProps {
  visible: boolean
  onClose: () => void
  onSubmit: ({}) => void
  isSubmitting: boolean
}

export default function FixedExpenseModal({
  visible = false,
  onClose,
  onSubmit,
  isSubmitting,
}: FixedExpenseModalProps) {
  const { categoriesData } = useCategories()

  const [nombre, setNombre] = useState('')
  const [monto, setMonto] = useState('')
  const [dia, setDia] = useState(1)
  const [metodo, setMetodo] = useState('tarjeta')
  const [catId, setCatId] = useState<number | null>(null)

  const [view, setView] = useState<'form' | 'date' | 'categories'>('form')

  const isFormValid =
    nombre.trim() !== '' && monto.trim() !== '' && catId !== null

  const handleNext = () => {
    if (isFormValid) setView('date')
  }

  const handleSave = () => {
    onSubmit({
      nombre,
      gasto: Number(monto),
      diaDeVencimiento: dia,
      metodoPago: metodo,
      categoriaId: catId,
    })
    resetAndClose()
  }

  const resetAndClose = () => {
    setNombre('')
    setMonto('')
    setDia(1)
    setCatId(null)
    setView('form')
    onClose()
  }

  const selectedCategory = categoriesData?.find((c) => c.id === catId)

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60 justify-end">
        <View className="bg-background rounded-t-[32px] h-[90%] p-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold">
              {view === 'form'
                ? 'Nuevo Gasto Fijo'
                : view === 'date'
                  ? 'Día de Vencimiento'
                  : 'Elegí Categoría'}
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (view === 'form') onClose()
                else if (view === 'date') setView('form')
                else setView('form')
              }}
            >
              <Text className="text-primary font-bold">
                {view === 'form' ? 'Cerrar' : 'Volver'}
              </Text>
            </TouchableOpacity>
          </View>

          {view === 'form' && (
            <View className="gap-4">
              <View className="gap-4">
                <Text className="font-medium">Nombre</Text>
                <Input
                  placeholder="Nombre (ej: Suscripción)"
                  value={nombre}
                  onChangeText={setNombre}
                />
                <Text className="font-medium">Monto mensual</Text>
                <Input
                  placeholder="Monto (ej: $20000)"
                  keyboardType="numeric"
                  value={monto}
                  onChangeText={setMonto}
                />
              </View>

              <Text className="font-medium">Categoría</Text>
              <TouchableOpacity
                onPress={() => setView('categories')}
                className="flex-row items-center justify-between p-4 bg-secondary/20 rounded-2xl border border-border"
              >
                <View className="flex-row items-center gap-2">
                  <View
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor: selectedCategory?.color || 'gray',
                    }}
                  />
                  <Text
                    className={
                      catId ? 'text-foreground' : 'text-muted-foreground'
                    }
                  >
                    {selectedCategory
                      ? selectedCategory.nombre
                      : 'Elegir Categoría'}
                  </Text>
                </View>
                <ChevronRight size={20} color="gray" />
              </TouchableOpacity>

              <View className="gap-4">
                <Text className="font-medium">Método de pago</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-2">
                    {METODOS_PAGO.map((m) => (
                      <TouchableOpacity
                        key={m.id}
                        onPress={() => setMetodo(m.id)}
                        className={cn(
                          'flex-row items-center gap-2 px-4 py-2 rounded-full border',
                          metodo === m.id
                            ? 'bg-primary border-primary'
                            : 'bg-transparent border-border',
                        )}
                      >
                        <m.icon
                          size={16}
                          color={metodo === m.id ? 'black' : 'gray'}
                        />
                        <Text
                          className={
                            metodo === m.id
                              ? 'text-black font-medium'
                              : 'text-foreground'
                          }
                        >
                          {m.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <Button onPress={handleNext} disabled={!isFormValid}>
                <Text>Siguiente</Text>
              </Button>
            </View>
          )}

          {view === 'date' && (
            <View className="flex flex-col gap-4">
              <View className="items-center">
                <Text className="text-muted-foreground text-center">
                  Seleccioná el día del mes en que se debita este gasto
                  habitualmente.
                </Text>
                <DayWheelPicker selectedDay={dia} onSelectDay={setDia} />
              </View>
              {dia && (
                <Badge variant="secondary">
                  {dia === 1 ? (
                    <Text className="text-sm">
                      Vencerá el primer día de cada mes
                    </Text>
                  ) : dia === 31 ? (
                    <Text className="text-sm">
                      Vencerá el último día de cada mes
                    </Text>
                  ) : (
                    <Text className="text-sm">
                      Vencerá el {dia} de cada mes
                    </Text>
                  )}
                </Badge>
              )}

              <Button onPress={handleSave} disabled={isSubmitting}>
                <Text>Guardar Gasto Fijo</Text>
              </Button>
            </View>
          )}

          {view === 'categories' && (
            <FlatList
              data={categoriesData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }) => (
                <ItemButton
                  borderBottom={index !== (categoriesData?.length ?? 0) - 1}
                  editable={false}
                  iconLeft={getIcon(item.icono)}
                  iconLeftColor={item.color}
                  iconRight={ChevronRight}
                  iconRightColor="white"
                  background="background"
                  text={item.nombre}
                  badgeText={`$ ${item.totalGastos}`}
                  onPress={() => {
                    setCatId(item.id)
                    setView('form')
                  }}
                />
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  )
}
