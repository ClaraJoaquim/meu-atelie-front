import { Component, ViewChild } from '@angular/core';
import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario } from '../../core/models/usuario';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-cadastro',
  imports: [ReactiveFormsModule, CommonModule, ModalComponent],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {

  @ViewChild(ModalComponent) modal!: ModalComponent;

  cadastroForm!: FormGroup;
  emailJaCadastrado: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  ngOnInit() {
  this.cadastroForm = this.formBuilder.group({
    nome: ['', Validators.required],
    email: ['', [Validators.email]],
    cpf: ['', [validarCpfBackend]], 
    telefone: ['', Validators.required],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    confirmarSenha: ['', Validators.required],

    nomeLoja: ['', Validators.required],
    descricaoLoja: [''],
    cnpj: [''], 
    whatsapp: ['', Validators.required],
    facebook: [''],
    instagram: ['']
  }, {
    validators: this.validarSenha
  });
}

  cadastrar() {
    if (this.cadastroForm.invalid) {
      this.cadastroForm.markAllAsTouched();
      return;
    }

    this.emailJaCadastrado = false;

    const cpfFormatado = this.cadastroForm.get('cpf')?.value || '';
    const cpfLimpo = cpfFormatado.replace(/\D/g, '');

    const cnpjLimpo = this.cadastroForm.get('cnpj')?.value.replace(/\D/g, '');
    const whatsLimpo = this.cadastroForm.get('whatsapp')?.value.replace(/\D/g, '');

    const telefoneFormatado = this.cadastroForm.get('telefone')?.value || '';
    const telefoneLimpo = telefoneFormatado.replace(/\D/g, '');

    const novoUsuario: any = {
      nome: this.cadastroForm.get('nome')?.value,
      email: this.cadastroForm.get('email')?.value,
      senha: this.cadastroForm.get('senha')?.value,
      cpf: cpfLimpo,
      telefone: telefoneLimpo,
      nomeLoja: this.cadastroForm.get('nomeLoja')?.value,
      descricaoLoja: this.cadastroForm.get('descricaoLoja')?.value,
      cnpj: cnpjLimpo,
      whatsapp: whatsLimpo,
      facebook: this.cadastroForm.get('facebook')?.value,
      instagram: this.cadastroForm.get('instagram')?.value
    };

    this.usuarioService.criarUsuario(novoUsuario).subscribe({
      next: (res) => {
        this.modal.abrirModal(
          'Sucesso!',
          'Usuário cadastrado com sucesso.',
          'sucesso',
          'Ir para Login'
        );

        this.modal.acaoConfirmada.subscribe(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err) => {
        if (err.status === 409) {
          this.modal.abrirModal(
            'Atenção',
            'Este E-mail e/ou CPF já possui cadastro!',
            'erro',
            'Ir para Login'
          );

          this.modal.acaoConfirmada.subscribe(() => {
            this.router.navigate(['/login']);
          });

        } else {
          this.modal.abrirModal(
            'Erro',
            'Ocorreu um erro inesperado. Tente novamente.',
            'erro',
            'Fechar'
          );
        }
      }
    });
  }

  irParaLogin() {
    this.router.navigate(['/login']);
  }

  // Validador de Senhas
  validarSenha(form: AbstractControl): ValidationErrors | null {
    const senha = form.get('senha')?.value;
    const confirmarSenha = form.get('confirmarSenha')?.value;

    if (senha && confirmarSenha && senha !== confirmarSenha) {
      form.get('confirmarSenha')?.setErrors({ senhaDiferente: true });
      return { senhaDiferente: true };
    }
    return null;
  }



  //Mascaras
  // Formata o telefone
  formatarTelefone(event: any) {
    let valor = event.target.value.replace(/\D/g, '');

    if (valor.length > 11) valor = valor.slice(0, 11);
    if (valor.length > 2) {
      valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
    }
    if (valor.length > 7) {
      valor = valor.replace(/(\d{5})(\d{4})$/, '$1-$2');
    }

    event.target.value = valor;
    this.cadastroForm.get('telefone')?.setValue(valor, { emitEvent: false });
  }

  // Formata o CPF
  formatarCPF(event: any) {
    let valor = event.target.value.replace(/\D/g, '');

    if (valor.length > 11) valor = valor.slice(0, 11);

    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    event.target.value = valor;
    this.cadastroForm.get('cpf')?.setValue(valor, { emitEvent: false });
  }

  formatarWhatsApp(event: any) {
    let valor = event.target.value.replace(/\D/g, '');

    if (valor.length > 11) valor = valor.slice(0, 11);
    if (valor.length > 2) {
      valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
    }
    if (valor.length > 7) {
      valor = valor.replace(/(\d{5})(\d{4})$/, '$1-$2');
    }

    event.target.value = valor;
    this.cadastroForm.get('whatsapp')?.setValue(valor, { emitEvent: false });
  }

  formatarCNPJ(event: any) {
    let valor = event.target.value.replace(/\D/g, '');

    if (valor.length > 14) valor = valor.slice(0, 14);

    valor = valor.replace(/^(\d{2})(\d)/, '$1.$2');
    valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    valor = valor.replace(/\.(\d{3})(\d)/, '.$1/$2');
    valor = valor.replace(/(\d{4})(\d)/, '$1-$2');

    event.target.value = valor;
    this.cadastroForm.get('cnpj')?.setValue(valor, { emitEvent: false });
  }

  // Getters
  get nome() { return this.cadastroForm.get('nome'); }
  get email() { return this.cadastroForm.get('email'); }
  get telefone() { return this.cadastroForm.get('telefone'); }
  get cpf() { return this.cadastroForm.get('cpf'); }
  get senha() { return this.cadastroForm.get('senha'); }
  get confirmarSenha() { return this.cadastroForm.get('confirmarSenha'); }
}

function validarCpfBackend(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  const cpf = control.value.toString().replace(/\D/g, '');

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return { cpfInvalido: true };
  }

  let soma = 0;
  let resto;

  for (let i = 1; i <= 9; i++)
    soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);

  resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return { cpfInvalido: true };

  soma = 0;
  for (let i = 1; i <= 10; i++)
    soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);

  resto = (soma * 10) % 11;
  if ((resto === 10) || (resto === 11)) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return { cpfInvalido: true };

  return null;
}
