import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {CategoryService} from '../category.service';
import {FuseConfirmationService} from '../../../@fuse/services/confirmation';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {Category} from '../../api/models/category';
import {CommodityService} from "../../commodity/commodity.service";

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
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
export class AddCategoryComponent {
    editmode = false;
    form: FormGroup;
    isSubmitted = false;
    endsubs$: Subject<any> = new Subject();
    addSuccess = false;
    updateSuccess = false;
    currentCategoryId: string;
    imageDisplay: string | ArrayBuffer;
    isLoading: boolean = false;
    category: any = null;
    commodities: any = [];

    constructor(private categoryService: CategoryService,
                private formBuilder: FormBuilder,
                private _fuseConfirmationService: FuseConfirmationService,
                private commodityService: CommodityService,
                private location: Location,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this._initForm();
        this._getCommodity();
        this._checkEditMode();
    }

    ngOnDestroy() {
        //this.endsubs$.next(null);
        this.endsubs$.complete();
    }

    private _initForm() {
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            commodity: ['', Validators.required]
        });
    }

    onSubmit() {
        this.isSubmitted = true;
        this.isLoading = true;

        if (this.form.invalid) {return;}
        const categoryFormData = new FormData();
        Object.keys(this.categoryForm).map((key) => {
            categoryFormData.append(key, this.categoryForm[key].value);
        });
        if (this.editmode) {
            this._updateCategory(categoryFormData);
            this.isLoading = false;
            // this.location.back();
        } else {
            this._addCategory(categoryFormData);
            this.isLoading = false;
            this.location.back();
        }
    }
    onCancle() {
        this.location.back();
    }

    _getCommodity(){
        this.commodityService
            .getCommodities()
            .pipe(takeUntil(this.endsubs$))
            .subscribe(
                (commodity) => {
                    this.addSuccess = true;
                    console.log(commodity);
                },
                () => {
                    this.addSuccess = false;
                }
            );
    }

    private _addCategory(categoryData: FormData) {
        console.log('>>> GOT INTO ADD');
        const categoryForm: Category = new Category();
        this.categoryForm.name = this.form.get(['name']).value;
        this.categoryForm.commodity = this.form.get(['commodity']).value;
            this.categoryService
                .createCategory(categoryForm)
                .pipe(takeUntil(this.endsubs$))
                .subscribe(
                    (client) => {
                        this.addSuccess = true;
                        console.log(client);
                        this.form.reset();
                    },
                    () => {
                        this.addSuccess = false;
                    }
                );
    }

    private _updateCategory(categoryData: FormData) {
        this.categoryService
            .updateCategory(categoryData, this.currentCategoryId)
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
                this.currentCategoryId = params.id;
                this.categoryService
                    .getCategory(params.id)
                    .pipe(takeUntil(this.endsubs$))
                    .subscribe((category) => {
                        this.category = category;
                        this.categoryForm.name.setValue(category.name);
                        // this.clientForm.buyer.setValue(client.buyer);
                        console.log('HERE1', this.category);
                    });
            }
        });
    }

    get categoryForm() {
        return this.form.controls;
    }

}
