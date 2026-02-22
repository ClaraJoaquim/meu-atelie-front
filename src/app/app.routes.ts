import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { CadastroComponent } from './features/cadastro/cadastro.component';
import { MateriaisComponent } from './features/materiais/materiais.component';
import { ClientesComponent } from './features/clientes/clientes.component';
import { PedidosComponent } from './features/pedidos/pedidos.component';
import { RelatoriosComponent } from './features/relatorios/relatorios.component';
import { EncomendasComponent } from './features/encomendas/encomendas.component';
import { CadastroClienteComponent } from './features/cadastro-cliente/cadastro-cliente.component';
import { CadastroMateriaisComponent } from './features/cadastro-materiais/cadastro-materiais.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent},
    { path: 'home', component: HomeComponent},
    { path: 'cadastro', component: CadastroComponent},
    { path: 'materiais', component: MateriaisComponent},
    { path: 'clientes', component: ClientesComponent},
    { path: 'pedidos', component: PedidosComponent},
    { path: 'relatorios', component: RelatoriosComponent},
    { path: 'encomenda', component: EncomendasComponent},
    { path: 'clientes/cadastro-cliente', component: CadastroClienteComponent},
    { path: 'materiais/cadastro-material', component: CadastroMateriaisComponent},
    { path: '', redirectTo: 'login', pathMatch: 'full'},
];
