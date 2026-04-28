import { Routes } from '@angular/router';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { DocumentFormComponent } from './components/document-form/document-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'documents', pathMatch: 'full' },
  { path: 'documents', component: DocumentListComponent },
  { path: 'documents/new', component: DocumentFormComponent },
  { path: 'documents/:id/edit', component: DocumentFormComponent },
  { path: '**', redirectTo: 'documents' },
];
