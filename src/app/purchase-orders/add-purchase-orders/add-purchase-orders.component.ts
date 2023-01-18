import { Component } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";
import {FuseConfirmationService} from "../../../@fuse/services/confirmation";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {PurchaseOrderService} from "../purchase-order.service";
import {PurchaseOrder} from "../../api/models/purchase-order";
import {ClientService} from "../../client/client.service";
import {RfqService} from "../../rfq/rfq.service";
import {MatTableDataSource} from "@angular/material/table";
import {PurchaseOrderItem} from "../../api/models/purchase-order-item";
import {MatDialog} from "@angular/material/dialog";
import {UpdateRfqItem} from "../../api/models/update-rfq-item";
import {RfqModule} from "../../rfq/rfq.module";
import {CreateRfqItem} from "../../api/models/create-rfq-item";
import {PurchaseOrdersItemComponent} from "../purchase-orders-item/purchase-orders-item.component";
import {POStatus} from "../../data/purchase-order-status";
import {UpdatePurchaseOrderItemRequest} from "../../api/models/update-purchase-order-item-request";
import {CreatePurchaseOrderItemRequest} from "../../api/models/create-purchase-order-item-request";

@Component({
  selector: 'app-add-purchase-orders',
  templateUrl: './add-purchase-orders.component.html',
  styleUrls: ['./add-purchase-orders.component.scss']
})
export class AddPurchaseOrdersComponent {
    editmode = false;
    form: FormGroup;
    isSubmitted = false;
    endsubs$: Subject<any> = new Subject();
    addSuccess = false;
    updateSuccess = false;
    currentPurchaseOrderId: number;
    imageDisplay: string | ArrayBuffer;
    isLoading: boolean = false;
    purchaseOrder: any ;
    clients: any = null;
    buyers: any = null;
    purchaseOrders: any = null;
    categories: any = null;
    purchaseOrderItems: any = [];
    rfqs: any = [];
    dataSource: MatTableDataSource<PurchaseOrderItem>;
    displayedColumns = ['id', 'name', 'supplier', 'quantity', 'status', 'price', 'expectedArrivalDate', 'actions'];
    public purchaseOrderDetails: any = {};
    public purchaseOrderItemDetails: any = [];
    keys = Object.keys;
    poStatus = POStatus;
    poDocumentPreview: string;
    formFieldHelpers: string[] = [''];
    poItems: any = [];

    constructor(private purchaseOrderService: PurchaseOrderService,
                private clientService: ClientService,
                private rfqService: RfqService,
                private formBuilder: FormBuilder,
                private _fuseConfirmationService: FuseConfirmationService,
                private location: Location,
                private route: ActivatedRoute,
                private router: Router,
                private dialog: MatDialog,)
    {
    }

    openDialog() {

        const dialogRef = this.dialog.open(PurchaseOrdersItemComponent, {
            width: '600px',
            data: {modalTitle: 'Add New Purchase Order Item'},
        });

        dialogRef.afterClosed().subscribe(res => {
            // received data from dialog-component
            if (res) {
                this.purchaseOrderItems.push(res);
                this.dataSource = new MatTableDataSource(this.purchaseOrderItems);
                console.log(res.data);
                console.log(this.purchaseOrderItems);
            }
        })
    }

    updatePurchaseOrderItem(poItemId: number, itemId: number, supplierId: number, quantity: string, price: number, expectedArrivalDate: string, status: string) {
        console.log(supplierId, status);

        const dialogRef = this.dialog.open(PurchaseOrdersItemComponent, {
            width: '600px',
            data: {
                poItemId: poItemId,
                itemId: itemId,
                supplierId: supplierId,
                quantity: quantity,
                price: price,
                expectedArrivalDate: expectedArrivalDate,
                status: status
            },
        });

        dialogRef.afterClosed().subscribe(res => {
            console.log(">>> res", res);
            if (res.editMode) {

                this.purchaseOrderItems[res.poItemId] = res;

                this.dataSource = new MatTableDataSource(this.purchaseOrderItems);
                console.log(this.purchaseOrderItems);
            } else {
                this.purchaseOrderItems.push(res);
                this.dataSource = new MatTableDataSource(this.purchaseOrderItems);
            }
        });
    }

