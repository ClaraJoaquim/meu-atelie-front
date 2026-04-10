import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { CadastroProdutosComponent } from '../cadastro-produtos/cadastro-produtos.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-produtos',
  imports: [HeaderComponent, FooterComponent, CadastroProdutosComponent, RouterModule],
  templateUrl: './produtos.component.html',
  styleUrl: './produtos.component.css'
})
export class ProdutosComponent {

}
