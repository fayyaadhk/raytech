import {Component, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-rfq-item',
  templateUrl: './rfq-item.component.html',
  styleUrls: ['./rfq-item.component.scss']
})
export class RfqItemComponent implements OnInit {
    rfqItems: any = [];
    form: FormGroup;
    isSubmitted = false;
    endsubs$: Subject<any> = new Subject();
    addSuccess = false;
    updateSuccess = false;
    currentItemId: string;
    isLoading: boolean = false;

    ngOnInit() {

    }
}
