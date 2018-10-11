import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CadAnotacaoPage } from './cad-anotacao';

@NgModule({
  declarations: [
    CadAnotacaoPage,
  ],
  imports: [
    IonicPageModule.forChild(CadAnotacaoPage),
  ],
})
export class CadAnotacaoPageModule {}
