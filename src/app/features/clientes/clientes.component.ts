import { Component, HostListener } from '@angular/core';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CadastroClienteComponent } from '../cadastro-cliente/cadastro-cliente.component';
import { RouterModule } from '@angular/router';
import { ClienteResumo } from '../../core/models/cliente-resumo';
import { ClienteService } from '../../core/services/cliente.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-clientes',
  imports: [CommonModule, FooterComponent, HeaderComponent, CadastroClienteComponent, RouterModule, FormsModule, FooterComponent, CurrencyPipe],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent {

  clientes: ClienteResumo[] = [];
  clientesFiltrados: ClienteResumo[] = [];
  termoBusca: string = '';

  paginaAtual: number = 1;
pageSize: number = 9;

  totalClientes: number = 0;
  clientesRecorrentes: number = 0;
  novosEsteMes: number = 0;

  constructor(private clienteService: ClienteService) {}

  ngOnInit() {
    this.carregarClientes();
    this.ajustarQuantidadePagina(window.innerWidth);
  }

  carregarClientes() {
  this.clienteService.listarResumoClientes().subscribe({
    next: (dados) => {
      this.clientes = dados.sort((a, b) => {
        const dataA = a.dataCadastro ? new Date(a.dataCadastro).getTime() : 0;
        const dataB = b.dataCadastro ? new Date(b.dataCadastro).getTime() : 0;
        return dataB - dataA; 
      });

      this.clientesFiltrados = [...this.clientes];
      this.calcularMetricas();
    },
    error: (err) => console.error('Erro ao buscar resumo', err)
  });
}

  calcularMetricas() {
    this.totalClientes = this.clientes.length;
    this.clientesRecorrentes = this.clientes.filter(c => c.totalPedidos > 1).length;

    const mesAtual = new Date().getMonth() + 1; 
    const anoAtual = new Date().getFullYear();

    this.novosEsteMes = this.clientes.filter(c => {
      if (!c.dataCadastro) return false;
      const data = new Date(c.dataCadastro);
      return (data.getMonth() + 1) === mesAtual && data.getFullYear() === anoAtual;
    }).length;
  }

  @HostListener('window:resize', ['$event'])
onResize(event: any) {
  this.ajustarQuantidadePagina(event.target.innerWidth);
}

private ajustarQuantidadePagina(width: number) {
  if (width < 768) {
    this.pageSize = 3;
  } else if (width < 1024) {
    this.pageSize = 6;
  } else {
    this.pageSize = 9;
  }
}

get clientesExibidos() {
  const inicio = (this.paginaAtual - 1) * this.pageSize;
  return this.clientesFiltrados.slice(inicio, inicio + this.pageSize);
}

get totalPaginas(): number {
  return Math.ceil(this.clientesFiltrados.length / this.pageSize);
}

filtrarClientes() {
    this.paginaAtual = 1; 
    const termo = this.termoBusca?.trim().toLowerCase();
    if (!termo) {
      this.clientesFiltrados = this.clientes;
      return;
    }
    this.clientesFiltrados = this.clientes.filter(c => 
      c.nome?.toLowerCase().includes(termo)
    );
  }

  getIniciais(nome: string): string {
    if (!nome) return '--';
    const partes = nome.trim().split(' ');
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  }

}
