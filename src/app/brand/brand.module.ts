import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
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
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTableModule} from '@angular/material/table';
import {MatDividerModule} from '@angular/material/divider';
import {SharedModule} from '../shared/shared.module';
import {BrandComponent} from "./brand.component";
import { AddBrandComponent } from './add-brand/add-brand.component';

const brandRoutes: Route[] = [
    {
        path     : '',
        component: BrandComponent
    },
    {
        path     : 'form',
        component: AddBrandComponent,

    },
    {
        path     : 'form/:id',
        component: AddBrandComponent,

    }
];

@NgModule({
    declarations: [
        BrandComponent,
        AddBrandComponent
    ],
    exports: [
        BrandComponent
    ],
    imports: [
        RouterModule.forChild(brandRoutes),
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
        SharedModule
    ]
})
export class BrandModule
{
}
