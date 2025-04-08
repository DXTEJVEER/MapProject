import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArcgisComponent } from './components/arcgis.component';

const routes: Routes = [
  { path: '', component: ArcgisComponent },
  { path: ':item', component: ArcgisComponent },
  { path: ':item/:lat/:lng', component: ArcgisComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArcgisRoutingModule {}
