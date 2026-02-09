import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import React, { useState } from 'react'
import {
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

const FREQUENCIES = [
  { label: 'Semanal', value: 'WEEKLY' },
  { label: 'Mensual', value: 'MONTHLY' },
  { label: 'Anual', value: 'YEARLY' },
]

interface FixedIncomeModalProps {
  visible: boolean
  onClose: () => void
  onSubmit: ({}) => void
  isSubmitting: boolean
}

export default function FixedIncomeModal({
  visible = false,
  onClose,
  onSubmit,
  isSubmitting,
}: FixedIncomeModalProps) {
  const [ingreso, setIngreso] = useState('')
  const [frecuencia, setFrecuencia] = useState('MONTHLY')

  const handlePress = () => {
    if (!ingreso || isNaN(Number(ingreso))) return
    onSubmit({ ingreso: Number(ingreso), frecuencia })
    setIngreso('')
    onClose()
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-center bg-black/60 px-6">
          <TouchableWithoutFeedback>
            <View className="bg-background rounded-3xl p-6 border border-border">
              <Text className="text-xl font-bold mb-4">Nuevo Ingreso Fijo</Text>

              <View className="gap-4">
                <View className="gap-2">
                  <Text className="text-muted-foreground">
                    Monto del ingreso
                  </Text>
                  <Input
                    placeholder="Ej: 500000"
                    keyboardType="numeric"
                    value={ingreso}
                    onChangeText={setIngreso}
                    autoFocus
                  />
                </View>

                <View className="gap-2">
                  <Text className="text-muted-foreground">
                    Frecuencia de cobro
                  </Text>
                  <View className="flex-row gap-2">
                    {FREQUENCIES.map((freq) => (
                      <TouchableOpacity
                        key={freq.value}
                        onPress={() => setFrecuencia(freq.value)}
                        className={cn(
                          'flex-1 py-3 rounded-xl border items-center',
                          frecuencia === freq.value
                            ? 'bg-primary border-primary'
                            : 'bg-secondary/20 border-transparent',
                        )}
                      >
                        <Text
                          className={cn(
                            'font-medium',
                            frecuencia === freq.value
                              ? 'text-primary-foreground'
                              : 'text-foreground',
                          )}
                        >
                          {freq.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View className="flex-row gap-3 mt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onPress={onClose}
                  >
                    <Text>Cancelar</Text>
                  </Button>
                  <Button
                    className="flex-1"
                    onPress={handlePress}
                    disabled={isSubmitting}
                  >
                    <Text className="text-white font-bold">
                      {isSubmitting ? 'Cargando...' : 'Guardar'}
                    </Text>
                  </Button>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}
