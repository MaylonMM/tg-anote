import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CadNotaPage } from './cad-nota';

@NgModule({
  declarations: [
    CadNotaPage,
  ],
  imports: [
    IonicPageModule.forChild(CadNotaPage),
  ],
})
export class CadNotaPageModule {}
