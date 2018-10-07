import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CadEscolaPage } from './cad-escola';

@NgModule({
  declarations: [
    CadEscolaPage,
  ],
  imports: [
    IonicPageModule.forChild(CadEscolaPage),
  ],
})
export class CadEscolaPageModule {}
