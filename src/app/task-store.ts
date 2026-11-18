import { Service ,Injectable, InjectionToken, computed, effect, inject, signal } from '@angular/core';
import { Observable,delay,of,tap,throwError } from 'rxjs';
import { Task } from './task';

export const TASK_STORAGE_KEY = new InjectionToken<string>('TASK_STORAGE_KEY',{ 
  providedIn: 'root',
   factory: () => 'task-manager-tasks' 
  });

const SAMPLE_TASKS: Task[] = [
  { id: 1, title: 'revise components', done: false, priority: 'high', dueDate: '2026-11-12' },
  { id: 2, title: 'learn control flow', done: true, priority: 'medium', dueDate: '2026-11-13' },
  { id: 3, title: 'build task list', done: false, priority: 'low', dueDate: '2026-11-15' }
];

@Injectable({ providedIn: 'root' })
export class TaskStore {
  private readonly storageKey = inject(TASK_STORAGE_KEY);
  private readonly _tasks = signal<Task[]>(this.load());

  readonly tasks = this._tasks.asReadonly();
  readonly total = computed(() => this._tasks().length);
  readonly doneCount = computed(() => this._tasks().filter(t => t.done).length);
  readonly openCount = computed(() => this.total() - this.doneCount());

  constructor() {
    // console.log('TaskStore created');
    effect(() => {
      localStorage.setItem(this.storageKey, JSON.stringify(this._tasks()));
    });
  }

  add(title: string) {
    const nextId = Math.max(0, ...this._tasks().map(t => t.id)) + 1;
    const today = new Date().toISOString().slice(0, 10);
    this._tasks.update(list => [
      ...list,
      { id: nextId, title, done: false, priority: 'medium', dueDate: today }
    ]);
  }

  toggle(id: number) {
    this._tasks.update(list =>
      list.map(t => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  remove(id: number) {
    this._tasks.update(list => list.filter(t => t.id !== id));
  }

   search(term: string): Observable<number[]> {
    if (term === 'fail') {
      return throwError(() => new Error('Search server is not responding'));
    }
    const ids = this._tasks()
      .filter(t => t.title.toLowerCase().includes(term))
      .map(t => t.id);
    const ms = 300 + Math.floor(Math.random() * 1200);
    console.log(`request "${term}" (${ms} ms)`);
    return of(ids).pipe(
      delay(ms),
      tap(() => console.log(`response "${term}"`))
    );
  }

  private load(): Task[] {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? (JSON.parse(saved) as Task[]) : SAMPLE_TASKS;
    } catch {
      return SAMPLE_TASKS;
    }
  }
}
