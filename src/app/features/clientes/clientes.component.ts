import { Component } from '@angular/core';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CadastroClienteComponent } from '../cadastro-cliente/cadastro-cliente.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-clientes',
  imports: [FooterComponent, HeaderComponent, CadastroClienteComponent, RouterModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent {

}
