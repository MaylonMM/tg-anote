import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CadDisciplinaPage } from './cad-disciplina';

@NgModule({
  declarations: [
    CadDisciplinaPage,
  ],
  imports: [
    IonicPageModule.forChild(CadDisciplinaPage),
  ],
})
export class CadDisciplinaPageModule {}
