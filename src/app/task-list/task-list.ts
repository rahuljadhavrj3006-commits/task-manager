import { Component, computed, signal ,ChangeDetectionStrategy,inject} from '@angular/core';
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

  visibleTasks = computed(() => {
    const f = this.filter();
    return this.store.tasks().filter(t =>
      f === 'all' ? true : f === 'done' ? t.done : !t.done
    );
  });
}