import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-agenda-component',
  imports: [Navbar],
  templateUrl: './agenda.html',
  styleUrl: './agenda.css',
})
export class AgendaComponent {}
