import { Component } from '@angular/core';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CadastroMateriaisComponent } from '../cadastro-materiais/cadastro-materiais.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-encomendas',
  imports: [FooterComponent, HeaderComponent, CadastroMateriaisComponent, RouterModule],
  templateUrl: './encomendas.component.html',
  styleUrl: './encomendas.component.css'
})
export class EncomendasComponent {

}
