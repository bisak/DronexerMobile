import { Component, Input } from '@angular/core';

@Component({
  selector: 'loading-text',
  templateUrl: 'loading-text.html'
})
export class LoadingTextComponent {

  @Input() text;
  constructor() {
  }

}
