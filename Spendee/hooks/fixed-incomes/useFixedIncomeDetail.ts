import fixedIncomeService from '@/services/fixed-income.service'
import { useQuery } from '@tanstack/react-query'

export default function useFixedIncomeDetail(fixedIncomeId: number) {
  const { data, isLoading: isFixedIncomeLoading } = useQuery({
    queryKey: ['fixed-Income', fixedIncomeId],
    queryFn: () => fixedIncomeService.findById(fixedIncomeId),
  })

  return { fixedIncomeDetail: data?.data, isFixedIncomeLoading }
}
