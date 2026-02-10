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
  X,
} from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import {
  FlatList,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native'
import ItemButton from './ItemButton'
import { Badge } from './ui/badge'

const METODOS_PAGO = [
  { id: 'tarjeta', label: 'Tarjeta', icon: CreditCard },
  { id: 'efectivo', label: 'Efectivo', icon: Wallet },
  { id: 'debito', label: 'Débito Auto.', icon: Landmark },
  { id: 'transferencia', label: 'Transf.', icon: ReceiptText },
]

interface FixedExpenseModalProps {
  visible: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  isSubmitting: boolean
  initialData?: any
}

export default function FixedExpenseModal({
  visible = false,
  onClose,
  onSubmit,
  isSubmitting,
  initialData,
}: FixedExpenseModalProps) {
  const { categoriesData } = useCategories()

  const [nombre, setNombre] = useState('')
  const [monto, setMonto] = useState('')
  const [dia, setDia] = useState(1)
  const [metodo, setMetodo] = useState('tarjeta')
  const [catId, setCatId] = useState<number | null>(null)

  const [view, setView] = useState<'form' | 'date' | 'categories'>('form')

  useEffect(() => {
    if (visible && initialData) {
      setNombre(initialData.nombre || '')
      setMonto(String(initialData.gasto || ''))
      setDia(initialData.diaDeVencimiento || 1)
      setMetodo(initialData.metodoPago || 'tarjeta')
      setCatId(initialData.categoriaId || null)
    } else if (visible && !initialData) {
      resetFields()
    }
  }, [visible, initialData])

  const isFormValid =
    nombre.trim() !== '' && monto.trim() !== '' && catId !== null

  const resetFields = () => {
    setNombre('')
    setMonto('')
    setDia(1)
    setMetodo('tarjeta')
    setCatId(null)
    setView('form')
  }

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
    if (!initialData) resetFields()
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
                ? initialData
                  ? 'Editar Gasto Fijo'
                  : 'Nuevo Gasto Fijo'
                : view === 'date'
                  ? 'Día de Vencimiento'
                  : 'Elegí Categoría'}
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (view === 'form') onClose()
                else setView('form')
              }}
            >
              <View className="bg-secondary/50 p-2 rounded-full">
                <X size={20} color="white" />
              </View>
            </TouchableOpacity>
          </View>

          {view === 'form' && (
            <View className="gap-4">
              <View className="gap-2">
                <Text className="font-medium ml-1">Nombre</Text>
                <Input
                  placeholder="Nombre (ej: Suscripción)"
                  maxLength={20}
                  value={nombre}
                  onChangeText={setNombre}
                />
              </View>

              <View className="gap-2">
                <Text className="font-medium ml-1">Monto mensual</Text>
                <Input
                  placeholder="Monto (ej: 20000)"
                  maxLength={9}
                  keyboardType="numeric"
                  value={monto}
                  onChangeText={setMonto}
                />
              </View>

              <View className="gap-2">
                <Text className="font-medium ml-1">Categoría</Text>
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
                        : 'Seleccionar...'}
                    </Text>
                  </View>
                  <ChevronRight size={20} color="gray" />
                </TouchableOpacity>
              </View>

              <View className="gap-3">
                <Text className="font-medium ml-1">Método de pago</Text>
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

              <Button
                className="mt-4"
                onPress={handleNext}
                disabled={!isFormValid}
              >
                <Text>Siguiente</Text>
              </Button>
            </View>
          )}

          {view === 'date' && (
            <View className="flex flex-col gap-6">
              <View className="items-center">
                <Text className="text-muted-foreground text-center mb-4">
                  ¿Qué día del mes se debita este gasto?
                </Text>
                <DayWheelPicker selectedDay={dia} onSelectDay={setDia} />
              </View>

              <Badge variant="secondary" className="py-3">
                <Text className="text-center">
                  {dia === 1
                    ? 'Vence el primer día de cada mes'
                    : dia === 31
                      ? 'Vence el último día de cada mes'
                      : `Vence el día ${dia} de cada mes`}
                </Text>
              </Badge>

              <Button onPress={handleSave} disabled={isSubmitting}>
                <Text>
                  {initialData ? 'Guardar Cambios' : 'Crear Gasto Fijo'}
                </Text>
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
                  background="background"
                  text={item.nombre}
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
