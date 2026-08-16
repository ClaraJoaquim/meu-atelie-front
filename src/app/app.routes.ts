import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { CadastroComponent } from './features/cadastro/cadastro.component';
import { MateriaisComponent } from './features/materiais/materiais.component';
import { ClientesComponent } from './features/clientes/clientes.component';
import { PedidosComponent } from './features/pedidos/pedidos.component';
import { RelatoriosComponent } from './features/relatorios/relatorios.component';

import { CadastroClienteComponent } from './features/cadastro-cliente/cadastro-cliente.component';
import { CadastroMateriaisComponent } from './features/cadastro-materiais/cadastro-materiais.component';
import { ProdutosComponent } from './features/produtos/produtos.component';
import { CadastroProdutosComponent } from './features/cadastro-produtos/cadastro-produtos.component';
import { PerfilComponent } from './features/perfil/perfil.component';
import { CadastroPedidosComponent } from './features/cadastro-pedidos/cadastro-pedidos.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent},
    { path: 'home', component: HomeComponent},
    { path: 'cadastro', component: CadastroComponent},
    { path: 'materiais', component: MateriaisComponent},
    { path: 'clientes', component: ClientesComponent},
    { path: 'pedidos', component: PedidosComponent},
    { path: 'produtos', component: ProdutosComponent},
    { path: 'relatorios', component: RelatoriosComponent},
    { path: 'pedidos/cadastro', component: CadastroPedidosComponent},
    { path: 'pedidos/editar/:id', component: CadastroPedidosComponent},
    { path: 'clientes/cadastro', component: CadastroClienteComponent},
    { path: 'clientes/editar/:id', component: CadastroClienteComponent },
    { path: 'materiais/cadastro', component: CadastroMateriaisComponent},
    { path: 'produtos/cadastro', component: CadastroProdutosComponent},
    { path: 'produtos/editar/:id', component: CadastroProdutosComponent },
    { path: 'meu-perfil', component: PerfilComponent},
    { path: '', redirectTo: 'login', pathMatch: 'full'},
];
