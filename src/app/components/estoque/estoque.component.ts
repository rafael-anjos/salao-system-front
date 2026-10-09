import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-estoque',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estoque.component.html',
  styleUrls: ['./estoque.component.css']
})
export class EstoqueComponent {

  abaAtiva: string = 'produtos';

  termoBusca: string = '';
  categoriaSelecionada: string = '';
  filtroUso: string = 'todos';

  mudarAba(aba: string): void {
    this.abaAtiva = aba;
  }

  mudarFiltroUso(filtro: string): void {
    this.filtroUso = filtro;
  }

}