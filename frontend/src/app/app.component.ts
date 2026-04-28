import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar color="primary">
      <mat-icon>folder</mat-icon>
      <span style="margin-left:8px">Gestão de Documentos</span>
      <span style="flex:1 1 auto"></span>
      <a mat-button routerLink="/documents">Lista</a>
      <a mat-button routerLink="/documents/new">Novo</a>
    </mat-toolbar>
    <main style="max-width:1100px;margin:24px auto;padding:0 16px;">
      <router-outlet></router-outlet>
    </main>
  `,
})
export class AppComponent {}
