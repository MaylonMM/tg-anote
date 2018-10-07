import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EscolasPage } from './escolas';

@NgModule({
  declarations: [
    EscolasPage,
  ],
  imports: [
    IonicPageModule.forChild(EscolasPage),
  ],
})
export class EscolasPageModule {}
