import {Component, OnInit, ViewChild} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {RfqService} from "../rfq.service";
import {ActivatedRoute} from "@angular/router";
import {ClientService} from "../../client/client.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {RfqItem} from "../../api/models/rfq-item";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {EditRFQItemComponent} from "../edit-rfqitem/edit-rfqitem.component";
import {CreatePOFromRFQComponent} from "./create-pofrom-rfq/create-pofrom-rfq.component";
import {RFQItemStatus} from "../../data/rfq-item-status";
import {AddRfqItemComponent} from "./add-rfq-item/add-rfq-item.component";

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
    currentRfqId: number;
    client: any;
    hasQuote: boolean = false;
    hasPurchaseOrder: boolean = false;
    formFieldHelpers: string[] = [''];
    form: FormGroup;
    dataSource: MatTableDataSource<RfqItem>;
    displayedColumns = ['rfqItemId', 'id', 'name', 'sku', 'quantity', 'price', 'status', 'actions'];
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
                private dialog: MatDialog,
                private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.isLoading = true;
        this._getRfqDetails();
        this._initForm();
    }

    onSubmitPurchaseOrder(rfqId: string) {

    }

    onSubmitQuotation(rfqId: string) {

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

    getPOItemValue() {
        let result = this.rfqs.purchaseOrder?.items.map(a => a.priceQuoted).reduce(function (a, b) {
            return a + b;
        });
        return result;
    }

    openDialog(rfqItem) {
        const rfqItemToUpdate: RfqItem = {
            RfqId: rfqItem.rfqId,
            id: rfqItem.rfqItemId,
            priceQuoted: rfqItem.price,
            status: rfqItem.status,
            quantity: rfqItem.quantity,
            expectedArrivalDate: rfqItem.expectedArrivalDate,
            supplier: rfqItem.supplier,
            item: rfqItem.item
        }

        const dialogRef = this.dialog.open(EditRFQItemComponent, {
            width: '600px',
            data: rfqItemToUpdate,
        });

        dialogRef.afterClosed().subscribe(res => {
            // received data from dialog-component
            if (res.updated) {
                this._getRfqDetails();
            }
        })
    }

    openPODialog() {

        const dialogRef = this.dialog.open(CreatePOFromRFQComponent, {
            width: '600px',
            data: this.rfqs,
        });

        dialogRef.afterClosed().subscribe(res => {
            // received data from dialog-component
            if (res && res.updated) {
                this._getRfqDetails();
            }
        })
    }

    deleteRfqItem(id: number) {
        this.rfqService.deleteRfqItem(id).pipe(takeUntil(this.endsubs$)).subscribe(() => {
            this._getRfqDetails();
        });
    }

    readyForPO(): boolean {

        let ready = true;
        if (!this.rfqs.items || this.rfqs.purchaseOrder || this.rfqs.items.length === 0) ready = false;

        this.rfqs.items.forEach(item => {
            if (item.priceQuoted == null || item.status != RFQItemStatus.QUOTATION_RECEIVED) {
                ready = false;
            }
        });

        return ready;
    }

    openAddRfqItemDialog() {
        const dialogRef = this.dialog.open(AddRfqItemComponent, {
            width: '600px',
            data: this.rfqs,
        });

        dialogRef.afterClosed().subscribe(res => {
            // received data from dialog-component
            console.log(">>> after closed in rfqDetails", res);
            if (res && res.added) {
                this._getRfqDetails();
            }
        })
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
        this.route.params.pipe(takeUntil(this.endsubs$)).subscribe((params) => {
            if (params.id) {
                this.currentRfqId = params.id;
                this.rfqService
                    .getRfqDetails(this.currentRfqId)
                    .pipe(takeUntil(this.endsubs$))
                    .subscribe((rfq) => {
                        this.rfqs = rfq;

                        if (this.rfqs.quoteDocumentUrl) {
                            this.hasQuote = true;
                        }
                        if (this.rfqs.purchaseOrderDocumentUrl) {
                            this.hasPurchaseOrder = true;
                        }
                        this.clientService.getClient(rfq.clientId.toString()).pipe(takeUntil(this.endsubs$))
                            .subscribe((client) => {
                                this.client = client;
                                this.isLoading = false;
                            });

                        this.items = [];
                        this.rfqs.items.forEach(item => {
                            this.items.push({
                                rfqItemId: item.id,
                                id: item.item.id,
                                name: item.item.name,
                                sku: item.item.sku,
                                quantity: item.quantity,
                                price: item.priceQuoted,
                                status: item.status
                            });
                        });
                        this.dataSource = new MatTableDataSource(this.items);
                    });
            }
        });
    }


}
