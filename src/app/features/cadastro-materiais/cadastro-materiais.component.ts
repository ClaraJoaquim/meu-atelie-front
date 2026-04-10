import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cadastro-materiais',
  imports: [HeaderComponent, FooterComponent, RouterModule],
  templateUrl: './cadastro-materiais.component.html',
  styleUrl: './cadastro-materiais.component.css'
})
export class CadastroMateriaisComponent {

}
