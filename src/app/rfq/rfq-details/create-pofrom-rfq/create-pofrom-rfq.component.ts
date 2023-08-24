import {Component, Inject, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {RfqModule} from "../../rfq.module";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {RfqItem} from "../../../api/models/rfq-item";
import {PurchaseOrderService} from "../../../purchase-orders/purchase-order.service";
import {Rfq} from "../../rfq.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PurchaseOrder} from "../../../api/models/purchase-order";
import {CreateRfqRequest} from "../../../api/models/create-rfq-request";
import {CreatePurchaseOrderRequest} from "../../../api/models/create-purchase-order-request";
import {PurchaseOrderItem} from "../../../api/models/purchase-order-item";
import {POItemRequest} from "../../../api/models/create-po-item-request";

@Component({
    selector: 'app-create-pofrom-rfq',
    templateUrl: './create-pofrom-rfq.component.html',
    styleUrls: ['./create-pofrom-rfq.component.scss']
})
export class CreatePOFromRFQComponent implements OnInit {

    rfq: Rfq;

    poForm: FormGroup;
    formFieldHelpers: string[] = [''];

    formData: FormData = new FormData();
    poDocumentFile: File;

    addSuccess: boolean = false;
    isLoading: boolean = true;
    updateSuccess: boolean = true;

    endsubs$: Subject<any> = new Subject();

    constructor(@Inject(MAT_DIALOG_DATA) public data: Rfq,
                private dialogRef: MatDialogRef<CreatePOFromRFQComponent>,
                private purchaseOrderService: PurchaseOrderService,
                private formBuilder: FormBuilder) {
    }

    ngOnInit(): void {
        this.rfq = this.data;
        this.poForm = this.formBuilder.group({
            purchaseOrderNumber: ['', Validators.required],
            dateReceived: ['', Validators.required],
            due: ['', Validators.required]
        });
    }


    onSubmit() {
        this.createPurchaseOrder();
        this.dialogRef.close(
            {
                updated: this.updateSuccess
            }
        )

    }

    // Image Preview
    uploadPODocument(event) {
        if (event.target.files.length > 0) {

            const file = event.target.files[0];
            this.poDocumentFile = file;
        }
    }

    createPurchaseOrder() {

        const poItems: POItemRequest[] =[]
        this.rfq.items.forEach(item =>{
            poItems.push({
                itemId: item.item.id,
                supplierId: item.supplier?.id,
                expectedArrivalDate: item.expectedArrivalDate,
                priceQuoted: item.priceQuoted,
                quantity: item.quantity
            })
        });

        const request: CreatePurchaseOrderRequest = {
            rfqId: this.rfq.id,
            description: this.rfq.description,
            buyerId: this.rfq.buyerId,
            clientId: this.rfq.clientId,
            PONumber: this.poForm.get('purchaseOrderNumber').value,
            due: this.poForm.get('due').value,
            items: poItems,
            dateReceived: this.poForm.get('dateReceived').value
        };

        this.purchaseOrderService.createPurchaseOrder(request)
            .pipe(takeUntil(this.endsubs$))
            .subscribe(
                (po: PurchaseOrder) => {
                    this.updateSuccess = true;
                },
                () => {
                    this.updateSuccess = false;
                }
            );
    }

}
