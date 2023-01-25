import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";
import {CategoryService} from "../../../category/category.service";
import {FuseConfirmationService} from "../../../../@fuse/services/confirmation";
import {CommodityService} from "../../../commodity/commodity.service";
import {MatDialogRef} from "@angular/material/dialog";
import {Category} from "../../../api/models/category";

@Component({
  selector: 'app-add-item-category',
  templateUrl: './add-item-category.component.html',
  styleUrls: ['./add-item-category.component.scss']
})
export class AddItemCategoryComponent implements OnInit {
    categoryForm: FormGroup;
    isSubmitted = false;
    endsubs$: Subject<any> = new Subject();
    addSuccess = false;
    updateSuccess = false;
    imageDisplay: string | ArrayBuffer;
    isLoading: boolean = false;
    category: any = null;
    commodities: any = [];

  constructor(private categoryService: CategoryService,
              private formBuilder: FormBuilder,
              private _fuseConfirmationService: FuseConfirmationService,
              private commodityService: CommodityService,
              private dialogRef: MatDialogRef<AddItemCategoryComponent>,) { }

  ngOnInit(): void {
      this._initForm();
      this._getCommodity();
  }

    ngOnDestroy() {
        this.endsubs$.complete();
    }

    onSubmit() {
        this.isSubmitted = true;
        this.isLoading = true;

        if (this.categoryForm.invalid) {return;}
            this._addCategory();
            this.isLoading = false;
            // this.router.navigateByUrl('categories');
    }

    private _initForm() {
        this.categoryForm = this.formBuilder.group({
            name: ['', Validators.required],
            commodityId: ['', Validators.required]
        });
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
        const categoryForm: Category = {
            name: this.categoryForm.get('name').value,
            commodityId: this.categoryForm.get('commodityId').value
        };
        this.categoryService
            .createCategory(categoryForm)
            .pipe(takeUntil(this.endsubs$))
            .subscribe(
                (category) => {
                    this.dialogRef.close({
                        categoryId: category.id
                    })
                    this.addSuccess = true;
                },
                (error) => {
                    console.log(error)
                    this.addSuccess = false;
                }
            );
    }

}
