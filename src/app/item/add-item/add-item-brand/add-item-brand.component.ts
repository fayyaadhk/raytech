import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";
import {BrandService} from "../../../brand/brand.service";
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {MatDialogRef} from "@angular/material/dialog";
import {Brand} from "../../../api/models/brand";

@Component({
    selector: 'app-add-item-brand',
    templateUrl: './add-item-brand.component.html',
    styleUrls: ['./add-item-brand.component.scss']
})
export class AddItemBrandComponent implements OnInit {
    brandForm: FormGroup;
    isSubmitted = false;
    endsubs$: Subject<any> = new Subject();
    addSuccess = false;
    imageDisplay: string | ArrayBuffer;
    isLoading: boolean = false;
    logoPreview: string;
    brand: any = null;

    constructor(private brandService: BrandService,
                private formBuilder: FormBuilder,
                private dialogRef: MatDialogRef<AddItemBrandComponent>) {
    }

    ngOnInit() {
        this._initForm();
    }

    ngOnDestroy() {
        this.endsubs$.complete();
    }

    private _initForm() {
        this.brandForm = this.formBuilder.group({
            name: ['', Validators.required],
            logo: ['']
        });
    }

    onSubmit() {
        this.isSubmitted = true;
        this.isLoading = true;

        if (this.brandForm.invalid) {
            return;
        }
        const updateBrand: Brand = {
            name: this.brandForm.get('name').value,
            logo: this.brandForm.get('logo').value
        };
        this._addBrand();
        this.isLoading = false;
    }

    private _addBrand() {
        const brandForm: Brand = {
            name: this.brandForm.get('name').value,
            logo: this.brandForm.get('logo').value
        };
        this.brandService
            .createBrand(brandForm)
            .pipe(takeUntil(this.endsubs$))
            .subscribe(
                (brand) => {
                    this.dialogRef?.close({
                        brandId: brand.id
                    });
                    this.addSuccess = true;
                },
                (error) => {
                    console.log(error)
                    this.addSuccess = false;
                }
            );
    }
}
