import { Routes } from '@angular/router';
import { AgendaComponent } from './components/agenda/agenda';
import { Financeiro } from './components/financeiro/financeiro';
import { EstoqueComponent } from './components/estoque/estoque.component';
import { Dashboard } from './components/dashboard/dashboard';
import { Caixa } from './components/caixa/caixa';
import { Profissionais } from './components/profissionais/profissionais';
import { Servicos } from './components/servicos/servicos';
import { Configuracoes } from './components/configuracoes/configuracoes';
import { Relatorio } from './components/relatorio/relatorio.component';
import { Clientes } from './components/clientes/clientes';
import { Login } from './components/login/login';
import { authGuard, visitanteGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login, canActivate: [visitanteGuard] },
  { path: '', component: Dashboard, canActivate: [authGuard] },
  { path: 'agenda', component: AgendaComponent, canActivate: [authGuard] },
  { path: 'clientes', component: Clientes, canActivate: [authGuard] },
  { path: 'clientes/:id', component: Clientes, canActivate: [authGuard] },
  { path: 'caixa', component: Caixa, canActivate: [authGuard] },
  { path: 'financeiro', component: Financeiro, canActivate: [authGuard] },
  { path: 'estoque', component: EstoqueComponent, canActivate: [authGuard] },
  { path: 'relatorio', component: Relatorio, canActivate: [authGuard] },
  { path: 'servicos', component: Servicos, canActivate: [authGuard] },
  { path: 'profissionais', component: Profissionais, canActivate: [authGuard] },
  { path: 'configuracoes', component: Configuracoes, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
