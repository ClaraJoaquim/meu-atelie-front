import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { LojaDTO } from '../../core/models/DTO/loja-dto';
import { LojaService } from '../../core/services/loja.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  imports: [FooterComponent, HeaderComponent, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  loja: Partial<LojaDTO> = {};
  idUsuarioAtual = 36;
  editando = false;
  urlServidorImagem = 'http://localhost:8080/uploads/';

  constructor(private lojaService: LojaService) { }

  ngOnInit() {
    this.lojaService.obterPerfil(this.idUsuarioAtual).subscribe({
      next: (dados) => this.loja = dados,
      error: (err) => console.error('Erro ao buscar perfil', err)
    });
  }

  alternarEdicao() {
    this.editando = !this.editando;
  }

  salvarAlteracoes() {
    this.lojaService.atualizarPerfil(this.idUsuarioAtual, this.loja as LojaDTO).subscribe({
      next: (dados) => {
        this.loja = dados;
        this.editando = false; // <-- Volta para o modo leitura após salvar
        alert('Perfil atualizado com sucesso!');
      },
      error: (err) => console.error('Erro ao atualizar', err)
    });
  }

  onArquivoSelecionado(event: Event) {
  const input = event.target as HTMLInputElement;
  
  if (input.files && input.files.length > 0) {
    const arquivo = input.files[0];
    
    this.lojaService.uploadFoto(this.idUsuarioAtual, arquivo).subscribe({
      next: (resposta: any) => {
        this.loja.fotoUrl = resposta.fotoUrl;
        alert('Foto atualizada com sucesso!');
      },
      error: (err) => {
        console.error('Erro no upload', err);
        alert('Falha ao enviar a foto.');
      }
    });
  }
}
}