    removePurchaseOrderItem(purchaseOrderId: number, poItemId: number) {
        console.log(poItemId);
        if(purchaseOrderId){
            console.log('here 1');
            this.purchaseOrderItems.splice(purchaseOrderId, 1);
            this.dataSource = new MatTableDataSource(this.purchaseOrderItems);
        }
        else if (poItemId){
            console.log('here 2');
            this.purchaseOrderService.deletePoItem(poItemId)
                .pipe(takeUntil(this.endsubs$))
                .subscribe(() => {
                    this.purchaseOrderItems.splice(purchaseOrderId, 1);
                    this.dataSource = new MatTableDataSource(this.purchaseOrderItems);
                    this.isLoading = false;
                });
        }
    }

    ngOnInit() {
        this.isLoading = true;
        this._checkEditMode();
        this._initForm();
        this._getRfqs();
        this._getClients();
    }

    ngOnDestroy() {
        //this.endsubs$.next(null);
        this.endsubs$.complete();
    }

    private _initForm() {
        this.form = this.formBuilder.group({
            poNumber: ['', Validators.required],
            dateReceived: [''],
            due: [''],
            description: [''],
            buyer: [null],
            client: [null],
            rfq: [null],
            purchaseOrderDocumentUrl: [''],
            purchaseOrderDocument: [''],
            status: [''],
            items: new FormArray([]),
        });
    }

    private _getClients(){
        this.clientService
            .getClients()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((clients) => {
                this.clients = clients;
                this.isLoading = false;
            });
    }

    private _getRfqs(){
        this.rfqService
            .getRfqs()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((rfqs) => {
                this.rfqs = rfqs;
                this.isLoading = false;
            });
    }

