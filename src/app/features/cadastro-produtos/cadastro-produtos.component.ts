import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { FooterComponent } from '../../shared/components/footer/footer.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ProdutoService } from '../../core/services/produto.service';
import { MaterialService } from '../../core/services/material.service';
import { ProdutoDTO } from '../../core/models/DTO/produto-dto';
declare var bootstrap: any;

@Component({
  selector: 'app-cadastro-produtos',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './cadastro-produtos.component.html',
  styleUrl: './cadastro-produtos.component.css'
})
export class CadastroProdutosComponent implements OnInit {

  @ViewChild('modalCategoria') modalCategoria!: ElementRef<HTMLDialogElement>;
  @ViewChild('toastElement') toastElement!: ElementRef;

  isEdicao = false;
  produtoId: number | null = null;
  produtoForm!: FormGroup;
  idUsuarioLogado = 26;

  arquivoImagem: File | null = null;
  imagemPreview: string | ArrayBuffer | null = null;

  categorias: any[] = [];
  novaCategoriaNome: string = '';
  novaCategoriaDescricao: string = '';
  materiaisCadastrados: any[] = [];
  materiaisSelecionados: any[] = [];

  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService,
    private materialService: MaterialService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.produtoForm = this.fb.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      preco: ['', Validators.required],
      categoriaId: ['', Validators.required],
      precoCusto: [''],
      quantidadeEstoque: [''],
      status: ['disponivel', Validators.required],
      largura: [''],
      altura: [''],
      peso: [''],
      observacoes: ['']
    });

    this.materialService.listarTodos().subscribe({
      next: (dados) => this.materiaisCadastrados = dados,
      error: (err) => console.error('Erro ao buscar materiais', err)
    });
    
    this.produtoService.listarCategorias().subscribe({ // Verifique se existe este método
      next: (dados) => {
          this.categorias = dados;
          console.log("Categorias carregadas:", this.categorias); // <--- OLHE ISSO NO F12
      },
      error: (err) => console.error('Erro ao buscar categorias', err)
  });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdicao = true;
      this.produtoId = Number(id);
      this.carregarProduto(this.produtoId);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.arquivoImagem = file;

      // Lê o arquivo para gerar o preview
      const reader = new FileReader();
      reader.onload = e => this.imagemPreview = reader.result;
      reader.readAsDataURL(file);
    }
  }

  mostrarToast() {
    const toast = new bootstrap.Toast(this.toastElement.nativeElement);
    toast.show();
  }

  removerImagem(event?: Event) {
    if (event) event.preventDefault();
    this.arquivoImagem = null;
    this.imagemPreview = null;
  }

  adicionarMaterial(event: Event) {
    const select = event.target as HTMLSelectElement;
    const id = Number(select.value);

    const material = this.materiaisCadastrados.find(m => m.id === id);
    if (material && !this.materiaisSelecionados.some(m => m.id === id)) {
      this.materiaisSelecionados.push(material);
    }
    select.value = '';
  }

  removerMaterial(id: number) {
    this.materiaisSelecionados = this.materiaisSelecionados.filter(m => m.id !== id);
  }

  formatarMoeda(event: any, controlName: string) {
    let valor = event.target.value.replace(/\D/g, '');
    if (valor.length > 10) {
      valor = valor.substring(0, 10);
    }

    if (!valor) {
      this.produtoForm.get(controlName)?.setValue('');
      return;
    }

    valor = (Number(valor) / 100).toFixed(2).replace('.', ',');
    valor = valor.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'); // Ponto de milhar

    this.produtoForm.get(controlName)?.setValue(valor, { emitEvent: false });
    event.target.value = valor;
  }

