import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '3dMap',
    pathMatch: 'full',
  },
  {
    path: '3dMap',
    loadChildren: () =>
      import('./main/arcgis/arcgis.module').then((m) => m.ArcgisModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