    onSubmit() {
        this.isSubmitted = true;
        this.isLoading = true;

        if (this.form.invalid) {return;}
        if (this.editmode) {
            console.log(this.purchaseOrderItems);

            const updatePurchaseOrder: PurchaseOrder = {
                items: this.purchaseOrderItems,
                rfqId: this.form.get('rfq').value,
                dateReceived: this.form.get('dateReceived').value,
                due: this.form.get('due').value,
                description: this.form.get('description').value,
                status: this.form.get('status').value,
                clientId: this.form.get('client').value,
                buyerId: this.form.get('buyer').value,
                poNumber: this.form.get('poNumber').value,
                purchaseOrderDocumentUrl: this.form.get('purchaseOrderDocumentUrl').value
            };

            console.log('RFQS >>> ', this.purchaseOrders);
            for (let r = 0; r < this.purchaseOrderItems.length; r++) {
                console.log(this.purchaseOrderItems);
                console.log('edit mode ',this.purchaseOrderItems[r].editMode);
                if (this.purchaseOrderItems[r].editMode === true) {
                    const updatePoItem: UpdatePurchaseOrderItemRequest = {
                        purchaseOrderId: this.currentPurchaseOrderId,
                        itemId: this.purchaseOrderItems[r].itemId,
                        supplierId: this.purchaseOrderItems[r].supplierId,
                        quantity: this.purchaseOrderItems[r].quantity,
                        priceQuoted: this.purchaseOrderItems[r].priceQuoted,
                        expectedArrivalDate: this.purchaseOrderItems[r].expectedArrivalDate,
                        status: this.purchaseOrderItems[r].status
                    };

                    console.log('UPDATE PO ITEMS ', updatePoItem);
                    console.log(this.purchaseOrders.items[r].id);

                    this.purchaseOrderService
                        .updatePoItem(updatePoItem, this.purchaseOrders.items[r].id)
                        .pipe(takeUntil(this.endsubs$))
                        .subscribe(
                            (po) => {
                                this.updateSuccess = true;
                            },
                            () => {
                                this.updateSuccess = false;
                            }
                        );
                } else if(this.purchaseOrderItems[r].editMode === false){
                    const addPoItem: CreatePurchaseOrderItemRequest = {
                        purchaseOrderId: this.currentPurchaseOrderId,
                        itemId: this.purchaseOrderItems[r].itemId,
                        supplierId: this.purchaseOrderItems[r].supplierId,
                        quantity: this.purchaseOrderItems[r].quantity,
                        priceQuoted: this.purchaseOrderItems[r].priceQuoted,
                        status: this.purchaseOrderItems[r].status,
                        expectedArrivalDate: this.purchaseOrderItems[r].expectedArrivalDate
                    };
                    console.log('ADD PO ITEM', addPoItem);
                    this.purchaseOrderService
                        .createPoItem(addPoItem)
                        .pipe(takeUntil(this.endsubs$))
                        .subscribe(
                            (po) => {
                                this.addSuccess = true;
                            },
                            (error) => {
                                console.log(error);
                                this.addSuccess = false;
                            }
                        );
                }
            }
            this._updateItem(updatePurchaseOrder);
            this.isLoading = false;
            this.updateSuccess = true;
            this.router.navigateByUrl('purchase-orders');
        } else {
            this._addPurchaseOrder();
            this.isLoading = false;
            this.form.reset();
            this.router.navigateByUrl('purchase-orders');
            this.addSuccess = true;
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

    private _addPurchaseOrder() {
        console.log('>>> GOT INTO ADD');
        const newPurchaseOrder: PurchaseOrder = {
            items: this.purchaseOrderItems,
            rfqId: this.form.get('rfq').value,
            dateReceived: this.form.get('dateReceived').value,
            due: this.form.get('due').value,
            description: this.form.get('description').value,
            status: this.form.get('status').value,
            clientId: this.form.get('client').value,
            buyerId: this.form.get('buyer').value,
            poNumber: this.form.get('poNumber').value,
            purchaseOrderDocumentUrl: this.form.get('purchaseOrderDocumentUrl').value,
        };
        console.log('>>> initialised ');

        console.log('>>> get values from controller', newPurchaseOrder);
        this.purchaseOrderService
            .createPurchaseOrder(newPurchaseOrder)
            .pipe(takeUntil(this.endsubs$))
            .subscribe(
                (purchaseOrder) => {
                    this.addSuccess = true;
                    console.log(purchaseOrder);
                    this.form.reset();
                },
                (error) => {
                    this.addSuccess = false;
                    console.log(error);
                }
            );
    }

    private _updateItem(purchaseOrderData: PurchaseOrder) {
        this.purchaseOrderService
            .updatePurchaseOrder(purchaseOrderData, this.currentPurchaseOrderId)
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
                this.currentPurchaseOrderId = params.id;
                this.purchaseOrderService
                    .getPurchaseOrderDetails(params.id)
                    .pipe(takeUntil(this.endsubs$))
                    .subscribe((purchaseOrders) => {
                        this.purchaseOrders = purchaseOrders;
                        this.poItems = purchaseOrders.items;
                        console.log("--- purchase orders ", this.purchaseOrders);
                        for (let r = 0; r < this.purchaseOrders.items.length; r++) {
                            console.log(">>>this.purchase.items", this.purchaseOrders.items);
                            this.purchaseOrderItemDetails.push({
                                poItemId: this.purchaseOrders.items[r].id,
                                itemId: this.purchaseOrders.items[r].item?.id,
                                supplierId: this.purchaseOrders.items[r].supplier?.id,
                                supplierName: this.purchaseOrders.items[r].supplier?.name,
                                name: this.purchaseOrders.items[r].item?.name,
                                quantity: this.purchaseOrders.items[r].quantity,
                                status: this.purchaseOrders.items[r].status,
                                priceQuoted: this.purchaseOrders.items[r].priceQuoted,
                                expectedArrivalDate: this.purchaseOrders.items[r].expectedArrivalDate,
                            });
                            this.purchaseOrderItems = this.purchaseOrderItemDetails;
                        }
                        //     //this.rfqItems = this.purchaseOrders.items;
                        console.log("this.purchaseOrderItems", this.purchaseOrderItems);
                        this.purchaseOrderForm.poNumber.setValue(this.purchaseOrders.poNumber);
                        this.purchaseOrderForm.dateReceived.setValue(this.purchaseOrders.dateReceived);
                        this.purchaseOrderForm.description.setValue(this.purchaseOrders.description);
                        this.purchaseOrderForm.due.setValue(this.purchaseOrders.due);
                        this.purchaseOrderForm.buyer.setValue(this.purchaseOrders.buyerId);
                        this.purchaseOrderForm.client.setValue(this.purchaseOrders.clientId);
                        this.purchaseOrderForm.rfq.setValue(this.purchaseOrders.rfqId);
                        this.purchaseOrderForm.purchaseOrderDocument.setValue(this.purchaseOrders.purchaseOrderDocumentUrl);
                        this.purchaseOrderForm.status.setValue(this.purchaseOrders.status);

                        this.dataSource = new MatTableDataSource(this.purchaseOrderItems);
                    });
            }
        });
    }

    get purchaseOrderForm() {
        return this.form.controls;
    }

    // Image Preview
    uploadPODocument(event) {
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({
            poDocument: file
        });
        this.form.get('poDocument').updateValueAndValidity();
        // File Preview
        const reader = new FileReader();
        reader.onload = () => {
            this.poDocumentPreview = reader.result as string;
        };
        reader.readAsDataURL(file);
    }
}
