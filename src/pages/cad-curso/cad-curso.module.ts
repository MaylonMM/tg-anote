import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CadCursoPage } from './cad-curso';

@NgModule({
  declarations: [
    CadCursoPage,
  ],
  imports: [
    IonicPageModule.forChild(CadCursoPage),
  ],
})
export class CadCursoPageModule {}
