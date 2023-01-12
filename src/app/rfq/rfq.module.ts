import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatRippleModule} from '@angular/material/core';
import {MatSortModule} from '@angular/material/sort';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import {MatExpansionModule} from '@angular/material/expansion';


import {SharedModule} from '../shared/shared.module';
import {RfqComponent} from './rfq.component';
import {ItemComponent} from "../item/item.component";
import {ItemDetailsComponent} from "../item/item-details/item-details.component";
import {RfqDetailsComponent} from "./rfq-details/rfq-details.component";
import {AddRfqComponent} from "./add-rfq/add-rfq.component";

const rfqRoutes: Route[] = [
    {
        path     : '',
        component: RfqComponent
    },
    {
        path     : 'details/:id',
        component: RfqDetailsComponent,

    },
    {
        path     : 'form',
        component: AddRfqComponent,

    }
];

@NgModule({
    declarations: [
        RfqComponent
    ],
    imports     : [
        RouterModule.forChild(rfqRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSortModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatExpansionModule,
        MatTableModule,
        SharedModule
    ]
})
export class RfqModule
{
}
