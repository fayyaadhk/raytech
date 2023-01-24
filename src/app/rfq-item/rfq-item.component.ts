import {Component, Inject, OnInit} from '@angular/core';
import {Observable, Subject, takeUntil, startWith, map} from "rxjs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ItemService} from "../item/item.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ItemClass} from "../item/item.model";
import {RfqStatus} from "../data/rfq-status";
import {RFQItemStatus} from "../data/rfq-item-status";
import {SupplierService} from "../suppliers/suppliers.service";
import {Item} from "../api/models/item";

@Component({
    selector: 'app-rfq-item',
    templateUrl: './rfq-item.component.html',
    styleUrls: ['./rfq-item.component.scss']
})
export class RfqItemComponent implements OnInit {
    items: any = [];
    suppliers: any = [];
    supplier: any = [];
    itemId: string;
    itemName: string;
    supplierId: string;
    supplierName: string;
    expectedArrivalDate;
    filteredRfqItems: any = [];
    rfqItemForm: FormGroup;
    isSubmitted = false;
    endsubs$: Subject<any> = new Subject();
    addSuccess = false;
    updateSuccess = false;
    currentItemId: string;
    editmode = false;
    isLoading: any;
    currentRfqItemId;
    public itemFilter: FormControl = new FormControl();
    keys = Object.keys;
    rfqItemStatus = RFQItemStatus;
    formFieldHelpers: string[] = [''];
    filteredItems: Observable<any[]>;

    ngOnInit() {
        this._initForm();
        this._getItems();
        this._getSuppliers();
        this._checkEditMode();
    }

    constructor(private formBuilder: FormBuilder,
                private itemService: ItemService,
                private supplierService: SupplierService,
                private dialogRef: MatDialogRef<RfqItemComponent>,
                @Inject(MAT_DIALOG_DATA) public data) {
    }


    filterRfqItems(event): void {
        // Get the value
        const value = event.target.value.toLowerCase();

        // Filter the tags
        this.filteredRfqItems = this.items.filter(rfqItem => rfqItem.item.name.toLowerCase().includes(value));
    }

    private _initForm() {
        this.rfqItemForm = this.formBuilder.group({
            itemId: ['', Validators.required],
            supplierId: [''],
            name: [''],
            quantity: [null],
            priceQuoted: [null],
            expectedArrivalDate: [''],
            itemStatus: [''],
        });
    }

    private _filter(value: string): any[] {
        const filterValue = value.toString().toLowerCase();

        return this.items.filter(option => option.name.toLowerCase().includes(filterValue) || option.sku.toLowerCase().includes(filterValue));
    }

    selectedItem(event) {
        console.log(event.option.value);
    }

    displayItem(itemId: any) {
        // return item ? item.name : '';
        return this.items?.find(item => item.id === itemId)?.name;
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
                this.supplierName = this.suppliers.name;
                this.isLoading = false;
            });
    }

    private _getSupplier(id: string) {
        this.supplierService
            .getSupplier(id)
            .pipe(takeUntil(this.endsubs$))
            .subscribe((supplier) => {
                this.supplier = supplier;
                this.isLoading = false;
            });
    }

    onSubmit() {
        this.itemId = this.rfqItemForm.get('itemId').value;
        if (this.rfqItemForm.get('expectedArrivalDate').value !== "") {
            this.expectedArrivalDate = this.rfqItemForm.get('expectedArrivalDate').value;
        } else {
            this.expectedArrivalDate = null;
        }
        if (this.rfqItemForm.get('supplierId').value !== "") {
            this.supplierId = this.rfqItemForm.get('supplierId').value;
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
                            rfqItemId: this.data.rfqItemId,
                            itemId: this.rfqItemForm.get('itemId').value,
                            supplierId: this.supplierId,
                            name: this.itemName,
                            supplierName: this.supplier.name,
                            quantity: this.rfqItemForm.get('quantity').value,
                            priceQuoted: this.rfqItemForm.get('priceQuoted').value,
                            expectedArrivalDate: this.rfqItemForm.get('expectedArrivalDate').value,
                            status: this.rfqItemForm.get('itemStatus').value
                        }
                    )
                } else {
                    console.log('INTO ADD');
                    console.log('Supplier Id', this.supplierId);
                    console.log('priceQuoted', this.rfqItemForm.get('priceQuoted').value);
                    console.log('expectedArrivalDate', this.rfqItemForm.get('expectedArrivalDate').value);

                    this.dialogRef.close(
                        {
                            editMode: this.editmode,
                            newItem: true,
                            rfqItemId: this.data.rfqItemId,
                            itemId: this.rfqItemForm.get('itemId').value,
                            supplierId: this.supplierId,
                            name: this.itemName,
                            supplierName: this.supplier.name,
                            quantity: this.rfqItemForm.get('quantity').value,
                            priceQuoted: this.rfqItemForm.get('priceQuoted').value,
                            expectedArrivalDate: this.rfqItemForm.get('expectedArrivalDate').value,
                            status: this.rfqItemForm.get('itemStatus').value
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
            this.currentRfqItemId = this.data.itemId;
            this.itemService.getItem(this.currentRfqItemId)
                .pipe(takeUntil(this.endsubs$))
                .subscribe((item) => {
                    this.isLoading = false;
                    this.itemForm.itemId.setValue(this.data.itemId);
                    this.itemForm.supplierId.setValue(this.data.supplierId);
                    this.itemForm.quantity.setValue(this.data.quantity);
                    this.itemForm.priceQuoted.setValue(this.data.priceQuoted);
                    this.itemForm.expectedArrivalDate.setValue(this.data.expectedArrivalDate);
                    this.itemForm.itemStatus.setValue(this.data.status);
                    //this.itemForm.name.setValue(item.name);
                });
        }
    }

    get itemForm() {
        return this.rfqItemForm.controls;
    }
}
