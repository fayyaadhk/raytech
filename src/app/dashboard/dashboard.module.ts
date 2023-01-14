import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import {Route, RouterModule} from "@angular/router";
import {PeopleModule} from "../people/people.module";
import {BrandModule} from "../brand/brand.module";
import { RfqSummaryComponent } from './rfq-summary/rfq-summary.component';
import {AngularMaterialModule} from "../angular-material.module";
import {MatTableModule} from "@angular/material/table";
import { JobTrackerComponent } from './job-tracker/job-tracker.component';
import {FuseFindByKeyPipeModule} from "../../@fuse/pipes/find-by-key";

const dashboardRoutes: Route[] = [
    {
        path     : '',
        component: DashboardComponent
    },
    {
        path     : 'rfqs',
        component: DashboardComponent
    },
    {
        path     : 'purchase-orders',
        component: DashboardComponent
    }
];

@NgModule({
  declarations: [
      DashboardComponent,
      RfqSummaryComponent,
      JobTrackerComponent,
  ],
    imports: [
        RouterModule.forChild(dashboardRoutes),

        CommonModule,
        PeopleModule,
        AngularMaterialModule,
        MatTableModule,
        FuseFindByKeyPipeModule,
    ]
})
export class DashboardModule { }
