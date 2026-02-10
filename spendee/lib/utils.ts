import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getProximosVencimientos = (gastos: any[], limit: number = 3) => {
  const hoy = new Date().getDate()

  return [...gastos]
    .map((gasto) => {
      let diasFaltantes

      if (gasto.diaDeVencimiento >= hoy) {
        diasFaltantes = gasto.diaDeVencimiento - hoy
      } else {
        diasFaltantes = 30 - hoy + gasto.diaDeVencimiento
      }

      return { ...gasto, diasFaltantes }
    })
    .sort((a, b) => a.diasFaltantes - b.diasFaltantes)
    .slice(0, limit)
}

import {
  Banknote,
  CreditCard,
  Landmark,
  LucideIcon,
  ReceiptText,
} from 'lucide-react-native'

export const getPaymentMethodIcon = (metodoId: string): LucideIcon => {
  const icons: Record<string, LucideIcon> = {
    tarjeta: CreditCard,
    efectivo: Banknote,
    debito: Landmark,
    transferencia: ReceiptText,
  }

  return icons[metodoId] || CreditCard
}
