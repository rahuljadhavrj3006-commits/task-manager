import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from './api-url';
import { Task } from './task';

@Injectable({ providedIn: 'root' })
export class TaskApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${inject(API_URL)}/tasks`;

  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseUrl);
  }

  create(task: Omit<Task, 'id'>): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, task);
  }

  update(id: string, changes: Partial<Task>): Observable<Task> {
    return this.http.patch<Task>(`${this.baseUrl}/${id}`, changes);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  search(term: string): Observable<Task[]> {
    const params = new HttpParams().set('title:contains', term);
    return this.http.get<Task[]>(this.baseUrl, { params });
  }
}