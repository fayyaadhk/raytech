import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ItemService} from "../../item/item.service";
import {SupplierService} from "../../suppliers/suppliers.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {RFQItemStatus} from "../../data/rfq-item-status";
import {Subject, takeUntil} from "rxjs";
import {RfqItemService} from "../../rfq-item/rfq-item.service";

@Component({
    selector: 'app-update-rfq-item-status',
    templateUrl: './update-rfq-item-status.component.html',
    styleUrls: ['./update-rfq-item-status.component.scss']
})
export class UpdateRfqItemStatusComponent implements OnInit {
    rfqItemId: number;
    status: string = '';
    keys = Object.keys;
    rfqItemStatus = RFQItemStatus;

    endsubs$: Subject<any> = new Subject();

    isLoading: boolean = true;
    updateSuccess = false;
    addSuccess = false;

    rfqItemStatusForm: FormGroup;

    public itemFilter: FormControl = new FormControl();

    formFieldHelpers: string[] = [''];
    filteredStatuses: Array<any> = [];

    constructor(private formBuilder: FormBuilder,
                private rfqItemService: RfqItemService,
                private dialogRef: MatDialogRef<UpdateRfqItemStatusComponent>,
                @Inject(MAT_DIALOG_DATA) public data) {
    }

    ngOnInit(): void {
        this._initForm();
        console.log(">>> data", this.data);
    }

    onSubmit() {
        this.status = this.rfqItemStatusForm.get('itemStatus').value;

        this.rfqItemService.updateRfqItemStatus({status: this.status}, this.data.rfqItemId)
            .pipe(takeUntil(this.endsubs$))
            .subscribe((item) => {
                this.dialogRef.close(
                    {
                        updated: true
                    }
                )
                this.addSuccess = true;
            });
    }

    private _initForm() {
        this.isLoading = true;
        this.rfqItemStatusForm = this.formBuilder.group({
            itemStatus: [this.data.status, Validators.required]
        });
    }

}
