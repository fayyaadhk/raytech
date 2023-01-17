import {Component, Inject, OnInit} from '@angular/core';
import {RfqItem} from "../../api/models/rfq-item";
import {Item} from "../../api/models/item";
import {Supplier} from "../../api/models/supplier";
import {Subject, takeUntil} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ItemService} from "../../item/item.service";
import {RfqItemService} from "../../rfq-item/rfq-item.service";
import {SupplierService} from "../../suppliers/suppliers.service";
import {RfqModule} from "../../rfq/rfq.module";
import {PurchaseOrderItem} from "../../api/models/purchase-order-item";
import {PurchaseOrderItemService} from "../purchase-orders-item/purchase-order-item.service";
import {POItemStatus} from "../../data/purchase-order-item-status";

@Component({
  selector: 'app-edit-purchase-order-item',
  templateUrl: './edit-purchase-order-item.component.html',
  styleUrls: ['./edit-purchase-order-item.component.scss']
})
export class EditPurchaseOrderItemComponent implements OnInit {

    poItem: PurchaseOrderItem;

    items: Item[];
    suppliers: Supplier[];
    endsubs$: Subject<any> = new Subject();

    poItemForm: FormGroup;

    addSuccess: boolean = false;
    isLoading: boolean = true;
    updateSuccess: boolean = true;
    keys = Object.keys;
    poItemStatus = POItemStatus;

    constructor(@Inject(MAT_DIALOG_DATA) public data: RfqItem,
                private dialogRef: MatDialogRef<EditPurchaseOrderItemComponent>,
                private itemService: ItemService,
                private poItemService: PurchaseOrderItemService,
                private supplierService: SupplierService,
                private formBuilder: FormBuilder) {
    }

    get itemForm() {
        return this.poItemForm.controls;
    }

    ngOnInit(): void {

        this.poItemForm = this.formBuilder.group({
            itemId: ['', Validators.required],
            name: [''],
            quantity: [null],
            priceQuoted: [null, Validators.required],
            status: [''],
            expectedArrivalDate: [''],
            supplierId: ['', Validators.required]
        });

        this._getItems();
        this._getRfqItem();
        this._getSuppliers();
    }

    onSubmit() {
        this.updatePOItem();
        this.dialogRef.close(
            {
                updated: this.updateSuccess
            }
        )

    }

    updatePOItem() {

        const request: any = {
            rfqItemId: this.poItem.id,
            itemId: this.poItemForm.get('itemId').value,
            status: this.poItemForm.get('status').value,
            quantity: this.poItemForm.get('quantity').value,
            priceQuoted: this.poItemForm.get('priceQuoted').value
        };

        if (this.poItemForm.get('expectedArrivalDate').value !== "") {
            request.expectedArrivalDate = this.poItemForm.get('expectedArrivalDate').value;
        }

        if (this.poItemForm.get('supplierId').value !== "") {
            request.supplierId = this.poItemForm.get('supplierId').value;
        }

        this.poItemService.updatePurchaseOrderItem(request, this.poItem.id)
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
        this.itemForm.itemId.setValue(this.poItem.item.id);
        this.itemForm.quantity.setValue(this.poItem.quantity);
        this.itemForm.priceQuoted.setValue(this.poItem.priceQuoted);
        this.itemForm.status.setValue(this.poItem.status);
        this.itemForm.supplierId.setValue(this.poItem.supplier.id);
        this.itemForm.expectedArrivalDate.setValue(this.poItem.expectedArrivalDate);
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
        this.poItemService
            .getPurchaseOrderItem(this.data.id)
            .pipe(takeUntil(this.endsubs$))
            .subscribe((rfqItem) => {
                this.poItem = rfqItem;
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
