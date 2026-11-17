import { Component, ElementRef, output, viewChild } from '@angular/core';

@Component({
  selector: 'app-task-form',
  imports: [],
  templateUrl: './task-form.html',
  styleUrl: './task-form.css'
})
export class TaskForm {
  added = output<string>();
  titleInput = viewChild.required<ElementRef<HTMLInputElement>>('titleInput');

  submit() {
    const el = this.titleInput().nativeElement;
    const title = el.value.trim();
    if (!title) {
      return;
    }
    this.added.emit(title);
    el.value = '';
    el.focus();
  }
}