import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PurchaseOrdersComponent} from "./purchase-orders.component";
import {Route, RouterModule} from "@angular/router";
import {PurchaseOrderDetailComponent} from './purchase-order-detail/purchase-order-detail.component';
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatMenuModule} from "@angular/material/menu";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatNativeDateModule, MatRippleModule} from "@angular/material/core";
import {MatSortModule} from "@angular/material/sort";
import {MatSelectModule} from "@angular/material/select";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatTableModule} from "@angular/material/table";
import {MatDividerModule} from "@angular/material/divider";
import {SharedModule} from "../shared/shared.module";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {AddPurchaseOrdersComponent} from './add-purchase-orders/add-purchase-orders.component';
import {PurchaseOrdersItemComponent} from './purchase-orders-item/purchase-orders-item.component';
import {EditPurchaseOrderItemComponent} from './edit-purchase-order-item/edit-purchase-order-item.component';
import { UpdatePoItemComponent } from './update-po-item/update-po-item.component';

const purchaseOrderRoutes: Route[] = [
    {
        path: '',
        component: PurchaseOrdersComponent
    },
    {
        path: 'details/:id',
        component: PurchaseOrderDetailComponent,

    },
    {
        path: 'form',
        component: AddPurchaseOrdersComponent,
    },
    {
        path: 'form/:id',
        component: AddPurchaseOrdersComponent,
    },
];

@NgModule({
    declarations: [
        PurchaseOrdersComponent,
        PurchaseOrderDetailComponent,
        AddPurchaseOrdersComponent,
        PurchaseOrdersItemComponent,
        EditPurchaseOrderItemComponent,
        UpdatePoItemComponent
    ],
    imports: [
        RouterModule.forChild(purchaseOrderRoutes),
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
        MatAutocompleteModule,
        MatDividerModule,
        SharedModule,
        MatDatepickerModule,
        MatNativeDateModule

    ]
})
export class PurchaseOrdersModule {
}
