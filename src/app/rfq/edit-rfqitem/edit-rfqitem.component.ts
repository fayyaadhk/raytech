import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {RfqItem} from "../../api/models/rfq-item";
import {Item} from "../../api/models/item";
import {Supplier} from "../../api/models/supplier";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";
import {ItemService} from "../../item/item.service";
import {SupplierService} from "../../suppliers/suppliers.service";
import {RfqItemService} from "../../rfq-item/rfq-item.service";
import {UpdateRfqItemRequest} from "../../api/models/requests/update-rfq-item-request";
import {RfqModule} from "../rfq.module";
import {POItemStatus} from "../../data/purchase-order-item-status";
import {RFQItemStatus} from "../../data/rfq-item-status";

@Component({
    selector: 'app-edit-rfqitem',
    templateUrl: './edit-rfqitem.component.html',
    styleUrls: ['./edit-rfqitem.component.scss']
})
export class EditRFQItemComponent implements OnInit {

    rfqItem: RfqItem;

    items: Item[];
    suppliers: Supplier[];
    endsubs$: Subject<any> = new Subject();

    rfqItemForm: FormGroup;

    addSuccess: boolean = false;
    isLoading: boolean = true;
    updateSuccess: boolean = true;
    keys = Object.keys;
    rfqItemStatus = RFQItemStatus;

    constructor(@Inject(MAT_DIALOG_DATA) public data: RfqItem,
                private dialogRef: MatDialogRef<EditRFQItemComponent>,
                private itemService: ItemService,
                private rfqService: RfqItemService,
                private supplierService: SupplierService,
                private formBuilder: FormBuilder) {
    }

    get itemForm() {
        return this.rfqItemForm.controls;
    }

    ngOnInit(): void {

        this.rfqItemForm = this.formBuilder.group({
            itemId: ['', Validators.required],
            name: [''],
            quantity: [null],
            priceQuoted: [null],
            status: [''],
            expectedArrivalDate: [''],
            supplierId: ['']
        });

        this._getItems();
        this._getRfqItem();
        this._getSuppliers();
    }

    onSubmit() {
        this.updateRfqItem();
        this.dialogRef.close(
            {
                updated: this.updateSuccess
            }
        )

    }

    updateRfqItem() {

        const request: any = {
            rfqItemId: this.rfqItem.id,
            itemId: this.rfqItemForm.get('itemId').value,
            status: this.rfqItemForm.get('status').value,
            quantity: this.rfqItemForm.get('quantity').value,
            priceQuoted: this.rfqItemForm.get('priceQuoted').value
        };

        if (this.rfqItemForm.get('expectedArrivalDate').value !== "") {
            request.expectedArrivalDate = this.rfqItemForm.get('expectedArrivalDate').value;
        }

        if (this.rfqItemForm.get('supplierId').value !== "") {
            request.supplierId = this.rfqItemForm.get('supplierId').value;
        }

        this.rfqService.updateRfqItem(request, this.rfqItem.id)
            .pipe(takeUntil(this.endsubs$))
            .subscribe(
                (rfq: RfqModule) => {
                    this.updateSuccess = true;
                },
                () => {
                    this.updateSuccess = false;
                }
            );
    }

    private _initForm() {
        this.itemForm.itemId.setValue(this.rfqItem.item.id);
        this.itemForm.quantity.setValue(this.rfqItem.quantity);
        this.itemForm.priceQuoted.setValue(this.rfqItem.priceQuoted);
        this.itemForm.status.setValue(this.rfqItem.status);
        this.itemForm.supplierId.setValue(this.rfqItem.supplier.id);
        this.itemForm.expectedArrivalDate.setValue(this.rfqItem.expectedArrivalDate);
    }

    private _getItems() {
        this.itemService
            .getItems()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((items) => {
                this.items = items;
                this.isLoading = false;
            });
    }

    private _getRfqItem() {
        this.rfqService
            .getRfqItem(this.data.id)
            .pipe(takeUntil(this.endsubs$))
            .subscribe((rfqItem) => {
                this.rfqItem = rfqItem;
                this._initForm();
                this.isLoading = false;
            });
    }

    private _getSuppliers() {
        this.supplierService
            .getSuppliers()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((suppliers) => {
                this.suppliers = suppliers;
                this.isLoading = false;
            });
    }


}
