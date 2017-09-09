import { NgModule } from '@angular/core';
import { TimeAgoPipe } from './time-ago/time-ago';
import { InsertHashtagPipe } from './insert-hashtag/insert-hashtag';
@NgModule({
	declarations: [TimeAgoPipe,
    InsertHashtagPipe],
	imports: [],
	exports: [TimeAgoPipe,
    InsertHashtagPipe]
})
export class PipesModule {}
