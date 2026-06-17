import { Component, inject, OnInit } from '@angular/core';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialService } from '../../core/services/material.service';
import { FornecedorService } from '../../core/services/fornecedor.service';

@Component({
  selector: 'app-materiais',
  standalone: true, 
  imports: [FooterComponent, HeaderComponent, RouterModule, FormsModule, CommonModule],
  templateUrl: './materiais.component.html',
  styleUrl: './materiais.component.css'
})
export class MateriaisComponent implements OnInit {

  constructor(
    private fornecedorService: FornecedorService,
    private materialService: MaterialService
  ) { }

  listaMateriais: any[] = [];
  fornecedores: any[] = [];

  material: any = {};
  novoFornecedor: any = {};

  modoEdicao: boolean = false;
  idMaterialParaDeletar: number | null = null;
  mensagemSucesso: string = '';

  ngOnInit() {
    this.carregarMateriais();
    this.carregarFornecedores();
  }

  carregarMateriais() {
    this.materialService.listarTodos().subscribe(dados => {
      this.listaMateriais = dados.sort((a, b) => a.id - b.id);
    });
  }

  carregarFornecedores() {
    this.fornecedorService.listarTodos().subscribe(dados => {
      this.fornecedores = dados;
    });
  }

  get qtdEstoqueBaixo(): number {
    return this.listaMateriais.filter(item => 
      item.estoqueMinimo != null && item.quantidadeEstoque <= item.estoqueMinimo
    ).length;
  }

  get qtdEstoqueNormal(): number {
    return this.listaMateriais.length - this.qtdEstoqueBaixo;
  }

  abrirModalMaterial() {
    this.modoEdicao = false;
    this.material = {}; 
    (document.getElementById('modal-material') as HTMLDialogElement).showModal();
  }

  fecharModalMaterial() {
    (document.getElementById('modal-material') as HTMLDialogElement).close();
  }

  editarMaterial(item: any) {
    this.modoEdicao = true;
    this.material = { ...item }; 
    
    if (item.fornecedor) {
      this.material.fornecedorId = item.fornecedor.id;
    }
    
    (document.getElementById('modal-material') as HTMLDialogElement).showModal();
  }

  confirmarSalvar() {
    (document.getElementById('modal-confirmacao-salvar') as HTMLDialogElement).showModal();
  }

  fecharConfirmacaoSalvar() {
    (document.getElementById('modal-confirmacao-salvar') as HTMLDialogElement).close();
  }

  executarSalvar() {
    if (this.modoEdicao) {
      this.materialService.atualizar(this.material.id, this.material).subscribe(() => {
        this.fecharConfirmacaoSalvar();
        this.fecharModalMaterial();
        this.carregarMateriais(); 
        this.mostrarSucesso('Material atualizado com sucesso!');
      });
    } else {
      this.materialService.cadastrar(this.material).subscribe(() => {
        this.fecharConfirmacaoSalvar();
        this.fecharModalMaterial();
        this.carregarMateriais(); 
        this.mostrarSucesso('Material cadastrado com sucesso!');
      });
    }
  }

  mostrarSucesso(mensagem: string) {
    this.mensagemSucesso = mensagem;
    (document.getElementById('modal-sucesso') as HTMLDialogElement).showModal();
  }

  fecharSucesso() {
    (document.getElementById('modal-sucesso') as HTMLDialogElement).close();
  }

  abrirConfirmacaoDelecao(id: number) {
    this.idMaterialParaDeletar = id;
    (document.getElementById('modal-confirmacao') as HTMLDialogElement).showModal();
  }

  fecharConfirmacaoDelecao() {
    this.idMaterialParaDeletar = null;
    (document.getElementById('modal-confirmacao') as HTMLDialogElement).close();
  }

  executarDelecao() {
    if (this.idMaterialParaDeletar !== null) {
      this.materialService.deletar(this.idMaterialParaDeletar).subscribe(() => {
        this.fecharConfirmacaoDelecao();
        this.carregarMateriais();
        this.mostrarSucesso('Material removido do estoque!');
      });
    }
  }

  abrirModalFornecedor() {
    this.novoFornecedor = {};
    (document.getElementById('modal-fornecedor') as HTMLDialogElement).showModal();
  }

  fecharModalFornecedor() {
    (document.getElementById('modal-fornecedor') as HTMLDialogElement).close();
  }

  salvarFornecedor() {
    this.fornecedorService.salvar(this.novoFornecedor).subscribe(fornecedorSalvo => {
      this.carregarFornecedores(); 
      this.material.fornecedorId = (fornecedorSalvo as any).id; 
      this.fecharModalFornecedor();
    });
  }

  formatarDocumento(event: any) {
    let valor = event.target.value.replace(/\D/g, '');

    if (valor.length <= 11) { 
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
      valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
      valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else { 
      valor = valor.replace(/^(\d{2})(\d)/, '$1.$2');
      valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
      valor = valor.replace(/\.(\d{3})(\d)/, '.$1/$2');
      valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
    }

    event.target.value = valor;
    this.novoFornecedor.cnpjCpf = valor;
  }

  formatarTelefone(event: any) {
    let valor = event.target.value.replace(/\D/g, '');

    if (valor.length <= 10) { 
      valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
      valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
    } else { 
      valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
      valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
    }

    event.target.value = valor;
    this.novoFornecedor.telefone = valor;
  }
}