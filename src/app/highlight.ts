import { Directive,input,signal } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  host: {
    '(mouseenter)': 'hovered.set(true)',
    '(mouseleave)': 'hovered.set(false)',
    '[style.backgroundColor]': 'hovered() ? highlightColor() : null',
  },
})
export class Highlight {
  highlightColor = input('lightyellow');
  hovered = signal(false);
}
