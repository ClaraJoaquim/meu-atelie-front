import { Component, inject, OnInit } from '@angular/core';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { RouterModule } from '@angular/router';
import { PedidoService } from '../../core/services/pedido.service';
import { EncomendaDTO } from '../../core/models/DTO/encomenda-dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pedidos',
  imports: [FooterComponent, HeaderComponent, RouterModule, CommonModule, FormsModule],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})

export class PedidosComponent implements OnInit {
  private pedidoService = inject(PedidoService);
  pedidos: EncomendaDTO[] = [];
  paginaAtual: number = 1;
  itensPorPagina: number = 10;

  searchTerm: string = '';
  startDate: string = '';
  endDate: string = '';
  statusFiltro: string = 'TODOS';

  ngOnInit(): void {
    this.pedidoService.listarTodas().subscribe({
    next: (data) => {
      const ordenados = data.sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
      this.pedidos = ordenados.map((pedido, index) => ({
        ...pedido,
        idVisual: index + 1 
      }));
    },
    error: (err) => console.error('Erro ao buscar encomendas:', err)
  });
  }

  getStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'EM_ANDAMENTO': return 'status--progress';
      case 'FINALIZADO': return 'status--done';
      case 'ORCAMENTO': return 'status--orcamento';
      case 'CANCELADO': return 'status--late';
      default: return '';
    }
  }

  formatStatus(status: string): string {
    const mapa: Record<string, string> = {
      'EM_ANDAMENTO': 'Em andamento',
      'FINALIZADO': 'Finalizado',
      'ORCAMENTO': 'Orçamento'
    };
    return mapa[status?.toUpperCase()] || status;
  }

  obterStatusAjustado(statusObj: any): string {
    if (!statusObj || !statusObj.descricao) return '';
    return statusObj.descricao
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .replace(' ', '_');
  }

  get totalPedidos() { return this.pedidos.length; }
  get totalEmAndamento() { return this.pedidos.filter(p => this.obterStatusAjustado(p.status) === 'EM_ANDAMENTO').length; }
  get totalFinalizados() { return this.pedidos.filter(p => this.obterStatusAjustado(p.status) === 'FINALIZADO').length; }
  get totalOrcamento() { return this.pedidos.filter(p => this.obterStatusAjustado(p.status) === 'ORCAMENTO').length; }
  get totalCancelados() { return this.pedidos.filter(p => this.obterStatusAjustado(p.status) === 'CANCELADO').length; }

  setStatus(status: string, event: Event): void {
    event.preventDefault();
    this.statusFiltro = status;
  }

  get pedidosFiltrados() {
    return this.pedidos.filter(pedido => {
      const statusSeguro = this.obterStatusAjustado(pedido.status);
      const matchStatus = this.statusFiltro === 'TODOS' || statusSeguro === this.statusFiltro;
      
      const termo = this.searchTerm.toLowerCase().trim();
      const matchBusca = !termo || 
        String(pedido.idVisual).includes(termo) ||
        (pedido.nomeCliente || '').toLowerCase().includes(termo) ||
        (pedido.itens && JSON.stringify(pedido.itens).toLowerCase().includes(termo));

      let matchData = true;
      if (this.startDate || this.endDate) {
        const dataPed = new Date(pedido.dataPedido).getTime();
        const inicio = this.startDate ? new Date(this.startDate).getTime() : 0;
        const fim = this.endDate ? new Date(`${this.endDate}T23:59:59`).getTime() : Infinity;
        matchData = dataPed >= inicio && dataPed <= fim;
      }

      return matchStatus && matchBusca && matchData;
    });
  }

  get pedidosPaginados() {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    return this.pedidosFiltrados.slice(inicio, inicio + this.itensPorPagina);
  }

  get totalPaginas() {
    return Math.ceil(this.pedidosFiltrados.length / this.itensPorPagina);
  }

  get paginas() {
    return Array(this.totalPaginas).fill(0).map((x, i) => i + 1);
  }

  mudarPagina(pagina: number, event: Event): void {
    event.preventDefault();
    this.paginaAtual = pagina;
  }

  paginaAnterior(event: Event): void {
    event.preventDefault();
    if (this.paginaAtual > 1) this.paginaAtual--;
  }

  proximaPagina(event: Event): void {
    event.preventDefault();
    if (this.paginaAtual < this.totalPaginas) this.paginaAtual++;
  }
}
