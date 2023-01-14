import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeopleComponent } from './people.component';
export { PeopleComponent } from './people.component';




@NgModule({
    declarations: [
        PeopleComponent
    ],
    exports: [
        PeopleComponent
    ],
    imports: [
        CommonModule
    ]
})
export class PeopleModule { }
