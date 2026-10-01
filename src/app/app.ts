import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AgendaComponent } from './components/agenda/agenda';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AgendaComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
