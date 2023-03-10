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
import {MatSortModule} from '@angular/material/sort';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatRadioModule} from '@angular/material/radio';
import { MatNativeDateModule } from '@angular/material/core';
import {SharedModule} from '../../shared/shared.module';
import {AddRfqComponent} from './add-rfq.component';
import {RfqItemComponent} from "../../rfq-item/rfq-item.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatTableModule} from '@angular/material/table';
import {MatDividerModule} from '@angular/material/divider';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import { AddNewItemComponent } from './add-new-item/add-new-item.component';

const addRfqRoutes: Route[] = [
    {
        path     : '',
        component: AddRfqComponent
    }
];

@NgModule({
    declarations: [
        AddRfqComponent,
        RfqItemComponent,
        AddNewItemComponent
    ],
    imports: [
        RouterModule.forChild(addRfqRoutes),
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
        MatStepperModule,
        MatExpansionModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatRadioModule,
        SharedModule,
        MatDialogModule,
        MatTableModule,
        MatDividerModule,
        MatAutocompleteModule
    ]
})
export class AddRfqModule
{
}
