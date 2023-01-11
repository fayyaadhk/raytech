import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";
import {ItemService} from "../../item/item.service";
import {FuseConfirmationService} from "../../../@fuse/services/confirmation";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {Supplier} from "../../api/models/supplier";
import {SupplierService} from "../suppliers.service";
import {ClientService} from "../../client/client.service";
import {CreateClientRequest} from "../../api/models/create-client-request";
import {Client} from "../../api/models/client";

@Component({
  selector: 'app-add-suppliers',
  templateUrl: './add-suppliers.component.html',
  styleUrls: ['./add-suppliers.component.scss']
})
export class AddSuppliersComponent {
    editmode = false;
    form: FormGroup;
    contactFormroup;
    isSubmitted = false;
    endsubs$: Subject<any> = new Subject();
    addSuccess = false;
    updateSuccess = false;
    currentSupplierId: string;
    imageDisplay: string | ArrayBuffer;
    isLoading: boolean = false;
    supplier: any = null;
    updateOld: boolean = false;
    public contactInfo: any = {};

    constructor(private supplierService: SupplierService,
                private formBuilder: FormBuilder,
                private _fuseConfirmationService: FuseConfirmationService,
                private location: Location,
                private route: ActivatedRoute) {

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
            contactInformation: this.formBuilder.group({
                work: [''],
                cellphone: [''],
                telephone: [''],
                whatsapp: [''],
                email: [''],
                address: this.formBuilder.group({
                    line1: [''],
                    line2: [''],
                    suburb: [''],
                    postalCode: [''],
                    city: [''],
                    province: [''],
                    country: [''],
                })
            }),
        });
    }

    onSubmit() {
        this.isSubmitted = true;
        this.isLoading = true;

        if (this.form.invalid) {return;}

        const updateSupplier: Supplier = new Supplier();

        if (this.editmode) {
            if (this.supplierContactInformation){
                console.log('>>> this.supplier', this.supplier.contactInformation);
                updateSupplier.name = this.form.get('name').value;
                updateSupplier.contactInfo = this.form.get('contactInformation').value;
                updateSupplier.contactInfoId = this.supplier.contactInfo.id;
                updateSupplier.contactInfo.address.id = this.supplier.contactInfo.address.id;
                this.updateOld = false;
            }
            else{
                if(!this.updateOld){
                    updateSupplier.name = this.form.get('name').value;
                    updateSupplier.contactInfo = this.form.get('contactInformation').value;
                }
            }
            this._updateSupplier(updateSupplier);
            this.isLoading = false;
            // this.location.back();
        } else {
            this._addSupplier();
            this.isLoading = false;
            this.location.back();
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

    private _addSupplier() {
        console.log('>>> GOT INTO ADD');
        const newSupplier: Supplier = new Supplier();
        console.log('>>> INSTANTIATED');

        newSupplier.name = this.form.get('name').value;
        console.log('>>> ASSIGNED NAME');

        console.log('>>> t=assigned work', this.form.get('contactInformation').value);
        if (this.form.get('contactInformation').value){
            newSupplier.contactInfo = this.form.get('contactInformation').value;
            console.log('>>> newSupplier', newSupplier);
        }
        else{
            newSupplier.contactInfo = null;
        }
        if(newSupplier){
            this.supplier
                .createSupplier(newSupplier)
                .pipe(takeUntil(this.endsubs$))
                .subscribe(
                    (supplier) => {
                        this.addSuccess = true;
                        console.log(supplier);
                        this.form.reset();
                    },
                    () => {
                        this.addSuccess = false;
                    }
                );
        }
        else{
            console.log(newSupplier);
        }
    }

    private _updateSupplier(supplierData: Supplier) {
        this.supplierService
            .updateSupplier(supplierData, this.currentSupplierId)
            .pipe(takeUntil(this.endsubs$))
            .subscribe(
                (client: Client) => {
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
                this.currentSupplierId = params.id;
                this.supplierService
                    .getSupplier(params.id)
                    .pipe(takeUntil(this.endsubs$))
                    .subscribe((supplier) => {
                        this.supplier = supplier;
                        this.supplierForm.name.setValue(supplier.name);
                        console.log('HERE1', supplier.contactInfo);

                        if(this.supplier.contactInformation){
                            this.contactInfo = {
                                work: supplier.contactInfo.work,
                                cellphone: supplier.contactInfo.cellphone,
                                telephone: supplier.contactInfo.telephone,
                                email: supplier.contactInfo.email,
                                whatsapp: supplier.contactInfo.whatsapp,
                                address: {
                                    line1: supplier.contactInfo.address.line1,
                                    line2: supplier.contactInfo.address.line2,
                                    suburb: supplier.contactInfo.address.suburb,
                                    city: supplier.contactInfo.address.city,
                                    postalCode: supplier.contactInfo.address.postalCode,
                                    province: supplier.contactInfo.address.province,
                                    country: supplier.contactInfo.address.country
                                }
                            };

                            console.log("this.contactInfo", this.contactInfo);
                            this.supplierForm.contactInfo.setValue(this.contactInfo);
                        }
                        else{
                            console.log('After IF ');
                            //this.clientForm.contactInfo.setValue(client.contactInfo);
                        }
                        //this.clientForm.thumbnail.setValidators([]);
                        //this.clientForm.thumbnail.updateValueAndValidity();
                    });
            }
        });
    }

    get supplierContactInformation(){
        return this.supplier.contactInfo;
    }

    get supplierForm() {
        return this.form.controls;
    }
}
