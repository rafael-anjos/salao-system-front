import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EstoqueComponent } from './components/estoque/estoque.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    EstoqueComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'salao-system-front';
}
