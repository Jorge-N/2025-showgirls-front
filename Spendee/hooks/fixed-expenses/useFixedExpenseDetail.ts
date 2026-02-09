import fixedExpenseService from '@/services/fixed-expense.service'
import { useQuery } from '@tanstack/react-query'

export default function useFixedExpenseDetail(fixedExpenseId: number) {
  const { data, isLoading: isFixedExpenseLoading } = useQuery({
    queryKey: ['fixed-expense', fixedExpenseId],
    queryFn: () => fixedExpenseService.findById(fixedExpenseId),
  })

  return { fixedExpenseDetail: data?.data, isFixedExpenseLoading }
}
