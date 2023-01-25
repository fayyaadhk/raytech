import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ExampleComponent } from 'app/modules/admin/example/example.component';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatRippleModule} from '@angular/material/core';
import {MatNativeDateModule} from '@angular/material/core';

import {MatSortModule} from '@angular/material/sort';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTableModule} from '@angular/material/table';
import {SharedModule} from '../shared/shared.module';
import {ItemComponent} from './item.component';
import { ItemDetailsComponent } from './item-details/item-details.component';
import {MatDividerModule} from "@angular/material/divider";
import { AddItemSupplierComponent } from './add-item-supplier/add-item-supplier.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatMomentDateModule} from "@angular/material-moment-adapter";
import {AngularMaterialModule} from "../angular-material.module";
import { EditItemSupplierComponent } from './edit-item-supplier/edit-item-supplier.component';
import { AddItemBrandComponent } from './add-item/add-item-brand/add-item-brand.component';
import { AddItemCategoryComponent } from './add-item/add-item-category/add-item-category.component';

const itemRoutes: Route[] = [
    {
        path     : '',
        component: ItemComponent
    },
    {
        path     : 'details/:id',
        component: ItemDetailsComponent,

    }
];

@NgModule({
    declarations: [
        ItemComponent,
        ItemDetailsComponent,
        AddItemSupplierComponent,
        EditItemSupplierComponent,
        AddItemBrandComponent,
        AddItemCategoryComponent
    ],
    providers:[MatDatepickerModule],
    imports: [
        RouterModule.forChild(itemRoutes),
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
        MatDividerModule,
        SharedModule,
        MatAutocompleteModule,
        MatMomentDateModule,
        MatDatepickerModule,
        MatNativeDateModule,
    ]
})
export class ItemModule
{
}
