import { toastService } from '@/context/ToastContext'
import fixedIncomeService from '@/services/fixed-income.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'

export default function useFixedIncomes() {
  const queryClient = useQueryClient()
  const { data, isLoading: isFixedIncomesLoading } = useQuery({
    queryKey: ['fixed-incomes'],
    queryFn: fixedIncomeService.findAll,
  })

  const { mutateAsync: createFixedIncome, isPending: isCreatingFixedIncome } =
    useMutation({
      mutationFn: fixedIncomeService.create,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['fixed-incomes'] })
        router.replace('/fixed-incomes')
        toastService.show('Ingreso fijo creado con éxito', 'success')
      },
      onError: (error: Error) => {
        toastService.show(error.message, 'error')
      },
    })

  const { mutateAsync: editFixedIncome } = useMutation({
    mutationFn: fixedIncomeService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixed-incomes'] })
      router.replace('/fixed-incomes')
      toastService.show('Ingreso fijo editado con éxito', 'success')
    },
    onError: (error: Error) => {
      toastService.show(error.message, 'error')
    },
  })

  const { mutateAsync: deleteFixedIncome } = useMutation({
    mutationFn: fixedIncomeService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixed-incomes'] })
      toastService.show('Ingreso fijo eliminado con éxito', 'success')
    },
    onError: (error: Error) => {
      toastService.show(error.message, 'error')
    },
  })

  return {
    fixedIncomes: data?.data,
    isFixedIncomesLoading,
    createFixedIncome,
    isCreatingFixedIncome,
    editFixedIncome,
    deleteFixedIncome,
  }
}
