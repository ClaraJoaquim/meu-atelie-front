import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PeriodoTipo } from '../models/DTO/periodo-tipo';
import { IndicadoresPeriodoDTO } from '../models/DTO/indicadores-periodo-dto';
import { FaturamentoMensalDTO } from '../models/DTO/faturamento-mensal-dto';
import { RankingProdutoDTO } from '../models/DTO/ranking-produto-dto';
import { RankingClienteDTO } from '../models/DTO/ranking-cliente-dto';

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {
  private apiUrl = 'http://localhost:8080/relatorios';

  constructor(private http: HttpClient) {}

  buscarIndicadores(periodo: PeriodoTipo): Observable<IndicadoresPeriodoDTO> {
    const params = new HttpParams().set('periodo', periodo);
    return this.http.get<IndicadoresPeriodoDTO>(`${this.apiUrl}/indicadores`, { params });
  }

  buscarFaturamentoMensal(ano?: number): Observable<FaturamentoMensalDTO[]> {
    let params = new HttpParams();
    if (ano) {
      params = params.set('ano', ano);
    }
    return this.http.get<FaturamentoMensalDTO[]>(`${this.apiUrl}/faturamento-mensal`, { params });
  }

  buscarRankingProdutos(periodo: PeriodoTipo): Observable<RankingProdutoDTO[]> {
    const params = new HttpParams().set('periodo', periodo);
    return this.http.get<RankingProdutoDTO[]>(`${this.apiUrl}/ranking-produtos`, { params });
  }

  buscarRankingClientes(periodo: PeriodoTipo, limite?: number): Observable<RankingClienteDTO[]> {
    let params = new HttpParams().set('periodo', periodo);
    if (limite) {
      params = params.set('limite', limite);
    }
    return this.http.get<RankingClienteDTO[]>(`${this.apiUrl}/ranking-clientes`, { params });
  }
}
