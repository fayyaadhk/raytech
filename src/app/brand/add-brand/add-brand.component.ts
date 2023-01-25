import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {BrandService} from "../brand.service";
import {Brand} from "../../api/models/brand";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-add-brand',
  templateUrl: './add-brand.component.html',
  styleUrls: ['./add-brand.component.scss']
})
export class AddBrandComponent implements OnInit {
    editmode = false;
    form: FormGroup;
    isSubmitted = false;
    endsubs$: Subject<any> = new Subject();
    addSuccess = false;
    updateSuccess = false;
    currentBrandId: string;
    imageDisplay: string | ArrayBuffer;
    isLoading: boolean = false;
    logoPreview: string;
    brand: any = null;

    constructor(private brandService: BrandService,
                private formBuilder: FormBuilder,
                private location: Location,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this._initForm();
        this._checkEditMode();
    }

    ngOnDestroy() {
        //this.endsubs$.next(null);
        this.endsubs$.complete();
    }

    private _initForm() {
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            logo: ['']
        });
    }

    onSubmit() {
        this.isSubmitted = true;
        this.isLoading = true;

        if (this.form.invalid) {return;}
        const updateBrand: Brand = {
            name: this.form.get('name').value,
            logo: this.form.get('logo').value
        };
        if (this.editmode) {
            this._updateBrand(updateBrand);
            this.isLoading = false;
            this.router.navigateByUrl('brands');
        } else {
            this._addBrand();
            this.isLoading = false;
            this.router.navigateByUrl('brands');
        }
    }

    onCancle() {
        this.location.back();
    }

    private _addBrand() {
        const brandForm: Brand = {
            name: this.form.get('name').value,
            logo: this.form.get('logo').value
        };
        this.brandService
            .createBrand(brandForm)
            .pipe(takeUntil(this.endsubs$))
            .subscribe(
                (brand) => {
                    this.addSuccess = true;
                    this.form.reset();
                },
                (error) => {
                    console.log(error)
                    this.addSuccess = false;
                }
            );
    }

    private _updateBrand(brandData: Brand) {
        this.brandService
            .updateBrand(brandData, this.currentBrandId)
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
        this.route.params.pipe(takeUntil(this.endsubs$)).subscribe((params) => {
            if (params.id) {
                this.editmode = true;
                this.currentBrandId = params.id;
                this.brandService
                    .getBrand(params.id)
                    .pipe(takeUntil(this.endsubs$))
                    .subscribe((brand) => {
                        this.brand = brand;
                        this.brandForm.name.setValue(brand.name);
                        this.brandForm.logo.setValue(brand.logo);
                        console.log('HERE1', this.brand);
                    });
            }
        });
    }

    get brandForm() {
        return this.form.controls;
    }

}
