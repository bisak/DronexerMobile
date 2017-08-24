import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostCommentsPage } from './post-comments';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    PostCommentsPage
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(PostCommentsPage),
  ],
})
export class PostCommentsPageModule {}
