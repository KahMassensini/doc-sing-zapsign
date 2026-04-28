import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';

/* =========================
   MODELOS (Angular)
========================= */

export interface Signer {
  name: string;
  email: string;
}

export interface DocumentItem {
  id: number;
  title: string;
  description?: string;
  category?: string;
  file_url?: string;
  created_at: string;
  updated_at: string;
  signers: Signer[];
}

export interface DocumentPayload {
  name: string;
  file_url?: string;
  signers: Signer[];
}

/* =========================
   MODELO DO DJANGO (API)
========================= */

interface DjangoDocument {
  id: number;
  name: string;
  status: string;
  external_id: string | null;
  created_at: string;
  last_updated_at: string;
  signers?: {
    name: string;
    email: string;
  }[];
}

/* =========================
   MAPPERS
========================= */

// Django → Angular
function mapToAngular(doc: DjangoDocument): DocumentItem {
  return {
    id: doc.id,
    title: doc.name,  // name do Django → title do Angular
    description: doc.status,  // status → description
    file_url: doc.external_id || undefined,
    created_at: doc.created_at,
    updated_at: doc.last_updated_at,
    signers: doc.signers || [],
  };
}

// Angular → Django
function mapToDjango(payload: DocumentPayload) {
  return {
    name: payload.name,
    status: 'pending',
    external_id: payload.file_url || null,
    created_by: 'system',
    company: 1,
    signers: payload.signers,
  };
}

/* =========================
   SERVICE
========================= */

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/documents`;

  // 🧠 Estado reativo
  private documentsSubject = new BehaviorSubject<DocumentItem[]>([]);
  documents$ = this.documentsSubject.asObservable();

  /* =========================
     LISTAR DOCUMENTOS (Observable)
  ========================= */
  list(): Observable<DocumentItem[]> {
    return this.http.get<DjangoDocument[]>(`${this.baseUrl}/`)
      .pipe(map(docs => docs.map(mapToAngular)));
  }

  /* =========================
     LISTAR DOCUMENTOS (State)
  ========================= */
  fetchDocuments(): void {
    this.http.get<DjangoDocument[]>(`${this.baseUrl}/`)
      .pipe(map(docs => docs.map(mapToAngular)))
      .subscribe({
        next: (docs) => this.documentsSubject.next(docs),
        error: (err) => console.error('Erro ao buscar documentos', err)
      });
  }

  /* =========================
     CRIAR DOCUMENTO
  ========================= */
  create(payload: DocumentPayload): Observable<DocumentItem> {
    return this.http.post<DjangoDocument>(
      `${this.baseUrl}/`,
      mapToDjango(payload)
    ).pipe(
      map(mapToAngular),
      tap((newDoc) => {
        const current = this.documentsSubject.value;
        this.documentsSubject.next([newDoc, ...current]);
      })
    );
  }

  /* =========================
     BUSCAR POR ID
  ========================= */
  getById(id: number): Observable<DocumentItem> {
    return this.http.get<DjangoDocument>(`${this.baseUrl}/${id}/`)
      .pipe(map(mapToAngular));
  }

  /* =========================
     ATUALIZAR
  ========================= */
  update(id: number, payload: DocumentPayload): Observable<DocumentItem> {
    return this.http.put<DjangoDocument>(
      `${this.baseUrl}/${id}/`,
      mapToDjango(payload)
    ).pipe(
      map(mapToAngular),
      tap((updatedDoc) => {
        const current = this.documentsSubject.value;
        const updatedList = current.map(doc =>
          doc.id === id ? updatedDoc : doc
        );
        this.documentsSubject.next(updatedList);
      })
    );
  }

  /* =========================
     DELETAR
  ========================= */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/`)
      .pipe(
        tap(() => {
          const current = this.documentsSubject.value;
          const updatedList = current.filter(doc => doc.id !== id);
          this.documentsSubject.next(updatedList);
        })
      );
  }
}