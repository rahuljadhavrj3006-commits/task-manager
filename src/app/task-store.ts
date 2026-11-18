import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, finalize, map } from 'rxjs';
import { Task } from './task';
import { TaskApi } from './task-api';

@Injectable({ providedIn: 'root' })
export class TaskStore {
  private readonly api = inject(TaskApi);

  private readonly _tasks = signal<Task[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly tasks = this._tasks.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly total = computed(() => this._tasks().length);
  readonly doneCount = computed(() => this._tasks().filter(t => t.done).length);
  readonly openCount = computed(() => this.total() - this.doneCount());

  constructor() {
    this.load();
  }

  load() {
    this._loading.set(true);
    this._error.set(null);
    this.api.getAll()
      .pipe(finalize(() => this._loading.set(false)))
      .subscribe({
        next: tasks => this._tasks.set(tasks),
        error: (err: Error) => this._error.set(err.message)
      });
  }

  add(title: string) {
    const today = new Date().toISOString().slice(0, 10);
    this.api.create({ title, done: false, priority: 'medium', dueDate: today }).subscribe({
      next: created => this._tasks.update(list => [...list, created]),
      error: (err: Error) => this._error.set(err.message)
    });
  }

  toggle(id: string) {
    const before = this._tasks();
    const task = before.find(t => t.id === id);
    if (!task) {
      return;
    }
    this._tasks.update(list =>
      list.map(t => (t.id === id ? { ...t, done: !t.done } : t))
    );
    this.api.update(id, { done: !task.done }).subscribe({
      error: (err: Error) => {
        this._tasks.set(before);
        this._error.set(err.message);
      }
    });
  }

  remove(id: string) {
    const before = this._tasks();
    this._tasks.update(list => list.filter(t => t.id !== id));
    this.api.delete(id).subscribe({
      error: (err: Error) => {
        this._tasks.set(before);
        this._error.set(err.message);
      }
    });
  }

  search(term: string): Observable<string[]> {
    return this.api.search(term).pipe(map(tasks => tasks.map(t => t.id)));
  }

  clearError() {
    this._error.set(null);
  }
}