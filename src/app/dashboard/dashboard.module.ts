import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import {Route, RouterModule} from "@angular/router";
import {PeopleModule} from "../people/people.module";
import {BrandModule} from "../brand/brand.module";
import { RfqSummaryComponent } from './rfq-summary/rfq-summary.component';
import {AngularMaterialModule} from "../angular-material.module";
import {MatTableModule} from "@angular/material/table";

const dashboardRoutes: Route[] = [
    {
        path     : '',
        component: DashboardComponent
    }
];

@NgModule({
  declarations: [
      DashboardComponent,
      RfqSummaryComponent,
  ],
    imports: [
        RouterModule.forChild(dashboardRoutes),

        CommonModule,
        PeopleModule,
        AngularMaterialModule,
        MatTableModule,
    ]
})
export class DashboardModule { }
