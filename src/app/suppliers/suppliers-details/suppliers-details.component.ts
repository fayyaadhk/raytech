import { Component } from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {RfqItem} from "../../api/models/rfq-item";
import {ClientService} from "../../client/client.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-suppliers-details',
  templateUrl: './suppliers-details.component.html',
  styleUrls: ['./suppliers-details.component.scss']
})
export class SuppliersDetailsComponent {
    clients: any;
    endsubs$: Subject<any> = new Subject();
    isLoading: boolean = false;
    currentClientId: string;
    client: any;
    hasQuote: boolean = false;
    hasPurchaseOrder: boolean = false;
    formFieldHelpers: string[] = [''];
    form: FormGroup;
    dataSource: MatTableDataSource<RfqItem>;
    displayedColumns = [
        'id',
        'rfqNumber',
        'dateCreated',
        //'description',
        'due',
        'status',
        'rfqDocumentUrl',
        'quoteDocumentUrl',
        'quoteSentDate',
        'purchaseOrderDocumentUrl',
        'purchaseOrderDueDate',
        'purchaseOrderReceivedDate',
        'purchaseOrderOutcome',
        'purchaseOrderStatus'
    ];
    quoteDocumentPreview: string;
    purchaseOrderDocumentPreview: string;
    items = [];
    statuses: any = [
        {id: 1, name: 'Issued'},
        {id: 2, name: 'Sourcing'},
        {id: 3, name: 'Could not source'},
        {id: 4, name: 'In progress'},
        {id: 5, name: 'Pending submission'},
        {id: 6, name: 'Quotation sent'},
        {id: 7, name: 'Successful'},
        {id: 8, name: 'Unsuccessful'},
        {id: 9, name: 'Cancelled'},
    ];
    outcomes: any = [
        {id: 1, name: 'Issued'},
        {id: 2, name: 'Sourcing'},
        {id: 3, name: 'Could not source'},
        {id: 4, name: 'In progress'},
        {id: 5, name: 'Pending submission'},
        {id: 6, name: 'Quotation sent'},
        {id: 7, name: 'Successful'},
        {id: 8, name: 'Unsuccessful'},
        {id: 9, name: 'Cancelled'},
    ];

    constructor(private clientService: ClientService,
                private formBuilder: FormBuilder,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.isLoading = true;
        this._getRfqDetails();
        this._initForm();
    }

    private _initForm() {
        // Vertical stepper form
        this.form = this.formBuilder.group({
            quoteDocumentUrl: [''],
            quoteSentDate: [''],
            purchaseOrderDocumentUrl: [''],
            purchaseOrderDueDate: [''],
            purchaseOrderReceivedDate: [''],
            purchaseOrderOutcome: [''],
            purchaseOrderStatus: [''],
        });
    }

    private _getRfqDetails() {
        console.log("HERE");
        this.route.params.pipe(takeUntil(this.endsubs$)).subscribe((params) => {
            console.log(params);
            if (params.id) {
                this.currentClientId = params.id;
                console.log('>>>>>>', this.currentClientId)
                this.clientService
                    .getClientDetails(this.currentClientId)
                    .pipe(takeUntil(this.endsubs$))
                    .subscribe((client) => {
                        this.clients = client;
                        console.log(this.clients);
                        console.log(this.clients.rfQs);

                        for(let i = 0; i < this.clients.rfQs.length; i++){
                            this.items.push({
                                id: this.clients.rfQs[i].id,
                                rfqNumber: this.clients.rfQs[i].rfqNumber,
                                description: this.clients.rfQs[i].description,
                                due: this.clients.rfQs[i].due,
                                status: this.clients.rfQs[i].status,
                                dateCreated: this.clients.rfQs[i].dateCreated,
                                rfqDocumentUrl: this.clients.rfQs[i].rfqDocumentUrl,
                                quoteDocumentUrl: this.clients.rfQs[i].quoteDocumentUrl,
                                quoteSentDate: this.clients.rfQs[i].quoteSentDate,
                                purchaseOrderDocumentUrl: this.clients.rfQs[i].purchaseOrderDocumentUrl,
                                purchaseOrderDueDate: this.clients.rfQs[i].purchaseOrderDueDate,
                                purchaseOrderReceivedDate: this.clients.rfQs[i].purchaseOrderReceivedDate,
                                purchaseOrderOutcome: this.clients.rfQs[i].purchaseOrderOutcome,
                                purchaseOrderStatus: this.clients.rfQs[i].purchaseOrderStatus,
                            });
                        }
                        this.dataSource = new MatTableDataSource(this.items);
                        this.isLoading = false;
                        //this.clientForm.contactInformation.setValue(this.contactInfo);
                        //this.clientForm.thumbnail.setValidators([]);
                        //this.clientForm.thumbnail.updateValueAndValidity();
                    });
            }
        });
    }

}
