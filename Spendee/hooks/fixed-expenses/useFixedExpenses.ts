import { toastService } from '@/context/ToastContext'
import fixedExpenseService from '@/services/fixed-expense.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'

export default function useFixedExpenses() {
  const queryClient = useQueryClient()
  const { data, isLoading: isFixedExpensesLoading } = useQuery({
    queryKey: ['fixed-expenses'],
    queryFn: fixedExpenseService.findAll,
  })

  const { mutateAsync: createFixedExpense } = useMutation({
    mutationFn: fixedExpenseService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixed-expenses'] })
      router.replace('/fixed-expenses')
      toastService.show('Gasto fijo creado con éxito', 'success')
    },
    onError: (error: Error) => {
      toastService.show(error.message, 'error')
    },
  })

  const { mutateAsync: editFixedExpense } = useMutation({
    mutationFn: fixedExpenseService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixed-expenses'] })
      router.replace('/fixed-expenses')
      toastService.show('Gasto fijo editado con éxito', 'success')
    },
    onError: (error: Error) => {
      toastService.show(error.message, 'error')
    },
  })

  const { mutateAsync: deleteFixedExpense } = useMutation({
    mutationFn: fixedExpenseService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixed-expenses'] })
      router.replace('/fixed-expenses')
      toastService.show('Gasto fijo eliminado con éxito', 'success')
    },
    onError: (error: Error) => {
      toastService.show(error.message, 'error')
    },
  })

  return {
    fixedExpenses: data?.data,
    isFixedExpensesLoading,
    createFixedExpense,
    editFixedExpense,
    deleteFixedExpense,
  }
}
