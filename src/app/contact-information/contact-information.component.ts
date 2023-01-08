import {Component, Input, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {ControlContainer, FormBuilder, FormGroup, FormGroupDirective, Validators} from '@angular/forms';

@Component({
  selector: 'app-contact-information',
  templateUrl: './contact-information.component.html',
  styleUrls: ['./contact-information.component.scss']
})
export class ContactInformationComponent implements OnInit{
    //@Input() formData: FormGroup;
    form!: FormGroup;
    contactInformation: any = [];
    endsubs$: Subject<any> = new Subject<any>();

    constructor(private formBuilder: FormBuilder,
                private rootFormGroup: FormGroupDirective) {
    }

    ngOnInit() {
        this.form = this.rootFormGroup.control;
    }

    private _initForm() {
        // this.contactFormGroup = this.formBuilder.group({
        //     contactInformation: this.formBuilder.group({
        //         work: [''],
        //         cellphone: [''],
        //         telephone: [''],
        //         whatsapp: [''],
        //         email: [''],
        //         address: this.formBuilder.group({
        //             line1: [''],
        //             line2: [''],
        //             suburb: [''],
        //             postalCode: [''],
        //             city: [''],
        //             province: [''],
        //             country: [''],
        //         })
        //     })
        // });
        // this.addGroupToParent();
    }

   /* private addGroupToParent(): void {
        this.formData.addControl('contactInformation.work',  this.form);
        this.formData.addControl('contactInformation.cellphone',  this.form);
        this.formData.addControl('contactInformation.telephone',  this.form);
        this.formData.addControl('contactInformation.whatsapp',  this.form);
        this.formData.addControl('contactInformation.email',  this.form);
        this.formData.addControl('contactInformation.address.line1',  this.form);
        this.formData.addControl('contactInformation.address.line2',  this.form);
        this.formData.addControl('contactInformation.address.suburb',  this.form);
        this.formData.addControl('contactInformation.address.postalCode',  this.form);
        this.formData.addControl('contactInformation.address.city',  this.form);
        this.formData.addControl('contactInformation.address.province',  this.form);
        this.formData.addControl('contactInformation.address.country',  this.form);
        // this.onFormGroupChange.emit(this.formData);
    }*/
}
