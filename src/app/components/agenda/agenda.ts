import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { Calendario } from './calendario/calendario';

@Component({
  selector: 'app-agenda-component',
  imports: [Navbar, Calendario],
  templateUrl: './agenda.html',
  styleUrl: './agenda.css',
})
export class AgendaComponent {

}
