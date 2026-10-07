import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AgendaComponent } from './components/agenda/agenda';
import { Navbar } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AgendaComponent, Navbar],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'salao-system-front';
}
