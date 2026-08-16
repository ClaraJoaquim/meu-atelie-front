import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { RelatorioService } from '../../core/services/relatorio.service';
import { PeriodoTipo } from '../../core/models/DTO/periodo-tipo';
import { IndicadoresPeriodoDTO } from '../../core/models/DTO/indicadores-periodo-dto';
import { FaturamentoMensalDTO } from '../../core/models/DTO/faturamento-mensal-dto';
import { RankingProdutoDTO } from '../../core/models/DTO/ranking-produto-dto';
import { RankingClienteDTO } from '../../core/models/DTO/ranking-cliente-dto';

interface MesExibicao extends FaturamentoMensalDTO {
  label: string;
  isMesAtual: boolean;
  isProjetado: boolean;
  larguraPercentual: number;
}

const NOMES_MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const ROTULOS_PERIODO: Record<PeriodoTipo, string> = {
  SEMANA: 'da semana',
  MES: 'do mês',
  TRIMESTRE: 'do trimestre',
  ANO: 'do ano',
};

@Component({
  selector: 'app-relatorios',
  imports: [CommonModule, FooterComponent, HeaderComponent],
  templateUrl: './relatorios.component.html',
  styleUrl: './relatorios.component.css'
})
export class RelatoriosComponent implements OnInit {
  periodos: { valor: PeriodoTipo; label: string }[] = [
    { valor: 'SEMANA', label: 'Semana' },
    { valor: 'MES', label: 'Mês' },
    { valor: 'TRIMESTRE', label: 'Trimestre' },
    { valor: 'ANO', label: 'Ano' },
  ];
  periodoSelecionado: PeriodoTipo = 'MES';

  indicadores: IndicadoresPeriodoDTO | null = null;
  mesesExibidos: MesExibicao[] = [];
  rankingProdutos: RankingProdutoDTO[] = [];
  rankingClientes: RankingClienteDTO[] = [];

  carregandoIndicadores = false;
  carregandoRankingProdutos = false;
  carregandoRankingClientes = false;

  anoAtual = new Date().getFullYear();

  constructor(private relatorioService: RelatorioService) {}

  ngOnInit(): void {
    this.carregarIndicadoresERankings();
    this.carregarFaturamentoMensal();
  }

  selecionarPeriodo(periodo: PeriodoTipo): void {
    if (periodo === this.periodoSelecionado) {
      return;
    }
    this.periodoSelecionado = periodo;
    this.carregarIndicadoresERankings();
  }

  rotuloPeriodo(): string {
    return ROTULOS_PERIODO[this.periodoSelecionado];
  }

  trendClass(variacao: number | null): string {
    if (variacao === null || variacao === undefined) {
      return '';
    }
    return variacao >= 0 ? 'metric-trend--up' : 'metric-trend--down';
  }

  private carregarIndicadoresERankings(): void {
    this.carregandoIndicadores = true;
    this.relatorioService.buscarIndicadores(this.periodoSelecionado).subscribe({
      next: (dados) => {
        this.indicadores = dados;
        this.carregandoIndicadores = false;
      },
      error: () => {
        this.indicadores = null;
        this.carregandoIndicadores = false;
      }
    });

    this.carregandoRankingProdutos = true;
    this.relatorioService.buscarRankingProdutos(this.periodoSelecionado).subscribe({
      next: (dados) => {
        this.rankingProdutos = dados;
        this.carregandoRankingProdutos = false;
      },
      error: () => {
        this.rankingProdutos = [];
        this.carregandoRankingProdutos = false;
      }
    });

    this.carregandoRankingClientes = true;
    this.relatorioService.buscarRankingClientes(this.periodoSelecionado, 10).subscribe({
      next: (dados) => {
        this.rankingClientes = dados;
        this.carregandoRankingClientes = false;
      },
      error: () => {
        this.rankingClientes = [];
        this.carregandoRankingClientes = false;
      }
    });
  }

  private carregarFaturamentoMensal(): void {
    this.relatorioService.buscarFaturamentoMensal().subscribe({
      next: (dados) => {
        this.mesesExibidos = this.montarMesesExibidos(dados);
      },
      error: () => {
        this.mesesExibidos = [];
      }
    });
  }

  private montarMesesExibidos(dados: FaturamentoMensalDTO[]): MesExibicao[] {
    const mesAtual = new Date().getMonth() + 1;
    const limite = Math.min(mesAtual + 1, 12);

    const visiveis = dados
      .filter((item) => item.mes <= limite)
      .sort((a, b) => a.mes - b.mes);

    const maiorValor = Math.max(...visiveis.map((item) => item.valor), 1);

    return visiveis.map((item) => ({
      ...item,
      label: NOMES_MESES[item.mes - 1],
      isMesAtual: item.mes === mesAtual && item.tipo === 'REALIZADO',
      isProjetado: item.tipo === 'ESTIMADO',
      larguraPercentual: Math.max(Math.round((item.valor / maiorValor) * 100), 2)
    }));
  }
}
