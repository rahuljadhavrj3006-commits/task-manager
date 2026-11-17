import { Component, computed, signal ,ChangeDetectionStrategy,effect} from '@angular/core';
import { Task } from '../task';
import { Highlight } from '../highlight';
import { PriorityLabelPipe } from '../priority-label-pipe';
import { TaskCard } from '../task-card/task-card';
import { TaskForm } from '../task-form/task-form';
import { TaskStats } from '../task-stats/task-stats';

const STORAGE_KEY = 'task-manager-tasks';

const SAMPLE_TASKS: Task[] = [
  { id: 1, title: 'revise components', done: false, priority: 'high', dueDate: '2026-11-12' },
  { id: 2, title: 'learn control flow', done: true, priority: 'medium', dueDate: '2026-11-13' },
  { id: 3, title: 'build task list', done: false, priority: 'low', dueDate: '2026-11-15' }
];

function loadTasks(): Task[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Task[]) : SAMPLE_TASKS;
  } catch {
    return SAMPLE_TASKS;
  }
}


@Component({
  selector: 'app-task-list',
  imports: [Highlight, PriorityLabelPipe, TaskCard, TaskForm, TaskStats],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskList {
  tasks = signal<Task[]>(loadTasks());

  filter = signal<'all' | 'open' | 'done'>('all');

  visibleTasks = computed(() => {
    const f = this.filter();
    return this.tasks().filter(t =>
      f === 'all' ? true : f === 'done' ? t.done : !t.done
    );
  });

  constructor() {
    effect(() => {
      const list = this.tasks();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      console.log('effect: saved', list.length, 'tasks to localStorage');
    });
  }

  toggle(id: number) {
    this.tasks.update(list =>
      list.map(t => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  add(title: string) {
    const nextId = Math.max(0, ...this.tasks().map(t => t.id)) + 1;
    const today = new Date().toISOString().slice(0, 10);
    this.tasks.update(list => [
      ...list,
      { id: nextId, title, done: false, priority: 'medium', dueDate: today }
    ]);
  }

  remove(id: number) {
    this.tasks.update(list => list.filter(t => t.id !== id));
  }
}