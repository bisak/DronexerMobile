import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TagPage } from './tag';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    TagPage
  ],
  imports: [
    IonicPageModule.forChild(TagPage),
    ComponentsModule
  ]
})
export class TagPageModule {
}
