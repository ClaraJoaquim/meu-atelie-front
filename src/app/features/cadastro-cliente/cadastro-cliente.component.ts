import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClienteForm } from '../../core/models/cliente-form';
import { ClienteService } from '../../core/services/cliente.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { CanalAquisicao } from '../../core/models/canal-aquisicao';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-cadastro-cliente',
  imports: [HeaderComponent, FooterComponent, RouterModule, ReactiveFormsModule, NgFor, ModalComponent, CommonModule],
  templateUrl: './cadastro-cliente.component.html',
  styleUrl: './cadastro-cliente.component.css'
})
export class CadastroClienteComponent {

  clienteForm!: FormGroup;
  @ViewChild(ModalComponent) modal!: ModalComponent;
  canais: CanalAquisicao[] = [];


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private clienteService: ClienteService,
  ) { }

  ngOnInit() {
    this.clienteService.listarCanais().subscribe(res => {
      this.canais = res;
    });

    this.clienteForm = this.fb.group({
      nome: ['', [Validators.required]],
      cpf: [''],
      cnpj: [''],
      dataNascimento: [''],
      telefone: ['', [Validators.required]],
      email: [''],
      observacoes: [''],
      canalId: [null],
      endereco: [''],
      numero: [''],
      bairro: [''],
      cidade: [''],
      estado: [''],
      cep: ['']
    });
  }

  aplicarMascaraCep(event: any) {
    let valor = event.target.value.replace(/\D/g, '');
    if (valor.length > 5) {
      valor = valor.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    this.clienteForm.get('cep')?.setValue(valor, { emitEvent: false });
  }

  aplicarMascaraCpf(event: any) {
    let valor = event.target.value.replace(/\D/g, '');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    this.clienteForm.get('cpf')?.setValue(valor, { emitEvent: false });
  }

  aplicarMascaraTelefone(event: any) {
    let valor = event.target.value.replace(/\D/g, '');
    valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
    valor = valor.replace(/(\d)(\d{4})$/, '$1-$2');
    this.clienteForm.get('telefone')?.setValue(valor, { emitEvent: false });
  }

  buscarCep() {
    const cep = this.clienteForm.get('cep')?.value?.replace(/\D/g, '');

    if (cep && cep.length === 8) {
      this.clienteService.buscarCep(cep).subscribe({
        next: (dados) => {
          if (!dados.erro) {
            this.clienteForm.patchValue({
              endereco: dados.logradouro,
              bairro: dados.bairro,
              cidade: dados.localidade,
              estado: dados.uf
            });
          } else {
            console.error('CEP não encontrado.');
          }
        },
        error: (err) => console.error('Erro ao buscar o CEP.', err)
      });
    }
  }

  cadastrar() {
    if (this.clienteForm.invalid) {
        this.clienteForm.markAllAsTouched();
        this.modal.abrirModal(
          'Dados Obrigatórios',
          'Nome e Telefone são obrigatórios. Por favor, verifique os dados e tente novamente.',
          'erro',
          'Fechar'
        );
        return; 
    }

    const formValue = this.clienteForm.value;
    
    const novoCliente: ClienteForm = {
      nome: formValue.nome,
      email: formValue.email || null,
      telefone: formValue.telefone.replace(/\D/g, ''),
      cnpj: formValue.cnpj || null,
      dataNascimento: formValue.dataNascimento || null,
      observacoes: formValue.observacoes || null,
      canalId: (formValue.canalId !== null && formValue.canalId !== "") ? formValue.canalId : null,

      endereco: {
        rua: formValue.endereco || null,
        numero: formValue.numero || null,
        bairro: formValue.bairro || null,
        cidade: formValue.cidade || null,
        estado: formValue.estado || null,
        cep: formValue.cep ? formValue.cep.replace(/\D/g, '') : null
      }
    };

this.clienteService.cadastrarCliente(novoCliente).subscribe({
    next: (res) => {
      this.modal.abrirModal('Sucesso!', 'Cliente cadastrado com sucesso.', 'sucesso', 'Continuar');
      this.modal.acaoConfirmada.subscribe(() => this.router.navigate(['/clientes']));
    },
    error: (err) => {
      this.modal.abrirModal('Erro', 'Ocorreu um erro ao salvar no servidor. Tente novamente.', 'erro', 'Fechar');
    }
  });
  }

  get nome() { return this.clienteForm.get('nome'); }
  get email() { return this.clienteForm.get('email'); }
  get telefone() { return this.clienteForm.get('telefone'); }
  get cnpj() { return this.clienteForm.get('cnpj'); }
  get dataNascimento() { return this.clienteForm.get('dataNascimento'); }
  get observacoes() { return this.clienteForm.get('observacoes'); }
  get canalId() { return this.clienteForm.get('canalId'); }
  get endereco() { return this.clienteForm.get('endereco'); }
  get numero() { return this.clienteForm.get('numero'); }
  get bairro() { return this.clienteForm.get('bairro'); }
  get cidade() { return this.clienteForm.get('cidade'); }
  get estado() { return this.clienteForm.get('estado'); }
  get cep() { return this.clienteForm.get('cep'); }
}
