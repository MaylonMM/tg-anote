import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CadProfessorPage } from './cad-professor';

@NgModule({
  declarations: [
    CadProfessorPage,
  ],
  imports: [
    IonicPageModule.forChild(CadProfessorPage),
  ],
})
export class CadProfessorPageModule {}
