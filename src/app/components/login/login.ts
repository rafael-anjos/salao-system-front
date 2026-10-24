import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { SalaoEstadoService } from '../../core/salao-estado.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly estado = inject(SalaoEstadoService);
  private readonly rota = inject(ActivatedRoute);
  private readonly router = inject(Router);

  usuario = '';
  senha = '';
  readonly mostrarSenha = signal(false);
  readonly enviando = signal(false);
  readonly erro = signal('');

  get nomeSalao(): string {
    return this.estado.salao;
  }

  async entrar(): Promise<void> {
    if (this.enviando()) {
      return;
    }
    this.enviando.set(true);
    this.erro.set('');
    const resultado = await this.auth.entrar(this.usuario, this.senha);
    this.enviando.set(false);
    if (!resultado.ok) {
      this.erro.set(resultado.mensagem);
      return;
    }
    await this.router.navigateByUrl(this.destinoSeguro());
  }

  alternarSenha(): void {
    this.mostrarSenha.update((aberto) => !aberto);
  }

  limparErro(): void {
    this.erro.set('');
  }

  private destinoSeguro(): string {
    const voltar = this.rota.snapshot.queryParamMap.get('voltar') ?? '';
    if (voltar.startsWith('/') && !voltar.startsWith('//') && !voltar.startsWith('/login')) {
      return voltar;
    }
    return '/';
  }
}
