import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  get nomeSessao(): string {
    return this.auth.sessao()?.nome ?? '';
  }

  async sair(): Promise<void> {
    this.auth.sair();
    await this.router.navigateByUrl('/login');
  }
}