import {Component, Inject, OnInit} from '@angular/core';
import {Item} from "../../api/models/item";
import {Supplier} from "../../api/models/supplier";
import {map, Observable, startWith, Subject, takeUntil} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {POItemStatus} from "../../data/purchase-order-item-status";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {RfqItem} from "../../api/models/rfq-item";
import {ItemService} from "../../item/item.service";
import {PurchaseOrderItemService} from "../../purchase-orders/purchase-orders-item/purchase-order-item.service";
import {SupplierService} from "../suppliers.service";
import {RfqModule} from "../../rfq/rfq.module";

@Component({
  selector: 'app-add-supplier-item',
  templateUrl: './add-supplier-item.component.html',
  styleUrls: ['./add-supplier-item.component.scss']
})
export class AddSupplierItemComponent implements OnInit {
    items: Item[];
    endsubs$: Subject<any> = new Subject();

    form: FormGroup;

    addSuccess: boolean = false;
    isLoading: boolean = true;
    updateSuccess: boolean = true;
    keys = Object.keys;
    poItemStatus = POItemStatus;
    filteredItems: Observable<any[]>;
    formFieldHelpers: string[] = [''];

    constructor(@Inject(MAT_DIALOG_DATA) public data: RfqItem,
                private dialogRef: MatDialogRef<AddSupplierItemComponent>,
                private itemService: ItemService,
                private supplierService: SupplierService,
                private formBuilder: FormBuilder) {
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
        return this.items?.find(item => item.id === itemId)?.name;
    }

    get supplierForm() {
        return this.form.controls;
    }

    ngOnInit(): void {

        this.form = this.formBuilder.group({
            itemId: ['', Validators.required],
            price: [null, Validators.required],
            priceDate: [''],
            supplierId: ['', Validators.required]
        });

        this._getItems();
    }

    onSubmit() {
        this.createSupplierItem();
        this.dialogRef.close(
            {
                updated: this.updateSuccess
            }
        )

    }

    createSupplierItem() {

        const request: any = {
            supplierId: this.data.id,
            itemId: this.form.get('itemId').value,
            price: this.form.get('price').value,
            priceDate: this.form.get('priceDate').value
        };

        if (this.form.get('priceDate').value !== "") {
            request.priceDate = this.form.get('expectedArrivalDate').value;
        }

        if (this.form.get('supplierId').value !== "") {
            request.supplierId = this.form.get('supplierId').value;
        }

        this.supplierService.createItemSupplier(request)
            .pipe(takeUntil(this.endsubs$))
            .subscribe(
                (item) => {
                    this.updateSuccess = true;
                },
                () => {
                    this.updateSuccess = false;
                }
            );
    }

    private _getItems() {
        this.itemService
            .getItems()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((items) => {
                this.items = items;
                this.filteredItems = this.supplierForm.itemId.valueChanges.pipe(
                    startWith(''),
                    map(value => this._filter(value || '')),
                );
                this.isLoading = false;
            });
    }


}
