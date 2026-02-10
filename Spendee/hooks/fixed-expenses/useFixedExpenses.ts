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

  const { mutateAsync: createFixedExpense, isPending: isCreatingFixedExpense } =
    useMutation({
      mutationFn: fixedExpenseService.create,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['fixed-expenses'] })
        router.dismissTo('/fixed')
        toastService.show('Gasto fijo creado con éxito', 'success')
      },
      onError: (error: Error) => {
        toastService.show(error.message, 'error')
      },
    })

  const { mutateAsync: editFixedExpense } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      fixedExpenseService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixed-expenses'] })
      queryClient.invalidateQueries({ queryKey: ['fixed-expense'] })
      router.dismissTo('/fixed')
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
      router.dismissTo('/fixed')
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
    isCreatingFixedExpense,
    editFixedExpense,
    deleteFixedExpense,
  }
}
