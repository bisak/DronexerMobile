import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchPage } from './search';
import { SearchProvider } from '../../providers/search/search';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    SearchPage,
  ],
  imports: [
    PipesModule,
    ComponentsModule,
    IonicPageModule.forChild(SearchPage),
  ],
  providers:[
    SearchProvider
  ]
})
export class SearchPageModule {}
