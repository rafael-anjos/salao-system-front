import { Routes } from '@angular/router';
import { AgendaComponent } from './components/agenda/agenda';
import { Financeiro } from './components/financeiro/financeiro';
import { EstoqueComponent } from './components/estoque/estoque.component';
import { Dashboard } from './components/dashboard/dashboard';


export const routes: Routes = [
    { path: '', component: Dashboard },
    { path: 'agenda', component: AgendaComponent },
    { path: 'financeiro', component: Financeiro },
    { path: 'estoque', component: EstoqueComponent }

];
