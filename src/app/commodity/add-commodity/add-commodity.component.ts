import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";
import {ItemService} from "../../item/item.service";
import {FuseConfirmationService} from "../../../@fuse/services/confirmation";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {ItemClass} from "../../item/item.model";
import {CommodityService} from "../commodity.service";
import {Commodity} from "../commodity.model";

@Component({
  selector: 'app-add-commodity',
  templateUrl: './add-commodity.component.html',
  styleUrls: ['./add-commodity.component.scss']
})
export class AddCommodityComponent {
    editmode = false;
    form: FormGroup;
    isSubmitted = false;
    endsubs$: Subject<any> = new Subject();
    addSuccess = false;
    updateSuccess = false;
    currentCommodityId: string;
    imageDisplay: string | ArrayBuffer;
    isLoading: boolean = false;
    commodity: any = null;

    constructor(private commodityService: CommodityService,
                private formBuilder: FormBuilder,
                private _fuseConfirmationService: FuseConfirmationService,
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
        });
    }

    onSubmit() {
        this.isSubmitted = true;
        this.isLoading = true;

        if (this.form.invalid) {return;}
        const updateCommodity: Commodity = new Commodity();
        updateCommodity.name = this.form.get('name').value;
        if (this.editmode) {
            this._updateCommodity(updateCommodity);
            this.isLoading = false;
            // this.location.back();
        } else {
            this._addCommodity();
            this.isLoading = false;
            this.router.navigateByUrl('commodities');
        }
    }
    onCancle() {
        this.location.back();
    }

    onImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            this.form.patchValue({ image: file });
            this.form.get('image').updateValueAndValidity();
            const fileReader = new FileReader();
            fileReader.onload = () => {
                this.imageDisplay = fileReader.result;
            };
            fileReader.readAsDataURL(file);
        }
    }

    private _addCommodity() {
        console.log('>>> GOT INTO ADD');
        const newCommodity: Commodity = new Commodity();
        console.log('>>> initialised ');
        newCommodity.name = this.form.get('name').value;
        console.log('>>> get value name from controller', this.form.get('name').value);
        console.log('>>> get values from controller', newCommodity);
        this.commodityService
            .addItem(newCommodity)
            .pipe(takeUntil(this.endsubs$))
            .subscribe(
                (commodity) => {
                    this.addSuccess = true;
                    console.log(commodity);
                    this.form.reset();
                },
                (error) => {
                    this.addSuccess = false;
                    console.log(error);
                }
            );
    }

    private _updateCommodity(commodityData: Commodity) {
        this.commodityService
            .updateCommodity(commodityData, this.currentCommodityId)
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
                this.currentCommodityId = params.id;
                this.commodityService
                    .getCommodity(params.id)
                    .pipe(takeUntil(this.endsubs$))
                    .subscribe((commodity) => {
                        this.commodity = commodity;
                        this.commodityForm.name.setValue(commodity.name);
                        // this.clientForm.buyer.setValue(client.buyer);
                        console.log('HERE1', this.commodity);
                    });
            }
        });
    }

    get commodityForm() {
        return this.form.controls;
    }
}
