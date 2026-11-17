import { ChangeDetectionStrategy,Component,DestroyRef, computed,inject,input,signal} from '@angular/core';
import { Task } from '../task';

@Component({
  imports: [],
  selector: 'app-task-stats',
  styleUrl: './task-stats.css',
  templateUrl: './task-stats.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskStats {
tasks =input.required<Task[]>();

total =computed(() => this.tasks().length);
doneCount =computed(() => this.tasks().filter(t => t.done).length);
openCount =computed(() => this.total() - this.doneCount());
percentDone =computed(() => this.total() === 0 ? 0 : (this.doneCount() / this.total()) * 100);
urgentCount =computed(() => this.tasks().filter(t =>  !t.done && t.priority ==='high').length);

// clock =new Date().toLocaleDateString();
// 2. replace the clock property
clock = signal(new Date().toLocaleTimeString());

constructor() {
  const time = setInterval(() => {
    // this.clock = new Date().toLocaleDateString();
    // 3. inside setInterval, replace the assignment
    this.clock.set(new Date().toLocaleTimeString());
  }, 1000);
  inject(DestroyRef).onDestroy(() => clearInterval(time));
}
}
