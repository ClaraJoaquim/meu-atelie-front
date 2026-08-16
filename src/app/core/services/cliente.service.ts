import { Injectable } from '@angular/core';
import { ClienteForm } from '../models/cliente-form';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CanalAquisicao } from '../models/canal-aquisicao';
import { ClienteResumo } from '../models/cliente-resumo';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private apiUrl = 'http://localhost:8080/clientes';

  constructor(private http: HttpClient) { }

  buscarCep(cep: string): Observable<any> {
    return this.http.get(`https://viacep.com.br/ws/${cep}/json/`);
  }

  cadastrarCliente(cliente: ClienteForm): Observable<ClienteForm> {
    const token = localStorage.getItem('token');
    return this.http.post<ClienteForm>(`${this.apiUrl}/cadastrar`, cliente, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

  }
  
  listarResumoClientes(): Observable<ClienteResumo[]> {
    const token = localStorage.getItem('token');
    return this.http.get<ClienteResumo[]>(`${this.apiUrl}/resumo`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  listarCanais(): Observable<CanalAquisicao[]> {
    return this.http.get<CanalAquisicao[]>(`${this.apiUrl}/canal-aquisicao`);
  }

  buscarClientePorId(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(`${this.apiUrl}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  atualizarCliente(id: number, cliente: ClienteForm): Observable<ClienteForm> {
    const token = localStorage.getItem('token');
    return this.http.put<ClienteForm>(`${this.apiUrl}/editar/${id}`, cliente, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  desativarCliente(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(`${this.apiUrl}/desativar/${id}`, { headers: { Authorization: `Bearer ${token}` } });
  }

  reativarCliente(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.patch(`${this.apiUrl}/${id}/reativar`, {}, { headers: { Authorization: `Bearer ${token}` } });
  }

  listarClientesInativos(): Observable<ClienteResumo[]> {
    const token = localStorage.getItem('token');
    return this.http.get<ClienteResumo[]>(`${this.apiUrl}/inativos`, { headers: { Authorization: `Bearer ${token}` } });
  }
}
