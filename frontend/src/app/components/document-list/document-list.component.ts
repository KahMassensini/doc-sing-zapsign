import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { DocumentService } from '../../services/document.service';
import { DocumentItem } from '../../models/document.model';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatTableModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatDialogModule,
  ],
  template: `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
      <h2 style="margin:0;">Documentos</h2>
      <a mat-raised-button color="primary" routerLink="/documents/new">
        <mat-icon>add</mat-icon> Novo
      </a>
    </div>

    <div *ngIf="loading" style="text-align:center;padding:40px;">
      <mat-spinner diameter="40" style="margin:auto"></mat-spinner>
    </div>

    <div *ngIf="error" style="color:#b00020;padding:12px;">{{ error }}</div>

    <table *ngIf="!loading && documents.length" mat-table [dataSource]="documents" style="width:100%;background:white;">
      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef>ID</th>
        <td mat-cell *matCellDef="let d">{{ d.id }}</td>
      </ng-container>
      <ng-container matColumnDef="title">
        <th mat-header-cell *matHeaderCellDef>Título</th>
        <td mat-cell *matCellDef="let d">{{ d.title }}</td>
      </ng-container>
      <ng-container matColumnDef="category">
        <th mat-header-cell *matHeaderCellDef>Categoria</th>
        <td mat-cell *matCellDef="let d">{{ d.category || '-' }}</td>
      </ng-container>
      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef style="text-align:right;">Ações</th>
        <td mat-cell *matCellDef="let d" style="text-align:right;">
          <a mat-icon-button color="primary" [routerLink]="['/documents', d.id, 'edit']">
            <mat-icon>edit</mat-icon>
          </a>
          <button mat-icon-button color="warn" (click)="onDelete(d)">
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="cols"></tr>
      <tr mat-row *matRowDef="let row; columns: cols;"></tr>
    </table>

    <p *ngIf="!loading && !documents.length && !error" style="text-align:center;color:#666;padding:40px;">
      Nenhum documento encontrado.
    </p>
  `,
})
export class DocumentListComponent implements OnInit {
  private service = inject(DocumentService);
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  documents: DocumentItem[] = [];
  loading = false;
  error = '';
  cols = ['id', 'title', 'category', 'actions'];

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.error = '';
    this.service.list().subscribe({
      next: (data) => { this.documents = data; this.loading = false; },
      error: (err) => { this.error = err.message; this.loading = false; },
    });
  }

  onDelete(doc: DocumentItem): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Confirmar exclusão', message: `Excluir "${doc.title}"?` },
    });
    ref.afterClosed().subscribe((ok) => {
      if (!ok || doc.id == null) return;
      this.service.delete(doc.id).subscribe({
        next: () => {
          this.snack.open('Documento excluído.', 'OK', { duration: 2500 });
          this.load();
        },
        error: (err) => this.snack.open(err.message, 'OK', { duration: 3500 }),
      });
    });
  }
}
