import {Component, Inject, OnInit} from '@angular/core';
import {Observable, Subject, takeUntil, startWith, map, distinctUntilChanged, filter, debounceTime} from "rxjs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ItemService} from "../item/item.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {RFQItemStatus} from "../data/rfq-item-status";
import {SupplierService} from "../suppliers/suppliers.service";
import {DetailedItem} from "../api/models/detailed-item";
import {Supplier} from "../api/models/supplier";

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
    isLoading: boolean = true;
    itemLoading: boolean = true;
    currentRfqItemId;
    public itemFilter: FormControl = new FormControl();
    keys = Object.keys;
    rfqItemStatus = RFQItemStatus;
    formFieldHelpers: string[] = [''];
    filteredItems: Array<any> = [];

    selectedItem: DetailedItem = null;

    constructor(private formBuilder: FormBuilder,
                private itemService: ItemService,
                private supplierService: SupplierService,
                private dialogRef: MatDialogRef<RfqItemComponent>,
                @Inject(MAT_DIALOG_DATA) public data) {
    }

    get itemForm() {
        return this.rfqItemForm.controls;
    }

    ngOnInit() {
        this._initForm();
        this._getItems();
        this._getSuppliers();
        this._checkEditMode();
        this.isLoading = false;
    }

    filterRfqItems(event): void {
        // Get the value
        const value = event.target.value.toLowerCase();

        // Filter the tags
        this.filteredRfqItems = this.items.filter(rfqItem => rfqItem.item.name.toLowerCase().includes(value));
    }

    getSelectedItem(event) {
        this.itemLoading = true
        this.itemService
            .getItemWithAllDetails(this.rfqItemForm.get('itemId').value)
            .pipe(takeUntil(this.endsubs$))
            .subscribe((item) => {
                this.selectedItem = item;
                console.log(">>> this.selectedItem", this.selectedItem);
                let itemSuppliers: Supplier[] = [];
                if (this.selectedItem && this.selectedItem.itemSuppliers) {
                    this.selectedItem.itemSuppliers.forEach(supplier =>
                        itemSuppliers.push(supplier.supplier)
                    );
                }
                this.suppliers = itemSuppliers;

                this.itemLoading = false;
            });
    }

    displayItem(itemId: any) {
        return this.items?.find(item => item.id === itemId)?.name;
    }

    onSearchChange(searchValue: string): void {
        this.selectedItem = null;
        this.filteredItems = null;
        this.isLoading = true;
        if (searchValue) {
            this.itemService
                .getItemSearch(searchValue)
                .pipe(takeUntil(this.endsubs$),
                    filter(_ => searchValue.length >= 3),
                    debounceTime(500),
                    distinctUntilChanged())
                .subscribe((items) => {
                    this.filteredItems = items;
                });
        }
    }

    getSupplierName(id: string) {
        if (id) {
            return this.suppliers.find(x => x.id == id).name;
        } else {
            return null;
        }
    }

    onSubmit() {
        this.itemId = this.rfqItemForm.get('itemId').value;
        if (this.rfqItemForm.get('expectedArrivalDate').value !== "") {
            this.expectedArrivalDate = this.rfqItemForm.get('expectedArrivalDate').value;
        } else {
            this.expectedArrivalDate = null;
        }
        if (this.rfqItemForm.get('supplierId').value !== "" && this.rfqItemForm.get('supplierId').value) {
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
                            supplierName: this.getSupplierName(this.supplierId),
                            quantity: this.rfqItemForm.get('quantity').value,
                            priceQuoted: this.rfqItemForm.get('priceQuoted').value,
                            expectedArrivalDate: this.rfqItemForm.get('expectedArrivalDate').value,
                            status: this.rfqItemForm.get('itemStatus').value
                        }
                    )
                } else {

                    if (this.supplierId) {
                        this.dialogRef.close(
                            {
                                editMode: this.editmode,
                                newItem: true,
                                rfqItemId: this.data.rfqItemId,
                                itemId: this.rfqItemForm.get('itemId').value,
                                supplierId: this.supplierId,
                                name: this.itemName,
                                supplierName: this.getSupplierName(this.supplierId),
                                quantity: this.rfqItemForm.get('quantity').value,
                                priceQuoted: this.rfqItemForm.get('priceQuoted').value,
                                expectedArrivalDate: this.rfqItemForm.get('expectedArrivalDate').value,
                                status: this.rfqItemForm.get('itemStatus').value
                            }
                        )
                    } else {
                        this.dialogRef.close(
                            {
                                editMode: this.editmode,
                                newItem: true,
                                rfqItemId: this.data.rfqItemId,
                                itemId: this.rfqItemForm.get('itemId').value,
                                name: this.itemName,
                                quantity: this.rfqItemForm.get('quantity').value,
                                priceQuoted: this.rfqItemForm.get('priceQuoted').value,
                                expectedArrivalDate: this.rfqItemForm.get('expectedArrivalDate').value,
                                status: this.rfqItemForm.get('itemStatus').value
                            }
                        )
                    }
                }
            });
        this.addSuccess = true;
    }

    private _initForm() {
        this.isLoading = true;
        this.rfqItemForm = this.formBuilder.group({
            itemId: [null, Validators.required],
            supplierId: [null],
            name: [''],
            quantity: [null],
            priceQuoted: [null],
            expectedArrivalDate: [null],
            itemStatus: [''],
        });
    }

    private _filter(value: string): any[] {
        const filterValue = value.toString().toLowerCase();

        return this.items.filter(option => option.name.toLowerCase().includes(filterValue) || option.sku.toLowerCase().includes(filterValue));
    }

    private _getItems() {
        this.itemLoading = true
        this.itemService
            .getItems()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((items) => {
                this.items = items;
                this.itemLoading = false;
            });
    }

    private _getSuppliers() {
        this.isLoading = true;
        this.supplierService
            .getSuppliers()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((suppliers) => {
                this.suppliers = suppliers;
            });
    }

    private _getSupplier(id: string) {
        this.isLoading = true;
        this.supplierService
            .getSupplier(id)
            .pipe(takeUntil(this.endsubs$))
            .subscribe((supplier) => {
                this.supplier = supplier;
                this.supplierName = this.suppliers.name;
                this.isLoading = false;
            });
    }

    private _checkEditMode() {
        if (this.data.itemId) {
            this.isLoading = true;
            this.editmode = true;
            this.currentRfqItemId = this.data.itemId;
            if (this.itemLoading) {
                this.itemService.getItem(this.currentRfqItemId)
                    .pipe(takeUntil(this.endsubs$))
                    .subscribe((item) => {
                        this.itemForm.itemId.setValue(this.data.itemId);
                        this.itemForm.supplierId.setValue(this.data.supplierId);
                        this.itemForm.quantity.setValue(this.data.quantity);
                        this.itemForm.priceQuoted.setValue(this.data.priceQuoted);
                        this.itemForm.expectedArrivalDate.setValue(this.data.expectedArrivalDate);
                        this.itemForm.itemStatus.setValue(this.data.status);
                        this.isLoading = false;
                    });
            }
        }
    }
}
