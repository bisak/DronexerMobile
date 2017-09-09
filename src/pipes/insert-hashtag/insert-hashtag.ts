import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'insertHashtag'
})
export class InsertHashtagPipe implements PipeTransform {

  transform(value: string, ...args) {
    return `#${value}`;
  }
}
