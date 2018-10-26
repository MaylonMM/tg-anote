import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfessoresPage } from './professores';

@NgModule({
  declarations: [
    ProfessoresPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfessoresPage),
  ],
})
export class ProfessoresPageModule {}
