import ApiService from './api.service'

export interface FixedExpenseResponse {
  id: number
  usuarioId: string
  nombre: string
  gasto: number
  diaDeVencimiento: number
  metodoPago: string
  categoriaId: number | null
}

class FixedExpenseService {
  public async findAll() {
    return await ApiService.get<FixedExpenseResponse[]>('/fixed-expense')
  }

  public async findById(fixedExpenseId: number) {
    return await ApiService.get<FixedExpenseResponse>(
      `/fixed-income/${fixedExpenseId}`,
    )
  }

  public async create(body: any) {
    return await ApiService.post('/fixed-expense/create', body)
  }

  public async update(fixedExpenseId: number, body: any) {
    return await ApiService.patch(`/fixed-expense/${fixedExpenseId}`, body)
  }

  public async delete(fixedExpenseId: number) {
    return await ApiService.delete(`/fixed-expense/${fixedExpenseId}`)
  }
}

const fixedExpenseService = new FixedExpenseService()
export default fixedExpenseService
