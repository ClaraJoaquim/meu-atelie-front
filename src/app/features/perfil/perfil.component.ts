import { Component } from '@angular/core';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-perfil',
  imports: [FooterComponent, HeaderComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {

}
