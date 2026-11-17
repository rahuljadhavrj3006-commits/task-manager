import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priorityLabel',
})
export class PriorityLabelPipe implements PipeTransform {
  transform(value: 'low' | 'medium' | 'high'): string {
    const labels = { low: 'Low', medium: 'Medium', high: 'High priority' };
    return labels[value];
  }
}
