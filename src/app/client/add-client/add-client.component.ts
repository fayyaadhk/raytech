import {Component, OnDestroy, OnInit} from '@angular/core';
import {ClientService} from '../client.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {Client} from '../client.model';
import {FuseConfirmationService} from '../../../@fuse/services/confirmation';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss']
})
export class AddClientComponent implements OnInit, OnDestroy{
    editmode = false;
    form: FormGroup;
    isSubmitted = false;
    endsubs$: Subject<any> = new Subject();
    addSuccess = false;
    updateSuccess = false;
    currentClientId: string;
    imageDisplay: string | ArrayBuffer;

    constructor(private clientService: ClientService,
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
            thumbnail: ['', Validators.required],
            mobile: ['', Validators.required],
            email: ['', Validators.required],
            active: ['']
        });
    }

    onSubmit() {
        this.isSubmitted = true;
        if (this.form.invalid) {return;}

        const clientFormData = new FormData();
        Object.keys(this.clientForm).map((key) => {
            clientFormData.append(key, this.clientForm[key].value);
            console.log(this.clientForm[key].value);
        });
        if (this.editmode) {
            this._updateClient(clientFormData);
        } else {
            this._addClient(clientFormData);
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

    private _addClient(clientData: FormData) {
        if(clientData){
            this.clientService
                .createClient(clientData)
                .pipe(takeUntil(this.endsubs$))
                .subscribe(
                    (client: Client) => {
                        this.addSuccess = true;
                        console.log(client);
                    },
                    () => {
                        this.addSuccess = false;
                    }
                );
        }
        else{
            console.log(clientData);
        }
    }

    private _updateClient(clientData: FormData) {
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
                        this.clientForm.name.setValue(client.name);
                        this.clientForm.mobile.setValue(client.mobile);
                        this.clientForm.email.setValue(client.email);
                        this.clientForm.active.setValue(client.active);
                        this.imageDisplay = client.thumbnail;
                        this.clientForm.thumbnail.setValidators([]);
                        this.clientForm.thumbnail.updateValueAndValidity();
                    });
            }
        });
    }

    get clientForm() {
        return this.form.controls;
    }
}
