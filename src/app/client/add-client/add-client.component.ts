import {Component, OnDestroy, OnInit} from '@angular/core';
import {ClientService} from '../client.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {Client} from '../../api/models/client';
import {FuseConfirmationService} from '../../../@fuse/services/confirmation';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {CreateClientRequest} from "../../api/models/create-client-request";
import {HttpParams} from "@angular/common/http";

@Component({
    selector: 'app-add-client',
    templateUrl: './add-client.component.html',
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
export class AddClientComponent implements OnInit, OnDestroy {
    editmode = false;
    form: FormGroup;
    isSubmitted = false;
    endsubs$: Subject<any> = new Subject();
    addSuccess = false;
    updateSuccess = false;
    currentClientId: string;
    imageDisplay: string | ArrayBuffer;
    isLoading: boolean = false;
    client: any = null;
    updateOld: boolean = false;
    public contactInfo: any = {};

    constructor(private clientService: ClientService,
                private formBuilder: FormBuilder,
                private _fuseConfirmationService: FuseConfirmationService,
                private location: Location,
                private route: ActivatedRoute,
                private router: Router,) {

    }

    get clientContactInformation() {
        return this.client.contactInformation;
    }

    get clientForm() {
        return this.form.controls;
    }

    ngOnInit() {
        this._initForm();
        this._checkEditMode();
    }

    ngOnDestroy() {
        //this.endsubs$.next(null);
        this.endsubs$.complete();
    }

    onSubmit() {
        this.isSubmitted = true;
        this.isLoading = true;

        if (this.form.invalid) {
            return;
        }

        const updateClient: CreateClientRequest = new CreateClientRequest();
        if (this.editmode) {
            if (this.clientContactInformation) {
                console.log('>>> this.client', this.client.contactInformation);
                updateClient.name = this.form.get('name').value;
                updateClient.vatNumber = this.form.get('vatNumber').value;
                updateClient.buyers = this.form.get('buyer').value;
                updateClient.contactInformation = this.form.get('contactInformation').value;
                updateClient.contactInformation.id = this.client.contactInformation.id;
                updateClient.contactInformation.address.id = this.client.contactInformation.address.id;
                this.updateOld = false;
            } else {
                if (!this.updateOld) {
                    updateClient.name = this.form.get('name').value;
                    updateClient.buyers = this.form.get('buyer').value;
                    updateClient.contactInformation = this.form.get('contactInformation').value;
                }
            }
            this._updateClient(updateClient);
            this.isLoading = false;
            this.router.navigateByUrl('clients');
            // this.location.back();
        } else {
            this._addClient();
            this.isLoading = false;
            this.router.navigateByUrl('clients');
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

    private _initForm() {
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            buyer: [null],
            contactInformation: this.formBuilder.group({
                work: [null],
                cellphone: [null],
                telephone: [null],
                whatsapp: [null],
                email: [''],
                address: this.formBuilder.group({
                    line1: [''],
                    line2: [''],
                    suburb: [''],
                    postalCode: [null],
                    city: [''],
                    province: [''],
                    country: [''],
                })
            }),
            vatNumber: [null],
        });
    }

    private _addClient() {
        const newClient: CreateClientRequest = {
            name: this.form.get('name').value,
            vatNumber: this.form.get('vatNumber').value,
            contactInformation: {
                work: this.form.get('contactInformation.work').value,
                telephone: this.form.get('contactInformation.telephone').value,
                cellphone: this.form.get('contactInformation.cellphone').value,
                email: this.form.get('contactInformation.email').value,
                whatsapp: this.form.get('contactInformation.whatsapp').value,
                address: {
                    line1: this.form.get('contactInformation.address.line1').value,
                    line2: this.form.get('contactInformation.address.line2').value,
                    postalCode: this.form.get('contactInformation.address.postalCode').value,
                    suburb: this.form.get('contactInformation.address.suburb').value,
                    city: this.form.get('contactInformation.address.city').value,
                    province: this.form.get('contactInformation.address.province').value,
                    country: this.form.get('contactInformation.address.country').value,
                }
            }
        }
        console.log(newClient);
        //
        // newClient.name = this.form.get('name').value;
        // newClient.vatNumber = this.form.get('vatNumber').value;
        // console.log('work ', this.form.get('contactInformation.work').value);
        // newClient.contactInformation.work = this.form.get('contactInformation.work').value;
        // newClient.contactInformation.telephone = this.form.get('contactInformation.telephone').value;
        // newClient.contactInformation.cellphone = this.form.get('contactInformation.cellphone').value;
        // newClient.contactInformation.email = this.form.get('contactInformation.email').value;
        // newClient.contactInformation.whatsapp = this.form.get('contactInformation.whatsapp').value;
        // newClient.contactInformation.address.line1 = this.form.get('contactInformation.address.line1').value;
        // newClient.contactInformation.address.line2 = this.form.get('contactInformation.address.line2').value;
        // newClient.contactInformation.address.postalCode = this.form.get('contactInformation.address.postalCode').value;
        // newClient.contactInformation.address.suburb = this.form.get('contactInformation.address.suburb').value;
        // newClient.contactInformation.address.city = this.form.get('contactInformation.address.city').value;
        // newClient.contactInformation.address.province = this.form.get('contactInformation.address.province').value;
        // newClient.contactInformation.address.country = this.form.get('contactInformation.address.country').value;
        //newClient.rfQs = this.form.get('rfq').value;

        if (newClient) {
            this.clientService
                .addClient(newClient)
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
        } else {
            console.log(newClient);
        }
    }

    private _updateClient(clientData: CreateClientRequest) {
        this.clientService
            .updateClient(clientData, this.currentClientId)
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
        this.route.params.pipe(takeUntil(this.endsubs$)).subscribe((params) => {
            if (params.id) {
                this.editmode = true;
                this.currentClientId = params.id;
                this.clientService
                    .getClient(params.id)
                    .pipe(takeUntil(this.endsubs$))
                    .subscribe((client) => {
                        this.client = client;
                        this.clientForm.name.setValue(client.name);
                        this.clientForm.vatNumber.setValue(client.vatNumber);

                        if (this.client.contactInformation) {
                            this.contactInfo = {
                                work: client.contactInformation.work,
                                cellphone: client.contactInformation.cellphone,
                                telephone: client.contactInformation.telephone,
                                email: client.contactInformation.email,
                                whatsapp: client.contactInformation.whatsapp,
                                address: {
                                    line1: client.contactInformation.address.line1,
                                    line2: client.contactInformation.address.line2,
                                    suburb: client.contactInformation.address.suburb,
                                    city: client.contactInformation.address.city,
                                    postalCode: client.contactInformation.address.postalCode,
                                    province: client.contactInformation.address.province,
                                    country: client.contactInformation.address.country
                                }
                            };

                            this.clientForm.contactInformation.setValue(this.contactInfo);
                        } else {
                            //this.clientForm.contactInformation.setValue(client.contactInformation);
                        }
                    });
            }
        });
    }
}
