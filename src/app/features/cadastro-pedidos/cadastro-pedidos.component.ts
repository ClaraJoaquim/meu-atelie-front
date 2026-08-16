import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CadastroMateriaisComponent } from '../cadastro-materiais/cadastro-materiais.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClienteResumo } from '../../core/models/cliente-resumo';
import { ProdutoDTO } from '../../core/models/DTO/produto-dto';
import { ClienteService } from '../../core/services/cliente.service';
import { ProdutoService } from '../../core/services/produto.service';
import { PedidoService } from '../../core/services/pedido.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro-pedidos',
  imports: [FooterComponent, HeaderComponent, CadastroMateriaisComponent, RouterModule, 
    FormsModule, CommonModule],
  templateUrl: './cadastro-pedidos.component.html',
  styleUrl: './cadastro-pedidos.component.css'
})
export class CadastroPedidosComponent implements OnInit {
  clientes: ClienteResumo[] = [];
  produtos: (ProdutoDTO & { quantidadeSelecionada: number })[] = [];
  
  clienteSelecionado: number | null = null;
  desconto: number | null = 0;
  subtotal: number = 0;
  valorTotal: number = 0;
  tipoDesconto: 'VALOR' | 'PORCENTAGEM' = 'VALOR';

  descontoExibicao: string = '';

  dataPedido: string = new Date().toISOString().substring(0, 10);
  prazoEntrega: string = '';
  statusList: { nome: string, descricao: string }[] = [];
  statusSelecionado: string = 'EM_ANDAMENTO';
  formaPagamento: string = '';

  isEdicao: boolean = false;
  idPedido?: number;
  
  constructor(
    private clienteService: ClienteService,
    private produtoService: ProdutoService,
    private encomendaService: PedidoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clienteService.listarResumoClientes().subscribe(res => this.clientes = res);

    this.encomendaService.listarStatus().subscribe(res => {
  this.statusList = res.map((status: any) => {
    let chaveStr = typeof status === 'string' ? status : (status.name || status.nome);
    
    return {
      nome: chaveStr,
      descricao: status.descricao || chaveStr.replace(/_/g, ' ')
    };
  });

  if (!this.isEdicao && !this.statusList.find(s => s.nome === 'EM_ANDAMENTO')) {
    this.statusSelecionado = this.statusList[0]?.nome;
  }
});

    this.produtoService.listarProdutosDoUsuario().subscribe(res => {
      this.produtos = res.map(p => ({ ...p, quantidadeSelecionada: 0 }));
      
      const idParam = this.route.snapshot.paramMap.get('id');
      if (idParam) {
        this.isEdicao = true;
        this.idPedido = +idParam;
        this.carregarPedido(this.idPedido);
      }
    });
  }

carregarPedido(id: number): void {
  this.encomendaService.buscarPorId(id).subscribe(pedido => {
    this.clienteSelecionado = pedido.clienteId;
    this.dataPedido = pedido.dataPedido;
    this.prazoEntrega = pedido.dataEntrega || '';
    this.formaPagamento = pedido.pagamento?.condicoesPagamento || '';

    let statusRecebido = pedido.status;
    if (typeof statusRecebido === 'object' && statusRecebido !== null) {
      statusRecebido = statusRecebido.nome || statusRecebido.name;
    }
    this.statusSelecionado = statusRecebido;

    if (pedido.itens) {
      pedido.itens.forEach((item: any) => {
        const prod = this.produtos.find(p => p.id === item.produtoId);
        if (prod) prod.quantidadeSelecionada = item.quantidade;
      });
    }

    if (pedido.pagamento?.descontoValor) {
      this.tipoDesconto = 'VALOR';
      this.desconto = pedido.pagamento.descontoValor;
      this.descontoExibicao = new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
      }).format(this.desconto || 0);
    }

    this.atualizarValores();
  });
}

  mudouTipoDesconto(): void {
    this.desconto = 0;
    this.descontoExibicao = '';
    this.atualizarValores();
  }

atualizarValores(): void {
  this.subtotal = this.produtos.reduce((acc, p) => acc + (p.preco * p.quantidadeSelecionada), 0);
  
  if (this.tipoDesconto === 'VALOR' && (this.desconto || 0) > this.subtotal) {
    this.desconto = this.subtotal;
    this.descontoExibicao = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(this.desconto);
  }

  const desc = this.desconto || 0;
  const valorDescontoCalculado = this.tipoDesconto === 'PORCENTAGEM' ? this.subtotal * (desc / 100) : desc;

  this.valorTotal = Math.max(0, this.subtotal - valorDescontoCalculado);
}

  alterarQuantidade(produto: any, valor: number): void {
    const novaQuantidade = produto.quantidadeSelecionada + valor;
    if (novaQuantidade >= 0) {
      produto.quantidadeSelecionada = novaQuantidade;
      this.atualizarValores();
    }
  }

salvar(): void {
const itensSelecionados = this.produtos
      .filter(p => p.quantidadeSelecionada > 0)
      .map(p => ({ produtoId: p.id, quantidade: p.quantidadeSelecionada }));

    const valorDescontoFinal = this.tipoDesconto === 'PORCENTAGEM' 
      ? this.subtotal * ((this.desconto || 0) / 100) 
      : (this.desconto || 0);

    const dataEntregaTratada = this.prazoEntrega ? this.prazoEntrega : null;

    let statusFinal = this.statusSelecionado;
    if (typeof statusFinal === 'object' && statusFinal !== null) {
      statusFinal = (statusFinal as any).nome || (statusFinal as any).name;
    }

    const payload = {
      clienteId: this.clienteSelecionado,
      dataPedido: this.dataPedido,
      dataEntrega: dataEntregaTratada,
      status: statusFinal,
      itens: itensSelecionados,
      pagamento: {
        frete: 0,
        descontoValor: valorDescontoFinal,
        condicoesPagamento: this.formaPagamento
      }
    };

    if (this.isEdicao && this.idPedido) {
      this.encomendaService.atualizar(this.idPedido, payload).subscribe({
        next: () => {
          alert('Encomenda atualizada com sucesso!');
          this.router.navigate(['/pedidos']);
        },
        error: (err) => {
          console.error('Erro ao atualizar', err);
          alert('Erro ao atualizar. Verifique o console.');
        }
      });
    } else {
      this.encomendaService.salvarEncomenda(payload).subscribe({
        next: () => {
          alert('Encomenda salva com sucesso!');
          this.router.navigate(['/pedidos']);
        },
        error: (err) => {
          console.error('Erro ao salvar', err);
          alert('Erro ao salvar. Verifique o console.');
        }
      });
    }
  }

aplicarMascara(event: Event): void {

  const input = event.target as HTMLInputElement;

  let valorLimpo = input.value.replace(/\D/g, '');
  let valorNumerico = valorLimpo ? Number(valorLimpo) / 100 : 0;

  if (this.tipoDesconto === 'PORCENTAGEM') {

    if (valorNumerico > 100) {
      valorNumerico = 100;
    }

    this.descontoExibicao =
  valorNumerico.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  } else {

    if (valorNumerico > this.subtotal) {
      valorNumerico = this.subtotal;
    }

    this.descontoExibicao = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valorNumerico);
  }

  input.value = this.descontoExibicao;

  this.desconto = valorNumerico;
  this.atualizarValores();
}


get valorDesconto(): number {
  if (this.tipoDesconto === 'PORCENTAGEM') {
    return this.subtotal * ((this.desconto || 0) / 100);
  }

  return this.desconto || 0;
}
}