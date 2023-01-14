import { Component } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";
import {ItemService} from "../../item/item.service";
import {FuseConfirmationService} from "../../../@fuse/services/confirmation";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {CategoryService} from "../../category/category.service";
import {ItemClass} from "../../item/item.model";
import {PurchaseOrderService} from "../purchase-order.service";
import {PurchaseOrder} from "../../api/models/purchase-order";
import {ClientService} from "../../client/client.service";
import {RfqService} from "../../rfq/rfq.service";
import {MatTableDataSource} from "@angular/material/table";
import {RfqItem} from "../../api/models/rfq-item";
import {PurchaseOrderItem} from "../../api/models/purchase-order-item";
import {RfqItemComponent} from "../../rfq-item/rfq-item.component";
import {MatDialog} from "@angular/material/dialog";
import {Rfq} from "../../rfq/rfq.model";
import {UpdateRfqItem} from "../../api/models/update-rfq-item";
import {RfqModule} from "../../rfq/rfq.module";
import {CreateRfqItem} from "../../api/models/create-rfq-item";
import {PurchaseOrdersItemComponent} from "../purchase-orders-item/purchase-orders-item.component";
import {POStatus} from "../../data/purchase-order-status";

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
    displayedColumns = ['id', 'name', 'supplier', 'quantity', 'price', 'actions'];
    public purchaseOrderDetails: any = {};
    public purchaseOrderItemDetails: any = [];
    keys = Object.keys;
    poStatus = POStatus;
    poDocumentPreview: string;
    formFieldHelpers: string[] = [''];

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

    updatePurchaseOrderItem(rfqItemId: number, supplierId:number, rfqId: number, quantity: string, price: number, status: string) {

        const dialogRef = this.dialog.open(PurchaseOrdersItemComponent, {
            width: '600px',
            data: {
                rfqItemId: rfqItemId,
                itemId: rfqId,
                supplierId: supplierId,
                quantity: quantity,
                price: price,
                status: status
            },
        });

        dialogRef.afterClosed().subscribe(res => {
            console.log(">>> res", res);
            if (res.editMode) {

                this.purchaseOrderItems[res.rfqItemId] = res;

                this.dataSource = new MatTableDataSource(this.purchaseOrderItems);
                console.log(this.purchaseOrderItems);
            } else {
                this.purchaseOrderItems.push(res);
                this.dataSource = new MatTableDataSource(this.purchaseOrderItems);
            }
        })
    }

    removePurchaseOrderItem(purchaseOrderId: number) {
        this.purchaseOrderItems.splice(purchaseOrderId, 1);
        this.dataSource = new MatTableDataSource(this.purchaseOrderItems);
    }

    ngOnInit() {
        this._initForm();
        this._checkEditMode();
        this.isLoading = true;
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
            this._updateItem(updatePurchaseOrder);

            console.log('RFQS >>> ', this.purchaseOrders);
            for (let r = 0; r < this.purchaseOrderItems.length; r++) {
                console.log(this.purchaseOrderItems);
                console.log('edit mode ',this.purchaseOrderItems[r].editMode);
                if (this.purchaseOrderItems[r].editMode === true) {
                    const updateRfqItem: UpdateRfqItem = {
                        rfqItemId: this.purchaseOrders.items[r].id,
                        itemId: this.purchaseOrderItems[r].itemId,
                        quantity: this.purchaseOrderItems[r].quantity,
                        priceQuoted: this.purchaseOrderItems[r].price,
                        status: this.purchaseOrderItems[r].status
                    };
                    console.log('UPDATE RFQ ITEMS ', updateRfqItem);
                    this.rfqService
                        .updateRfqItem(updateRfqItem, this.purchaseOrders.items[r].id)
                        .pipe(takeUntil(this.endsubs$))
                        .subscribe(
                            (rfq: RfqModule) => {
                                this.updateSuccess = true;
                            },
                            () => {
                                this.updateSuccess = false;
                            }
                        );
                } else if(this.purchaseOrderItems[r].editMode === false){
                    const addRfqItem: CreateRfqItem = {
                        rfqId: this.currentPurchaseOrderId,
                        itemId: this.purchaseOrderItems[r].itemId,
                        quantity: this.purchaseOrderItems[r].quantity,
                        priceQuoted: this.purchaseOrderItems[r].price,
                        status: this.purchaseOrderItems[r].status
                    };
                    console.log('ADD RFQ ITEM', addRfqItem);
                    this.rfqService
                        .createRfqItem(addRfqItem)
                        .pipe(takeUntil(this.endsubs$))
                        .subscribe(
                            (rfq: RfqModule) => {
                                this.addSuccess = true;
                            },
                            () => {
                                this.addSuccess = false;
                            }
                        );
                }
            }
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
                        console.log("--- rfqs ", this.purchaseOrders);
                        if (this.purchaseOrders) {
                            this.purchaseOrderDetails = {
                                poNumber: this.purchaseOrders.poNumber,
                                dateReceived: this.purchaseOrders.dateReceived,
                                due: this.purchaseOrders.due,
                                description: this.purchaseOrders.description,
                                purchaseOrderDocument: this.purchaseOrders.purchaseOrderDocumentUrl,
                                client: this.purchaseOrders.clientId,
                                buyer: this.purchaseOrders.buyerId,
                                status: this.purchaseOrders.status
                            };
                        }

                        for (let r = 0; r < this.purchaseOrders.items.length; r++) {
                            console.log(">>>this.rfqs.items", this.purchaseOrders.items);
                            // this.rfqItems = this.rfqs.items;
                            this.purchaseOrderItemDetails.push({
                                rfqItemId: this.purchaseOrders.items[r].id,
                                itemId: this.purchaseOrders.items[r].item.id,
                                supplierId: this.purchaseOrders.items[r].supplierId,
                                name: this.purchaseOrders.items[r].item.name,
                                quantity: this.purchaseOrders.items[r].quantity,
                                status: this.purchaseOrders.items[r].status,
                                price: this.purchaseOrders.items[r].priceQuoted,
                            });
                            //
                            // console.log('rfqItemDetails before step 3', this.rfqItemDetails)
                            //
                            // this.setStep3 = {
                            //     rfqItems: this.rfqItemDetails[r],
                            //     quantity: this.purchaseOrders.items[r].quantity,
                            //     status: this.purchaseOrders.items[r].status,
                            //     price: this.purchaseOrders.items[r].priceQuoted,
                            //     itemForm: null
                            // };
                        }

                        this.purchaseOrderItems = this.purchaseOrderDetails;
                        //     //this.rfqItems = this.purchaseOrders.items;
                        console.log("this.rfqItems", this.purchaseOrderItems);
                        this.purchaseOrderForm.poNumber.setValue(this.purchaseOrders.poNumber);
                        this.purchaseOrderForm.description.setValue(this.purchaseOrders.description);
                        this.purchaseOrderForm.buyer.setValue(this.purchaseOrders.buyerId);
                        this.purchaseOrderForm.items.setValue(this.purchaseOrderItemDetails);
                        this.purchaseOrderForm.client.setValue(this.purchaseOrders.clientId);
                        this.purchaseOrderForm.rfq.setValue(this.purchaseOrders.rfqId);
                        //this.rfqForm.step3.setValue(this.setStep3);
                        this.dataSource = new MatTableDataSource(this.purchaseOrderItems);
                        //this.rfqForm.step3['rfqItems'].setValue(this.rfqItemDetails);
                        // this.rfqForm['step3']['status'].setValue(this.purchaseOrders.items.status);
                        // this.rfqForm['step3']['price'].setValue(this.purchaseOrders.priceQuoted);
                        // this.rfqForm['step3']['itemForm'].setValue(null);
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
