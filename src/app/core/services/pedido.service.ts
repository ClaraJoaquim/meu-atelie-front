import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
private apiUrl = 'http://localhost:8080/api/encomendas';

  constructor(private http: HttpClient) {}

  salvarEncomenda(dados: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, dados);
  }

  atualizar(id: number, dados: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dados);
  }

  listarTodas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  listarStatus(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/status`);
  }

  obterDashboard(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard`);
  }
}
