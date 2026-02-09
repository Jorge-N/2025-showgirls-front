import ApiService from './api.service'

enum Frequency {
  MONTHLY = 'Mensual',
  WEEKLY = 'Semanal',
  YEARLY = 'Anual',
}

export interface FixedIncomeResponse {
  id: number
  usuarioId: string
  ingreso: number
  frecuencia: Frequency
}

class FixedIncomeService {
  public async findAll() {
    return await ApiService.get<FixedIncomeResponse[]>('/fixed-income')
  }

  public async findById(fixedIncomeId: number) {
    return await ApiService.get<FixedIncomeResponse>(
      `/fixed-income/${fixedIncomeId}`,
    )
  }

  public async create(body: any) {
    return await ApiService.post('/fixed-income/create', body)
  }

  public async update(fixedIncomeId: number, body: any) {
    return await ApiService.patch(`/fixed-income/${fixedIncomeId}`, body)
  }

  public async delete(fixedIncomeId: number) {
    return await ApiService.delete(`/fixed-income/${fixedIncomeId}`)
  }
}

const fixedIncomeService = new FixedIncomeService()
export default fixedIncomeService