salvar() {
    if (this.produtoForm.invalid) {
      this.produtoForm.markAllAsTouched();
      return;
    }
    
    const formValues = this.produtoForm.value;

    // Função interna para limpar a máscara de moeda antes de enviar
    const limparMoeda = (valor: any) => {
        if (!valor) return 0;
        return Number(valor.toString().replace(/\./g, '').replace(',', '.'));
    };

    const requestDTO: ProdutoDTO = {
      nome: formValues.nome,
      descricao: formValues.descricao,
      preco: limparMoeda(formValues.preco),
      categoriaId: Number(formValues.categoriaId),
      usuarioId: this.idUsuarioLogado,
      materiaisIds: this.materiaisSelecionados.map(m => m.id),
      precoCusto: formValues.precoCusto ? limparMoeda(formValues.precoCusto) : undefined,
      quantidadeEstoque: formValues.quantidadeEstoque ? Number(formValues.quantidadeEstoque) : undefined,
      status: formValues.status,
      largura: formValues.largura ? Number(formValues.largura) : undefined,
      altura: formValues.altura ? Number(formValues.altura) : undefined,
      observacoes: formValues.observacoes
    };

    const formData = new FormData();
    formData.append('produto', new Blob([JSON.stringify(requestDTO)], { type: 'application/json' }));

    if (this.arquivoImagem) {
      formData.append('imagem', this.arquivoImagem);
    }

    // Lógica para decidir entre Cadastrar ou Atualizar
    if (this.isEdicao && this.produtoId) {
      this.produtoService.atualizarProduto(this.produtoId, formData).subscribe({
        next: () => {
          alert('Produto atualizado com sucesso!');
          this.router.navigate(['/produtos']);
        },
        error: (err) => { console.error(err); alert('Erro ao atualizar.'); }
      });
    } else {
      this.produtoService.cadastrarProduto(formData).subscribe({
        next: () => {
          alert('Produto cadastrado com sucesso!');
          this.router.navigate(['/produtos']);
        },
        error: (err) => { console.error(err); alert('Erro ao cadastrar.'); }
      });
    }
  }

  abrirModalCategoria() {
    this.novaCategoriaNome = '';
    this.novaCategoriaDescricao = '';
    this.modalCategoria.nativeElement.showModal();
  }

  fecharModalCategoria() {
    this.modalCategoria.nativeElement.close();
  }

  salvarCategoria() {
    if (!this.novaCategoriaNome || this.novaCategoriaNome.trim() === '') {
      alert('O nome da categoria é obrigatório.');
      return;
    }

    const dto = {
      nome: this.novaCategoriaNome,
      descricao: this.novaCategoriaDescricao
    };

    this.produtoService.cadastrarCategoria(dto).subscribe({
      next: (novaCategoria) => {
        this.categorias = [...this.categorias, novaCategoria];
        this.produtoForm.get('categoriaId')?.setValue(novaCategoria.id);
        this.fecharModalCategoria();
        this.mostrarToast();
      },
      error: (err) => console.error('Erro ao cadastrar categoria', err)
    });
  }

  // Adicione isso junto aos outros métodos da classe
get materiaisDisponiveis() {
  return this.materiaisCadastrados.filter(
    mat => !this.materiaisSelecionados.some(selecionado => selecionado.id === mat.id)
  );
}

carregarProduto(id: number) {
  this.produtoService.buscarPorId(id).subscribe({
    next: (data) => {

      const categoriaEncontrada = this.categorias.find(c => c.nome === data.nomeCategoria);
      const idCategoria = categoriaEncontrada ? categoriaEncontrada.id : '';
      // 1. Preenche os campos do formulário (Inputs simples)
      this.produtoForm.patchValue({
        nome: data.nome,
        descricao: data.descricao,
        // Formatamos o preço para o padrão (ponto por vírgula) para exibir no input
        preco: data.preco ? data.preco.toString().replace('.', ',') : '',
        precoCusto: data.precoCusto ? data.precoCusto.toString().replace('.', ',') : '',
        categoriaId: idCategoria,
        status: data.status,
        quantidadeEstoque: data.quantidadeEstoque,
        largura: data.largura,
        altura: data.altura,
        observacoes: data.observacoes
      });

      // 2. Preenche a pré-visualização da imagem
      if (data.imagem) {
        this.imagemPreview = 'http://localhost:8080/uploads/' + data.imagem;
      }

      // 3. Preenche a lista de materiais (A parte mais importante!)
      // O banco retorna ['Linha vermelha', 'Linha azul'].
      // Precisamos transformar isso nos objetos reais {id: 1, nome: 'Linha vermelha'}
      if (data.materiais && Array.isArray(data.materiais) && this.materiaisCadastrados.length > 0) {
        this.materiaisSelecionados = data.materiais
          .map(nomeMaterial => {
            // Busca o objeto completo na sua lista mestre de materiais
            return this.materiaisCadastrados.find(mat => mat.nome === nomeMaterial);
          })
          .filter(mat => mat !== undefined); // Removemos caso algum nome não seja encontrado
      } else {
        this.materiaisSelecionados = [];
      }
    },
    error: (err) => {
      console.error('Erro ao buscar produto:', err);
      alert('Não foi possível carregar os dados do produto.');
    }
  });
}


}