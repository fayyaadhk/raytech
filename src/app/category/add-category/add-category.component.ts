import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {CategoryService} from '../category.service';
import {FuseConfirmationService} from '../../../@fuse/services/confirmation';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {Category} from '../../api/models/category';
import {CommodityService} from "../../commodity/commodity.service";
import {Commodity} from "../../commodity/commodity.model";
import {MatDialogRef} from "@angular/material/dialog";

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
                private route: ActivatedRoute,
                private router: Router) {
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
            commodityId: ['', Validators.required]
        });
    }

    onSubmit() {
        this.isSubmitted = true;
        this.isLoading = true;

        if (this.form.invalid) {return;}
        const updateCategory: Category = new Category();
        updateCategory.name = this.form.get('name').value;
        updateCategory.commodityId = this.form.get('commodityId').value;
        if (this.editmode) {
            this._updateCategory(updateCategory);
            this.isLoading = false;
            this.location.back();
        } else {
            this._addCategory();
            this.isLoading = false;
            // this.router.navigateByUrl('categories');
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
                (commodities) => {
                    this.commodities = commodities;
                },
                (error) => {
                    console.log(error);
                }
            );
    }

    private _addCategory() {
        console.log('>>> GOT INTO ADD');
        const categoryForm: Category = {
            name: this.form.get('name').value,
            commodityId: this.form.get('commodityId').value
        };
            this.categoryService
                .createCategory(categoryForm)
                .pipe(takeUntil(this.endsubs$))
                .subscribe(
                    (category) => {
                        this.addSuccess = true;
                        this.form.reset();
                    },
                    (error) => {
                        console.log(error)
                        this.addSuccess = false;
                    }
                );
    }

    private _updateCategory(categoryData: Category) {
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
                        this.categoryForm.commodityId.setValue(category.commodityId);
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
