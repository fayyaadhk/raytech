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
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatSortModule} from '@angular/material/sort';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import {SharedModule} from '../shared/shared.module';
import {RfqComponent} from './rfq.component';
import {RfqDetailsComponent} from "./rfq-details/rfq-details.component";
import {AddRfqComponent} from "./add-rfq/add-rfq.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatDatepickerModule} from "@angular/material/datepicker";
import { EditRFQItemComponent } from './edit-rfqitem/edit-rfqitem.component';
import { CreatePOFromRFQComponent } from './rfq-details/create-pofrom-rfq/create-pofrom-rfq.component';


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
        RfqComponent,
        EditRFQItemComponent,
        CreatePOFromRFQComponent
    ],
    imports     : [
        RouterModule.forChild(rfqRoutes),
        MatNativeDateModule,
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
        MatDialogModule,
        MatDatepickerModule,
        MatAutocompleteModule,
        SharedModule
    ]
})
export class RfqModule
{
}
