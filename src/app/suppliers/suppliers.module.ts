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
import {MatDividerModule} from '@angular/material/divider';

import {SharedModule} from '../shared/shared.module';

import {SuppliersComponent} from "./suppliers.component";
import {AddSuppliersComponent} from "./add-suppliers/add-suppliers.component";
import {SuppliersDetailsComponent} from "./suppliers-details/suppliers-details.component";

const suppliersRoutes: Route[] = [
    {
        path     : '',
        component: SuppliersComponent
    },
    {
        path     : 'form',
        component: AddSuppliersComponent
    },
    {
        path     : 'form/:id',
        component: AddSuppliersComponent
    },
    {
        path     : 'details/:id',
        component: SuppliersDetailsComponent
    }
];

@NgModule({
    declarations: [
        SuppliersComponent,
        AddSuppliersComponent,
        SuppliersDetailsComponent
    ],
    imports     : [
        RouterModule.forChild(suppliersRoutes),
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
export class SuppliersModule
{
}
