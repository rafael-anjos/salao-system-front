import { Routes } from '@angular/router';
import { AgendaComponent } from './components/agenda/agenda';
import { Financeiro } from './components/financeiro/financeiro';

export const routes: Routes = [
    {path: 'agenda', component: AgendaComponent},
    {path: 'financeiro', component: Financeiro}
];
