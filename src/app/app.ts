import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AgendaComponent } from './components/agenda/agenda';
import { Navbar } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AgendaComponent, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
