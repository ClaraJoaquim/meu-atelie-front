import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FornecedorDTO } from '../models/DTO/fornecedor-dto';
import { FornecedorForm } from '../models/Form/fornecedor-form';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {
  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:8080/fornecedores';

  listarTodos(): Observable<FornecedorDTO[]> {
    return this.http.get<FornecedorDTO[]>(`${this.apiUrl}/listar`);
  }

  salvar(fornecedor: FornecedorForm): Observable<FornecedorDTO> {
    return this.http.post<FornecedorDTO>(`${this.apiUrl}/cadastrar`, fornecedor);
  }
}