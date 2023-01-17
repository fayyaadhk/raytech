import {Component, Inject, OnInit} from '@angular/core';
import {Supplier} from "../../api/models/supplier";
import {map, Observable, startWith, Subject, takeUntil} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {RfqItem} from "../../api/models/rfq-item";
import {SupplierService} from "../../suppliers/suppliers.service";
import {CreateItemSupplierRequest} from "../../api/models/create-item-supplier-request";
import {ItemService} from "../item.service";

@Component({
    selector: 'app-add-item-supplier',
    templateUrl: './add-item-supplier.component.html',
    styleUrls: ['./add-item-supplier.component.scss']
})
export class AddItemSupplierComponent implements OnInit {

    itemId: number;

    suppliers: Supplier[];
    endsubs$: Subject<any> = new Subject();

    itemSupplierForm: FormGroup;

    addSuccess: boolean = false;
    isLoading: boolean = true;

    filteredItems: Observable<any[]>;
    formFieldHelpers: string[] = [''];

    constructor(@Inject(MAT_DIALOG_DATA) public data: number,
                private dialogRef: MatDialogRef<AddItemSupplierComponent>,
                private supplierService: SupplierService,
                private itemService: ItemService,
                private formBuilder: FormBuilder
    ) {
    }

    get isForm() {
        return this.itemSupplierForm.controls;
    }

    ngOnInit(): void {
        console.log(">>> init this.data", this.data);
        this.itemId = this.data;
        this.itemSupplierForm = this.formBuilder.group({
            supplierId: ['', Validators.required],
            price: ['', Validators.required],
            priceDate: ['']
        });

        this._getSuppliers();
    }

    displayItem(itemId: any) {
        return this.suppliers?.find(item => item.id === itemId)?.name;
    }

    selectedItem(event) {
        console.log(event.option.value);
    }

    onSubmit() {
        this._addItemSupplier();
        console.log(">>> addsuccess", this.addSuccess);
        this.dialogRef.close(
            {
                added: this.addSuccess
            }
        )

    }

    private _filter(value: string): any[] {
        const filterValue = value.toString().toLowerCase();

        return this.suppliers.filter(option => option.name.toLowerCase().includes(filterValue));
    }

    private _getSuppliers() {
        this.supplierService
            .getSuppliers()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((suppliers) => {
                this.suppliers = suppliers;
                this.filteredItems = this.isForm.supplierId.valueChanges.pipe(
                    startWith(''),
                    map(value => this._filter(value || '')),
                );
                this.isLoading = false;
            });
    }

    private _addItemSupplier() {
        console.log(">>> this.data", this.data);
        const request: CreateItemSupplierRequest = {
            supplierId: this.itemSupplierForm.get('supplierId').value,
            itemId: this.itemId,
            priceDate: this.itemSupplierForm.get('priceDate').value,
            price: this.itemSupplierForm.get('price').value
        }

        this.itemService
            .addItemSupplier(request)
            .pipe(takeUntil(this.endsubs$))
            .subscribe((suppliers) => {
                this.isLoading = false;
            });
        this.addSuccess = true;


    }

}
