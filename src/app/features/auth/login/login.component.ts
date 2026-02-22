import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email: string = '';
  senha: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  fazerLogin() {
    this.authService.login(this.email, this.senha)
      .subscribe({
        next: () => {
          console.log('Login ok');
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error(err);
          alert('Email ou senha inválidos');
        }
      });
  }

}
