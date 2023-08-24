import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, Subject, takeUntil, startWith, map} from "rxjs";
import {CategoryService} from "../../category/category.service";
import {FuseConfirmationService} from "../../../@fuse/services/confirmation";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {ItemService} from "../item.service";
import {ItemClass} from '../item.model';
import {BrandService} from "../../brand/brand.service";
import {MatDialog} from "@angular/material/dialog";
import {AddItemBrandComponent} from "./add-item-brand/add-item-brand.component";
import {AddItemCategoryComponent} from "./add-item-category/add-item-category.component";

@Component({
    selector: 'app-add-item',
    templateUrl: './add-item.component.html',
    styles: [
        /* language=SCSS */`
            .inventory-grid {
                grid-template-columns: 48px auto 40px;

                @screen sm {
                    grid-template-columns: 48px auto 112px 72px;
                }

                @screen md {
                    grid-template-columns: 48px 112px auto 112px 72px;
                }

                @screen lg {
                    grid-template-columns: 48px 112px auto 112px 96px 96px 72px;
                }
            }
        `
    ],
})
export class AddItemComponent {
    editmode = false;
    form: FormGroup;
    isSubmitted = false;
    endsubs$: Subject<any> = new Subject();
    addSuccess = false;
    updateSuccess = false;
    currentItemId: string;
    imageDisplay: string | ArrayBuffer;
    isLoading: boolean = false;
    item: [] = null;
    categories: any = null;
    brands: any = null;
    filteredCategories: Observable<any[]>;

    constructor(private itemService: ItemService,
                private brandService: BrandService,
                private formBuilder: FormBuilder,
                private _fuseConfirmationService: FuseConfirmationService,
                private location: Location,
                private route: ActivatedRoute,
                private dialog: MatDialog,
                private router: Router,
                private categoryService: CategoryService) {
    }

    private _filter(value: string): any[] {
        const filterValue = value.toString().toLowerCase();
        return this.categories.filter(option => option.name.toLowerCase().includes(filterValue));
    }
    selectedCategory(event) {
        console.log(event.option.value);
    }
    displayCategory(categoryId: any) {
        // return item ? item.name : '';
        return this.categories?.find(category => category.id === categoryId)?.name;
    }

    ngOnInit() {
        this._initForm();
        this._checkEditMode();
        this.isLoading = true;
        this._getCategories();
        this._getBrands();
    }

    ngOnDestroy() {
        //this.endsubs$.next(null);
        this.endsubs$.complete();
    }

    private _initForm() {
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            description: [''],
            shortDescription: [''],
            sku: [''],
            rrsp: [null],
            thumbnail: [''],
            category: [null],
            brand: [null],
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
                this.itemForm.category.setValue(res.categoryId);
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
                this.itemForm.brand.setValue(res.brandId);
            }
        });
    }

    private _getCategories() {
        this.categoryService
            .getCategories()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((categories) => {
                this.categories = categories;
                this.filteredCategories = this.itemForm.category.valueChanges.pipe(
                    startWith(''),
                    map(value => this._filter(value || '')),
                );
                this.isLoading = false;
            });
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

    onSubmit() {
        this.isSubmitted = true;
        this.isLoading = true;

        if (this.form.invalid) {
            return;
        }
        const updateClient: ItemClass = new ItemClass();
        updateClient.name = this.form.get('name').value;
        updateClient.shortDescription = this.form.get('shortDescription').value;
        updateClient.description = this.form.get('description').value;
        updateClient.sku = this.form.get('sku').value;
        updateClient.rrsp = this.form.get('rrsp').value;
        updateClient.thumbnail = this.form.get('thumbnail').value;
        updateClient.categoryId = this.form.get('category').value;
        updateClient.brandId = this.form.get('brand').value;
        if (this.editmode) {
            this._updateItem(updateClient);
            this.isLoading = false;
            // this.location.back();
        } else {
            this._addItem();
            this.router.navigateByUrl('items');
            this.isLoading = false;
        }
    }

    onCancle() {
        this.location.back();
    }

    onImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            this.form.patchValue({image: file});
            this.form.get('image').updateValueAndValidity();
            const fileReader = new FileReader();
            fileReader.onload = () => {
                this.imageDisplay = fileReader.result;
            };
            fileReader.readAsDataURL(file);
        }
    }

    private _addItem() {
        console.log('>>> GOT INTO ADD');
        const newItem: ItemClass = new ItemClass();
        console.log('>>> initialised ');
        newItem.name = this.form.get('name').value;
        console.log('>>> get value name from controller', this.form.get('name').value);
        newItem.shortDescription = this.form.get(['shortDescription']).value;
        console.log('>>> get value short description from controller', this.form.get(['shortDescription']).value);
        newItem.description = this.form.get(['description']).value;
        console.log('>>> get value description from controller', this.form.get(['description']).value);
        newItem.sku = this.form.get(['sku']).value;
        console.log('>>> get value sku from controller', this.form.get(['sku']).value);
        newItem.rrsp = this.form.get(['rrsp']).value;
        console.log('>>> get value rrsp from controller', this.form.get(['rrsp']).value);
        newItem.thumbnail = this.form.get(['thumbnail']).value;
        console.log('>>> get value thumbnail from controller', this.form.get(['thumbnail']).value);
        newItem.categoryId = this.form.get(['category']).value;
        console.log('>>> get value category from controller', this.form.get(['category']).value);
        newItem.brandId = this.form.get(['brand']).value;
        console.log('>>> get value brand from controller', this.form.get(['brand']).value);
        console.log('>>> get values from controller', newItem);
        this.itemService
            .addItem(newItem)
            .pipe(takeUntil(this.endsubs$))
            .subscribe(
                (client) => {
                    this.addSuccess = true;
                    console.log(client);
                    this.form.reset();
                },
                (error) => {
                    this.addSuccess = false;
                    console.log(error);
                }
            );
    }

    private _updateItem(itemData: ItemClass) {
        this.itemService
            .updateItem(itemData, this.currentItemId)
            .pipe(takeUntil(this.endsubs$))
            .subscribe(
                (category) => {
                    this.updateSuccess = true;
                },
                () => {
                    this.updateSuccess = false;
                }
            );
    }

    private _checkEditMode() {
        console.log("HERE");
        this.route.params.pipe(takeUntil(this.endsubs$)).subscribe((params) => {
            if (params.id) {
                this.editmode = true;
                this.currentItemId = params.id;
                this.itemService
                    .getItem(params.id)
                    .pipe(takeUntil(this.endsubs$))
                    .subscribe((item) => {
                        this.itemForm.name.setValue(item.name);
                        this.itemForm.description.setValue(item.description);
                        this.itemForm.shortDescription.setValue(item.shortDescription);
                        this.itemForm.sku.setValue(item.sku);
                        this.itemForm.rrsp.setValue(item.rrsp);
                        this.itemForm.thumbnail.setValue(item.thumbnail);
                        this.itemForm.category.setValue(item.categoryId);
                        this.itemForm.brand.setValue(item.brandId);

                        // this.clientForm.buyer.setValue(client.buyer);
                        console.log('HERE1', this.item);
                    });
            }
        });
    }

    get itemForm() {
        return this.form.controls;
    }
}
