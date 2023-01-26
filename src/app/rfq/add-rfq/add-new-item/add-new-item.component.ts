import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ItemClass} from "../../../item/item.model";
import {Subject, takeUntil} from "rxjs";
import {ItemService} from "../../../item/item.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {CategoryService} from "../../../category/category.service";
import {BrandService} from "../../../brand/brand.service";
import {RfqStatus} from "../../../data/rfq-status";
import {SupplierService} from "../../../suppliers/suppliers.service";
import {RFQItemStatus} from "../../../data/rfq-item-status";
import {Item} from "../../../api/models/item";
import {AddItemCategoryComponent} from "../../../item/add-item/add-item-category/add-item-category.component";
import {AddItemBrandComponent} from "../../../item/add-item/add-item-brand/add-item-brand.component";

@Component({
    selector: 'app-add-new-item',
    templateUrl: './add-new-item.component.html',
    styleUrls: ['./add-new-item.component.scss']
})
export class AddNewItemComponent implements OnInit {

    addNewItemForm: FormGroup;
    newItemForm: FormGroup;

    categories: any = [];
    brands: any = [];

    suppliers: any = [];

    isLoading: boolean = false;
    endsubs$: Subject<any> = new Subject();
    addSuccess = false;

    formFieldHelpers: string[] = [''];

    keys = Object.keys;
    rfqItemStatus = RFQItemStatus;

    item: ItemClass;

    constructor(
        private formBuilder: FormBuilder,
        private itemService: ItemService,
        private categoryService: CategoryService,
        private brandService: BrandService,
        private supplierService: SupplierService,
        private dialogRef: MatDialogRef<AddNewItemComponent>,
        private dialog: MatDialog,
    ) {
    }

    ngOnInit(): void {
        this._initForm();
        this._getCategories();
        this._getBrands();
        this._getSuppliers();

    }

    createNewItem() {
        const newItem: ItemClass = new ItemClass();
        newItem.name = this.newItemForm.get('step1.name').value;
        newItem.shortDescription = this.newItemForm.get('step1.shortDescription').value;
        newItem.description = this.newItemForm.get('step1.description').value;
        newItem.sku = this.newItemForm.get('step1.sku').value;
        newItem.rrsp = this.newItemForm.get('step1.rrsp').value;
        newItem.thumbnail = this.newItemForm.get('step1.thumbnail').value;
        newItem.categoryId = this.newItemForm.get('step1.category').value;
        newItem.brandId = this.newItemForm.get('step1.brand').value;

        this.itemService
            .addItem(newItem)
            .pipe(takeUntil(this.endsubs$))
            .subscribe(
                (item) => {
                    this.item = item;
                    console.log(">>> Created item - Stored in this.item", this.item);
                    this.addSuccess = true;
                    this.newItemForm.reset();
                },
                (error) => {
                    this.addSuccess = false;
                    console.log(error);
                }
            );
    }

    addItemToRfq() {
        let sId = this.newItemForm.get('step2.supplierId').value;

        this.dialogRef.close(
            {
                itemId: this.item.id,
                supplierId: sId,
                name: this.item.name,
                supplierName: this.getSupplierName(sId),
                quantity: this.newItemForm.get('step2.quantity').value,
                priceQuoted: this.newItemForm.get('step2.priceQuoted').value,
                expectedArrivalDate: this.newItemForm.get('step2.expectedArrivalDate').value,
                status: this.newItemForm.get('step2.status').value
            }
        )
    }

    getSupplierName(id: number) {
        console.log(">>> this.suppliers", this.suppliers);
        return this.suppliers?.find(x => x.id == id)?.name;
    }

    private _getBrands() {
        this.brandService
            .getBrands()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((brands) => {
                this.brands = brands;
                this.isLoading = false;
            });
    }

    private _getCategories() {
        this.categoryService
            .getCategories()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((categories) => {
                this.categories = categories;
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

    private _initForm() {
        // Vertical stepper form
        this.newItemForm = this.formBuilder.group({
            step1: this.formBuilder.group({
                name: [''],
                description: [''],
                shortDescription: [''],
                sku: [''],
                rrsp: [null],
                thumbnail: [null],
                category: [null],
                brand: [null],
            }),
            step2: this.formBuilder.group({
                quantity: [null],
                status: [''],
                supplierId: [null],
                expectedArrivalDate: [''],
                priceQuoted: [null],
            }),
        });
    }

    openDialogCategory() {
        const dialogRef = this.dialog.open(AddItemCategoryComponent, {
            width: '600px',
            data: {
                modalTitle: 'Add New Category',
            },
        });

        dialogRef.afterClosed().subscribe(res => {
            // received data from dialog-component
            if (res) {
                this._getCategories();
                this.newItemForm.get('step1.category').setValue(res.categoryId);
            }
        });
    }

    openDialogBrand() {
        const dialogRef = this.dialog.open(AddItemBrandComponent, {
            width: '600px',
            data: {modalTitle: 'Add New Brand'},
        });
        dialogRef.afterClosed().subscribe(res => {
            // received data from dialog-component
            if (res) {
                this._getBrands();
                this.newItemForm.get('step1.brand').setValue(res.brandId);
            }
        });
    }

    get itemForm() {
        return this.newItemForm.controls;
    }

}
