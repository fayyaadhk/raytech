import {Component, Inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";
import {ItemService} from "../../item/item.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SupplierService} from "../../suppliers/suppliers.service";
import {POItemStatus} from "../../data/purchase-order-item-status";
import {POStatus} from "../../data/purchase-order-status";

@Component({
  selector: 'app-purchase-orders-item',
  templateUrl: './purchase-orders-item.component.html',
  styleUrls: ['./purchase-orders-item.component.scss']
})
export class PurchaseOrdersItemComponent {
    items: any = [];
    suppliers: any = [];
    itemId: string;
    itemName: string;
    filteredRfqItems: any = [];
    form: FormGroup;
    isSubmitted = false;
    endsubs$: Subject<any> = new Subject();
    addSuccess = false;
    updateSuccess = false;
    currentItemId: string;
    editmode = false;
    isLoading: any;
    currentPurchaseOrderItemId;
    // status: POItemStatus;
    keys = Object.keys;
    poItemStatus = POItemStatus;
    public itemFilter: FormControl = new FormControl();

    ngOnInit() {
        this._initForm();
        this._getItems();
        this._getSuppliers();
        this._checkEditMode();
    }

    constructor(private formBuilder: FormBuilder,
                private itemService: ItemService,
                private supplierService: SupplierService,
                private dialogRef: MatDialogRef<PurchaseOrdersItemComponent>,
                @Inject(MAT_DIALOG_DATA) public data) {
    }

    filterRfqItems(event): void {
        // Get the value
        const value = event.target.value.toLowerCase();

        // Filter the tags
        this.filteredRfqItems = this.items.filter(rfqItem => rfqItem.item.name.toLowerCase().includes(value));
    }

    private _initForm() {
        this.form = this.formBuilder.group({
            itemId: ['', Validators.required],
            name: [''],
            supplier: [null],
            quantity: [null],
            price: [null],
            itemStatus: [''],
        });
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

    private _getSuppliers() {
        this.supplierService
            .getSuppliers()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((suppliers) => {
                this.suppliers = suppliers;
                this.isLoading = false;
            });
    }

    onSubmit() {
        if(this.editmode) {

        }
        else{

        }
        this.itemId = this.form.get('itemId').value;
        this.itemService.getItem(this.itemId)
            .pipe(takeUntil(this.endsubs$))
            .subscribe((item) => {
                this.itemName = item.name;
                this.isLoading = false;
                if(this.editmode){
                    this.dialogRef.close(
                        {
                            editMode: this.editmode,
                            rfqItemId: this.data.rfqItemId,
                            itemId: this.form.get('itemId').value,
                            supplierId: this.form.get('supplier').value,
                            name: this.itemName,
                            quantity: this.form.get('quantity').value,
                            priceQuoted: this.form.get('price').value,
                            status: this.form.get('itemStatus').value
                        }
                    )
                }
                else{
                    this.dialogRef.close(
                        {
                            editMode: this.editmode,
                            newItem: true,
                            rfqItemId: this.data.rfqItemId,
                            itemId: this.form.get('itemId').value,
                            supplierId: this.form.get('supplier').value,
                            name: this.itemName,
                            quantity: this.form.get('quantity').value,
                            priceQuoted: this.form.get('price').value,
                            status: this.form.get('itemStatus').value
                        }
                    )
                }

            });
        this.addSuccess = true;
    }

    private _checkEditMode() {
        console.log(">>> HERE ", this.data);
        if (this.data.itemId) {
            this.editmode = true;
            this.currentPurchaseOrderItemId = this.data.itemId;
            this.itemService.getItem(this.currentPurchaseOrderItemId)
                .pipe(takeUntil(this.endsubs$))
                .subscribe((item) => {
                    this.isLoading = false;
                    this.itemForm.itemId.setValue(this.data.itemId);
                    this.itemForm.quantity.setValue(this.data.quantity);
                    this.itemForm.price.setValue(this.data.price);
                    this.itemForm.itemStatus.setValue(this.data.status);
                    this.itemForm.supplier.setValue(this.data.supplierId);
                    //this.itemForm.name.setValue(item.name);
                });
        }
    }

    get itemForm() {
        return this.form.controls;
    }
}
