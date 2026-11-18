import { ChangeDetectionStrategy,Component,DestroyRef, computed,inject,input,signal} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { interval, map } from 'rxjs';
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
percentDone =computed(() => this.total() === 0 ? 0 : Math.round((this.doneCount() / this.total()) * 100));
urgentCount =computed(() => this.tasks().filter(t =>  !t.done && t.priority ==='high').length);


clock = toSignal(
    interval(1000).pipe(map(() => new Date().toLocaleTimeString())),
    { initialValue: new Date().toLocaleTimeString() }
  );
}
