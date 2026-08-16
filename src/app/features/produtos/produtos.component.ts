import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necessário para o @for e pipes
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { Router, RouterModule } from '@angular/router';
import { ProdutoService } from '../../core/services/produto.service'; // Ajuste o caminho se necessário
import { ProdutoDTO } from '../../core/models/DTO/produto-dto';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterModule, CommonModule, FormsModule],
  templateUrl: './produtos.component.html',
  styleUrl: './produtos.component.css'
})
export class ProdutosComponent implements OnInit {
  produtos: ProdutoDTO[] = [];
  totalProdutos: number = 0;
  totalDisponiveis: number = 0;
  totalIndisponiveis: number = 0;
  totalSobEncomenda: number = 0;

  produtosFiltrados: ProdutoDTO[] = [];
  termoBusca: string = '';
  statusSelecionado: string = 'disponivel';

  constructor(
    private produtoService: ProdutoService,
    private router: Router
  ) { }

  ngOnInit() {
    this.carregarProdutos();
  }

  carregarProdutos() {
  this.produtoService.listarProdutosDoUsuario().subscribe({
    next: (data) => {
      this.produtos = data;

      this.aplicarFiltros(); 
      this.calcularResumo();
    },
    error: (err) => {
      console.error('Erro ao buscar produtos:', err);
    }
  });
}
  calcularResumo() {
    this.totalProdutos = this.produtos.length;

    this.totalDisponiveis = this.produtos.filter(p => p.status === 'disponivel').length;
    this.totalIndisponiveis = this.produtos.filter(p => p.status === 'indisponivel').length;
  }

  aplicarFiltros() {
  this.produtosFiltrados = this.produtos.filter(p => {
    // 1. Filtro de Busca
    const buscaMatch = this.termoBusca === '' || 
      p.nome.toLowerCase().includes(this.termoBusca.toLowerCase()) ||
      (p.nomeCategoria && p.nomeCategoria.toLowerCase().includes(this.termoBusca.toLowerCase()));

    // 3. Filtro de Status
    const statusMatch = this.statusSelecionado === 'Todos' || p.status === this.statusSelecionado;

    return buscaMatch && statusMatch;
  });
}

  // Método para navegação de edição
editar(produto: ProdutoDTO) {
  // Você precisará de uma rota /produtos/editar/:id no seu app.routes.ts
  this.router.navigate(['/produtos/editar', produto.id]);
}

alternarStatus(produto: ProdutoDTO) {
  const novoStatus = produto.status === 'disponivel' ? 'indisponivel' : 'disponivel';
  
  // Criamos um FormData para o update parcial
  const formData = new FormData();
  const dtoAtualizado = { ...produto, status: novoStatus };
  formData.append('produto', new Blob([JSON.stringify(dtoAtualizado)], { type: 'application/json' }));

  this.produtoService.atualizarProduto(produto.id!, formData).subscribe({
    next: () => {
      this.carregarProdutos(); // Recarrega a lista
    },
    error: (err) => console.error('Erro ao atualizar status', err)
  });
}


selecionarStatus(status: string) {
  this.statusSelecionado = status;
  this.aplicarFiltros();
}

}