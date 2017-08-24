import { NgModule } from '@angular/core';
import { PostComponent } from './post/post';
import { IonicModule } from 'ionic-angular';
import { PipesModule } from '../pipes/pipes.module';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { ProfileGridComponent } from './profile-grid/profile-grid';

@NgModule({
  declarations: [PostComponent,
    ProfileGridComponent],
  imports: [IonicModule, PipesModule, IonicImageViewerModule],
  exports: [PostComponent,
    ProfileGridComponent]
})
export class ComponentsModule {
}
