import {Component, Inject, OnInit} from '@angular/core';
import {RFQItemStatus} from "../../data/rfq-item-status";
import {Subject, takeUntil} from "rxjs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {POItemStatus} from "../../data/purchase-order-item-status";
import {RfqItemService} from "../../rfq-item/rfq-item.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {PurchaseOrderService} from "../purchase-order.service";

@Component({
  selector: 'app-update-po-item',
  templateUrl: './update-po-item.component.html',
  styleUrls: ['./update-po-item.component.scss']
})
export class UpdatePoItemComponent implements OnInit {
    poItemId: number;
    status: string = '';
    keys = Object.keys;
    poItemStatus = POItemStatus;

    endsubs$: Subject<any> = new Subject();

    isLoading: boolean = true;
    updateSuccess = false;
    addSuccess = false;

    poItemStatusForm: FormGroup;

    public itemFilter: FormControl = new FormControl();

    formFieldHelpers: string[] = [''];
    filteredStatuses: Array<any> = [];
  constructor(private formBuilder: FormBuilder,
              private poService: PurchaseOrderService,
              private dialogRef: MatDialogRef<UpdatePoItemComponent>,
              @Inject(MAT_DIALOG_DATA) public data) { }

    ngOnInit(): void {
        this._initForm();
        console.log(">>> data", this.data);
    }

    onSubmit() {
        this.status = this.poItemStatusForm.get('itemStatus').value;

        this.poService.updatePoItemStatus({status: this.status}, this.data.rfqItemId)
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
        this.poItemStatusForm = this.formBuilder.group({
            itemStatus: [this.data.status, Validators.required]
        });
    }

}
