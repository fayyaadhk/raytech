import {Component, Inject, OnInit} from '@angular/core';
import {Supplier} from "../../api/models/supplier";
import {map, Observable, startWith, Subject, takeUntil} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SupplierService} from "../../suppliers/suppliers.service";
import {ItemService} from "../item.service";
import {UpdateItemSupplierRequest} from "../../api/models/update-item-supplier-request";
import {ItemSupplier} from "../../api/models/item-supplier";

@Component({
    selector: 'app-edit-item-supplier',
    templateUrl: './edit-item-supplier.component.html',
    styleUrls: ['./edit-item-supplier.component.scss']
})
export class EditItemSupplierComponent implements OnInit {

    incomingItemSupplier: any;
    itemSupplier: ItemSupplier;

    suppliers: Supplier[];
    endsubs$: Subject<any> = new Subject();

    itemSupplierForm: FormGroup;

    updateSuccess: boolean = false;
    isLoading: boolean = true;

    filteredItems: Observable<any[]>;
    formFieldHelpers: string[] = [''];

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private dialogRef: MatDialogRef<EditItemSupplierComponent>,
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
        this.incomingItemSupplier = this.data;

        this.itemSupplierForm = this.formBuilder.group({
            price: ['', Validators.required],
            priceDate: ['']
        });

        this._getItemSupplier(this.incomingItemSupplier.itemSupplierId);

    }

    onSubmit() {
        this._updateItemSupplier();
        console.log(">>> updatesuccess", this.updateSuccess);
        this.dialogRef.close(
            {
                updated: this.updateSuccess
            }
        )

    }

    private _initForm() {
        this.isForm.price.setValue(this.itemSupplier.price);
        this.isForm.priceDate.setValue(this.itemSupplier.priceDate);
    }

    private _updateItemSupplier() {
        console.log(">>> this.data", this.data);

        const request: UpdateItemSupplierRequest = {
            priceDate: this.itemSupplierForm.get('priceDate').value,
            price: this.itemSupplierForm.get('price').value
        }

        this.itemService
            .updateItemSupplier(this.itemSupplier.id, request)
            .pipe(takeUntil(this.endsubs$))
            .subscribe((suppliers) => {
                this.isLoading = false;
            });
        this.updateSuccess = true;
    }

    private _getItemSupplier(id: number) {
        this.itemService
            .getItemSupplier(id)
            .pipe(takeUntil(this.endsubs$))
            .subscribe((itemSupplier) => {
                this.itemSupplier = itemSupplier;
                this._initForm();
                this.isLoading = false;
            });
    }

}
