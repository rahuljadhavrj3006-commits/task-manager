import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { Task } from '../task';

@Component({
  selector: 'app-task-card',
  imports: [DatePipe, TitleCasePipe],
  templateUrl: './task-card.html',
  styleUrl: './task-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskCard {
  task = input.required<Task>();
  index = input(0);

  toggled = output<number>();
  removed = output<number>();
}