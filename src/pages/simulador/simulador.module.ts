import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SimuladorPage } from './simulador';

@NgModule({
  declarations: [
    SimuladorPage,
  ],
  imports: [
    IonicPageModule.forChild(SimuladorPage),
  ],
})
export class SimuladorPageModule {}
