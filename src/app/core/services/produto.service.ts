import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProdutoDTO } from '../models/DTO/produto-dto';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private apiUrlProduto = 'http://localhost:8080/produtos';
  private apiUrlCategoria = 'http://localhost:8080/categorias';

  constructor(private http: HttpClient) { }

  cadastrarProduto(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrlProduto, formData);
  }

  cadastrarCategoria(dto: any): Observable<any> {
    return this.http.post<any>(this.apiUrlCategoria, dto);
  }

  listarCategorias(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlCategoria);
  }

  listarProdutosDoUsuario(): Observable<ProdutoDTO[]> {
    return this.http.get<ProdutoDTO[]>(this.apiUrlProduto);
  }

  atualizarProduto(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrlProduto}/${id}`, formData);
  }

  buscarPorId(id: number): Observable<ProdutoDTO> {
    return this.http.get<ProdutoDTO>(`${this.apiUrlProduto}/${id}`);
  }
}
