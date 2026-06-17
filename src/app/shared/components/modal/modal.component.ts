import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

declare var bootstrap: any;

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
@ViewChild('meuModal') modalRef!: ElementRef;
  @Output() acaoConfirmada = new EventEmitter<void>();

  titulo: string = '';
  mensagem: string = '';
  tipo: 'sucesso' | 'erro' = 'sucesso';
  textoBotao: string = 'OK';
  
  private modalBootstrap: any;

  abrirModal(titulo: string, mensagem: string, tipo: 'sucesso' | 'erro', textoBotao: string = 'OK') {
    this.titulo = titulo;
    this.mensagem = mensagem;
    this.tipo = tipo;
    this.textoBotao = textoBotao;

    this.modalBootstrap = new bootstrap.Modal(this.modalRef.nativeElement);
    this.modalBootstrap.show();
  }

  fecharModal() {
    this.modalBootstrap?.hide();
  }

  confirmar() {
    this.acaoConfirmada.emit();
    this.fecharModal();
  }
}
