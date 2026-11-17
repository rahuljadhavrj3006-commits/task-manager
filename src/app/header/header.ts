import { Component,ChangeDetectionStrategy, inject } from '@angular/core';
import { TaskStore } from '../task-store';

@Component({
  imports: [],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header {
  protected readonly store = inject(TaskStore);
}
