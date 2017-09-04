import { NgModule } from '@angular/core';
import { PostComponent } from './post/post';
import { IonicModule } from 'ionic-angular';
import { PipesModule } from '../pipes/pipes.module';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { ProfileGridComponent } from './profile-grid/profile-grid';
import { UploadImageItemComponent } from './upload-image-item/upload-image-item';
import { LoadingTextComponent } from './loading-text/loading-text';

@NgModule({
  declarations: [PostComponent,
    ProfileGridComponent,
    UploadImageItemComponent,
    LoadingTextComponent],
  imports: [IonicModule, PipesModule, IonicImageViewerModule],
  exports: [PostComponent,
    ProfileGridComponent,
    UploadImageItemComponent,
    LoadingTextComponent]
})
export class ComponentsModule {
}
