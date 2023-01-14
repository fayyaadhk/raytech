import {Component, OnInit, ViewChild} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {RfqService} from "../rfq.service";
import {ActivatedRoute} from "@angular/router";
import {ClientService} from "../../client/client.service";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {RfqItem} from "../../api/models/rfq-item";
import {MatSort} from "@angular/material/sort";

@Component({
    selector: 'app-rfq-details',
    templateUrl: './rfq-details.component.html',
    styleUrls: ['./rfq-details.component.scss']
})
export class RfqDetailsComponent implements OnInit {
    @ViewChild('rfqsTable', {read: MatSort}) rfqsTableMatSort: MatSort;

    rfqs: any;
    endsubs$: Subject<any> = new Subject();
    isLoading: boolean = false;
    currentRfqId: string;
    client: any;
    hasQuote: boolean = false;
    hasPurchaseOrder: boolean = false;
    formFieldHelpers: string[] = [''];
    form: FormGroup;
    dataSource: MatTableDataSource<RfqItem>;
    displayedColumns = ['rfqItemId', 'id', 'name', 'sku', 'quantity', 'price', 'status'];
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

    poItemTotal: number;

    constructor(private rfqService: RfqService,
                private route: ActivatedRoute,
                private clientService: ClientService,
                private formBuilder: FormBuilder) {
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

    onSubmitPurchaseOrder(rfqId: string){

    }

    onSubmitQuotation(rfqId: string){

    }

    private _getRfqDetails() {
        console.log("HERE");
        this.route.params.pipe(takeUntil(this.endsubs$)).subscribe((params) => {
            console.log(params);
            if (params.id) {
                this.currentRfqId = params.id;
                console.log('>>>>>>', this.currentRfqId)
                this.rfqService
                    .getRfqDetails(this.currentRfqId)
                    .pipe(takeUntil(this.endsubs$))
                    .subscribe((rfq) => {
                        this.rfqs = rfq;
                        console.log("this.rfq", this.rfqs);

                        console.log("this.rfq.items", this.rfqs.items);
                        if (this.rfqs.quoteDocumentUrl) {
                            this.hasQuote = true;
                        }
                        if (this.rfqs.purchaseOrderDocumentUrl) {
                            this.hasPurchaseOrder = true;
                        }
                        this.clientService.getClient(rfq.clientId.toString()).pipe(takeUntil(this.endsubs$))
                            .subscribe((client) => {
                                this.client = client;
                                console.log(this.client);
                                this.isLoading = false;
                            });

                        for(let i = 0; i < this.rfqs.items.length; i++){
                            this.items.push({
                                rfqItemId: this.rfqs.items[i].id,
                                id: this.rfqs.items[i].item.id,
                                name: this.rfqs.items[i].item.name,
                                sku: this.rfqs.items[i].item.sku,
                                quantity: this.rfqs.items[i].quantity,
                                price: this.rfqs.items[i].priceQuoted,
                                status: this.rfqs.items[i].status
                            });
                        }
                        console.log(">>>> this.items", this.items);
                        this.dataSource = new MatTableDataSource(this.items);
                        //this.clientForm.contactInformation.setValue(this.contactInfo);
                        //this.clientForm.thumbnail.setValidators([]);
                        //this.clientForm.thumbnail.updateValueAndValidity();
                    });
            }
        });
    }

    uploadQuotation(event) {
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({
            quoteDocument: file
        });
        this.form.get('quoteDocumentUrl').updateValueAndValidity();
        // File Preview
        const reader = new FileReader();
        reader.onload = () => {
            this.quoteDocumentPreview = reader.result as string;
        };
        reader.readAsDataURL(file);
    }

    uploadPurchaseOrder(event) {
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({
            purchaseOrderDocument: file
        });
        this.form.get('purchaseOrderDocumentUrl').updateValueAndValidity();
        // File Preview
        const reader = new FileReader();
        reader.onload = () => {
            this.purchaseOrderDocumentPreview = reader.result as string;
        };
        reader.readAsDataURL(file);
    }

    getPOItemValue(){
        const result = this.rfqs.purchaseOrder.items.map(a => a.priceQuoted).reduce(function(a, b){
            return a + b;
        });
        return result;
    }

}
