import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, Subject, catchError, debounceTime, distinctUntilChanged, map, of, switchMap, tap } from 'rxjs';
import { Highlight } from '../highlight';
import { PriorityLabelPipe } from '../priority-label-pipe';
import { TaskCard } from '../task-card/task-card';
import { TaskForm } from '../task-form/task-form';
import { TaskStats } from '../task-stats/task-stats';
import { TaskStore } from '../task-store';

@Component({
  selector: 'app-task-list',
  imports: [Highlight, PriorityLabelPipe, TaskCard, TaskForm, TaskStats],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskList {
  protected readonly store = inject(TaskStore);

  filter = signal<'all' | 'open' | 'done'>('all');
  searching = signal(false);
  searchError = signal('');

  private readonly searchInput$ = new Subject<string>();

  private readonly matchIds = toSignal(
    this.searchInput$.pipe(
      map(value => value.trim().toLowerCase()),
      debounceTime(300),
      distinctUntilChanged(),
      tap(term => {
        this.searchError.set('');
        this.searching.set(term !== '');
      }),
      switchMap((term): Observable<string[] | null> =>
        term === ''
          ? of(null)
          : this.store.search(term).pipe(
              catchError((err: Error) => {
                this.searchError.set(err.message);
                return of([]);
              })
            )
      ),
      tap(() => this.searching.set(false))
    ),
    { initialValue: null }
  );

  visibleTasks = computed(() => {
    const f = this.filter();
    const ids = this.matchIds();
    return this.store.tasks().filter(t =>
      (f === 'all' ? true : f === 'done' ? t.done : !t.done) &&
      (ids === null || ids.includes(t.id))
    );
  });

  onSearch(value: string) {
    this.searchInput$.next(value);
  }
}