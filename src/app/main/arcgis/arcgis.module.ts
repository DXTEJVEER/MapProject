import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArcgisComponent } from './components/arcgis.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ArcgisRoutingModule } from './arcgis-routing.module';

@NgModule({
  declarations: [ArcgisComponent],
  imports: [CommonModule, ArcgisRoutingModule, ReactiveFormsModule],
})
export class ArcgisModule {}
