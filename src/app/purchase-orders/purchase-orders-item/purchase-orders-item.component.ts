import {Component, Inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {map, Observable, startWith, Subject, takeUntil} from "rxjs";
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
    supplier: any = [];
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
    expectedArrivalDate;
    supplierId;
    keys = Object.keys;
    poItemStatus = POItemStatus;
    public itemFilter: FormControl = new FormControl();
    filteredItems: Observable<any[]>;
    formFieldHelpers: string[] = [''];

    ngOnInit() {
        this._getItems();
        this._checkEditMode();
        this._initForm();
        this._getSuppliers();
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

    private _filter(value: string): any[] {
        const filterValue = value.toString().toLowerCase();

        return this.items.filter(option => option.name.toLowerCase().includes(filterValue));
    }

    selectedItem(event) {
        console.log(event.option.value);
    }

    displayItem(itemId: any) {
        // return item ? item.name : '';
        return this.items.find(item => item.id === itemId)?.name;
    }

    private _initForm() {
        this.form = this.formBuilder.group({
            itemId: ['', Validators.required],
            name: [''],
            supplier: [null],
            quantity: [null],
            price: [null],
            status: [''],
            expectedArrivalDate: [''],
        });
    }

    private _getItems() {
        this.itemService
            .getItems()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((items) => {
                this.items = items;
                this.filteredItems = this.itemForm.itemId.valueChanges.pipe(
                    startWith(''),
                    map(value => this._filter(value || '')),
                );
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

    private _getSupplier(id: string){
        this.supplierService
            .getSupplier(id)
            .pipe(takeUntil(this.endsubs$))
            .subscribe((supplier) => {
                this.supplier = supplier;
                this.isLoading = false;
            });
    }

    onSubmit() {
        this.itemId = this.form.get('itemId').value;
        if (this.form.get('expectedArrivalDate').value !== "") {
            this.expectedArrivalDate = this.form.get('expectedArrivalDate').value;
        } else {
            this.expectedArrivalDate = null;
        }
        if (this.form.get('supplier').value !== "") {
            this.supplierId = this.form.get('supplier').value;
            this._getSupplier(this.supplierId);
        } else {
            this.supplierId = null;
        }

        this.itemService.getItem(this.itemId)
            .pipe(takeUntil(this.endsubs$))
            .subscribe((item) => {
                this.itemName = item.name;
                this.isLoading = false;
                if (this.editmode) {
                    this.dialogRef.close(
                        {
                            editMode: this.editmode,
                            poItemId: this.data.poItemId,
                            itemId: this.form.get('itemId').value,
                            supplierId: this.supplierId,
                            supplierName: this.supplier.name,
                            name: this.itemName,
                            quantity: this.form.get('quantity').value,
                            priceQuoted: this.form.get('price').value,
                            expectedArrivalDate: this.expectedArrivalDate,
                            status: this.form.get('status').value
                        }
                    );
                } else {
                    this.dialogRef.close(
                        {
                            editMode: this.editmode,
                            newItem: true,
                            poItemId: this.data.poItemId,
                            itemId: this.form.get('itemId').value,
                            supplierId: this.supplierId,
                            supplierName: this.supplier.name,
                            name: this.itemName,
                            quantity: this.form.get('quantity').value,
                            priceQuoted: this.form.get('price').value,
                            expectedArrivalDate: this.expectedArrivalDate,
                            status: this.form.get('status').value
                        }
                    );
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
                    this.itemForm.itemId.setValue(this.data.itemId);
                    this.itemForm.quantity.setValue(this.data.quantity);
                    this.itemForm.price.setValue(this.data.price);
                    this.itemForm.expectedArrivalDate.setValue(this.data.expectedArrivalDate);
                    this.itemForm.supplier.setValue(this.data.supplierId);
                    this.itemForm.status.setValue(this.data.status);
                    this.isLoading = false;
                    //this.itemForm.name.setValue(item.name);
                });
        }
    }

    get itemForm() {
        return this.form.controls;
    }
}
