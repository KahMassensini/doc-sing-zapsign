import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DocumentService } from '../../services/document.service';
import { DocumentPayload, Signer } from '../../models/document.model';

@Component({
  selector: 'app-document-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatProgressSpinnerModule, MatCardModule,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>{{ isEdit ? 'Editar Documento' : 'Novo Documento' }}</mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <div *ngIf="loading" style="text-align:center;padding:24px;">
          <mat-spinner diameter="32"></mat-spinner>
        </div>

        <form *ngIf="!loading" [formGroup]="form" (ngSubmit)="submit()" style="display:flex;flex-direction:column;gap:12px;margin-top:16px;">

          <!-- Título -->
          <mat-form-field appearance="outline">
            <mat-label>Título</mat-label>
            <input matInput formControlName="title" />
          </mat-form-field>

          <!-- Categoria -->
          <mat-form-field appearance="outline">
            <mat-label>Categoria</mat-label>
            <input matInput formControlName="category" />
          </mat-form-field>

          <!-- Descrição -->
          <mat-form-field appearance="outline">
            <mat-label>Descrição</mat-label>
            <textarea matInput rows="3" formControlName="description"></textarea>
          </mat-form-field>

          <!-- SIGNATÁRIOS -->
          <div formArrayName="signers">
            <h3>Signatários</h3>

            <div *ngFor="let signer of signers.controls; let i = index" [formGroupName]="i" style="display:flex;gap:8px;align-items:center;">

              <mat-form-field appearance="outline" style="flex:1;">
                <mat-label>Nome</mat-label>
                <input matInput formControlName="name" />
              </mat-form-field>

              <mat-form-field appearance="outline" style="flex:1;">
                <mat-label>Email</mat-label>
                <input matInput formControlName="email" />
              </mat-form-field>

              <button mat-icon-button color="warn" type="button" (click)="removeSigner(i)">
                <mat-icon>delete</mat-icon>
              </button>
            </div>

            <button mat-button type="button" (click)="addSigner()">
              + Adicionar signatário
            </button>
          </div>

          <!-- AÇÕES -->
          <div style="display:flex;gap:8px;justify-content:flex-end;">
            <a mat-button routerLink="/documents">Cancelar</a>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving">
              {{ saving ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>

        </form>
      </mat-card-content>
    </mat-card>
  `,
})
export class DocumentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(DocumentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  isEdit = false;
  loading = false;
  saving = false;
  id: number | null = null;

  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    category: [''],
    description: [''],
    signers: this.fb.array([]),
  });

  get signers(): FormArray {
    return this.form.get('signers') as FormArray;
  }

  addSigner(): void {
    this.signers.push(
      this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
      })
    );
  }

  removeSigner(index: number): void {
    this.signers.removeAt(index);
  }

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');

    if (param) {
      this.isEdit = true;
      this.id = Number(param);
      this.loading = true;

      this.service.getById(this.id).subscribe({
        next: (doc: any) => {
          this.form.patchValue({
            title: doc.title,
            category: doc.category,
            description: doc.description,
          });

          // Se backend já tiver signers
          if (doc.signers?.length) {
            doc.signers.forEach((s: any) => {
              this.signers.push(
                this.fb.group({
                  name: [s.name],
                  email: [s.email],
                })
              );
            });
          }

          this.loading = false;
        },
        error: (err) => {
          this.snack.open(err.message, 'OK', { duration: 3500 });
          this.loading = false;
        },
      });
    } else {
      // cria 1 signer por padrão
      this.addSigner();
    }
  }

submit(): void {
  if (this.form.invalid) return;

  this.saving = true;

  const formValue = this.form.getRawValue();

  const payload: DocumentPayload = {
    name: formValue.title!,            
    file_url: '',                      
    signers: (formValue.signers ?? []) as Signer[]
  };

  const req = this.isEdit && this.id != null
    ? this.service.update(this.id, payload)
    : this.service.create(payload);

  req.subscribe({
    next: () => {
      this.snack.open(
        this.isEdit ? 'Documento atualizado.' : 'Documento criado.',
        'OK',
        { duration: 2500 }
      );
      this.router.navigate(['/documents']);
    },
    error: (err) => {
      this.snack.open(err?.message || 'Erro ao salvar documento', 'OK', { duration: 3500 });
      this.saving = false;
    },
  });
}
}