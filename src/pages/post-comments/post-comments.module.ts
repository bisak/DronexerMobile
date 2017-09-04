import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostCommentsPage } from './post-comments';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    PostCommentsPage
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(PostCommentsPage),
    ComponentsModule
  ]
})
export class PostCommentsPageModule {
}
