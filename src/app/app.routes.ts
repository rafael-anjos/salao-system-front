import { Routes } from '@angular/router';
import { AgendaComponent } from './components/agenda/agenda';
import { Financeiro } from './components/financeiro/financeiro';
import { EstoqueComponent } from './components/estoque/estoque.component';
import { Dashboard } from './components/dashboard/dashboard';
import { Caixa } from './components/caixa/caixa';
import { Profissionais } from './components/profissionais/profissionais';
import { Servicos } from './components/servicos/servicos';
import { Configuracoes } from './components/configuracoes/configuracoes';

export const routes: Routes = [
    { path: '', component: Dashboard },
    { path: 'agenda', component: AgendaComponent },
    { path: 'caixa', component: Caixa },
    { path: 'financeiro', component: Financeiro },
    { path: 'estoque', component: EstoqueComponent },
    { path: 'servicos', component: Servicos },
    { path: 'profissionais', component: Profissionais },
    { path: 'configuracoes', component: Configuracoes },

];
