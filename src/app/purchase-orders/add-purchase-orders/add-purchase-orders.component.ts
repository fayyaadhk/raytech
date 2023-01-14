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
    rfqs: any = null;
    categories: any = null;
    purchaseOrderItems: any = [];
    dataSource: MatTableDataSource<PurchaseOrderItem>;
    displayedColumns = ['id', 'name', 'quantity', 'price', 'actions'];

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

        const dialogRef = this.dialog.open(RfqItemComponent, {
            width: '600px',
            data: {modalTitle: 'Add New RFQ Item'},
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

    updatePurchaseOrderItem(rfqItemId: number, rfqId: number, quantity: string, price: number, status: string) {

        const dialogRef = this.dialog.open(RfqItemComponent, {
            width: '600px',
            data: {
                rfqItemId: rfqItemId,
                itemId: rfqId,
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
        const updatePurchaseOrder: PurchaseOrder = new PurchaseOrder();
        updatePurchaseOrder.poNumber = this.form.get('poNumber').value;
        updatePurchaseOrder.dateReceived = this.form.get('dateReceived').value;
        updatePurchaseOrder.due = this.form.get('due').value;
        updatePurchaseOrder.description = this.form.get('description').value;
        updatePurchaseOrder.buyerId = this.form.get('buyer').value;
        updatePurchaseOrder.clientId = this.form.get('client').value;
        updatePurchaseOrder.purchaseOrderDocumentUrl = this.form.get('purchaseOrderDocumentUrl').value;
        updatePurchaseOrder.status = this.form.get('status').value;
        updatePurchaseOrder.items = this.form.get('itemForm').value;
        if (this.editmode) {
            this._updateItem(updatePurchaseOrder);
            this.isLoading = false;
            // this.location.back();
        } else {
            this._addItem();
            this.isLoading = false;
            this.router.navigateByUrl('items');
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

    private _addItem() {
        console.log('>>> GOT INTO ADD');
        const newPurchaseOrder: PurchaseOrder = new PurchaseOrder();
        console.log('>>> initialised ');

        console.log('>>> get values from controller', newPurchaseOrder);
        this.purchaseOrderService
            .createPurchaseOrder(newPurchaseOrder)
            .pipe(takeUntil(this.endsubs$))
            .subscribe(
                (client) => {
                    this.addSuccess = true;
                    console.log(client);
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
        console.log("HERE");
        this.route.params.pipe(takeUntil(this.endsubs$)).subscribe((params) => {
            if (params.id) {
                this.editmode = true;
                this.currentPurchaseOrderId = params.id;
                this.purchaseOrderService
                    .getPurchaseOrder(params.id)
                    .pipe(takeUntil(this.endsubs$))
                    .subscribe((purchaseOrder) => {
                        this.purchaseOrder = purchaseOrder;
                        // this.itemForm.name.setValue(item.name);
                        // this.itemForm.description.setValue(item.description);
                        // this.itemForm.shortDescription.setValue(item.shortDescription);
                        // this.itemForm.sku.setValue(item.sku);
                        // this.itemForm.rrsp.setValue(item.rrsp);
                        // this.itemForm.thumbnail.setValue(item.thumbnail);
                        // this.itemForm.category.setValue(item.categoryId);
                        // this.itemForm.brand.setValue(item.brandId);

                        // this.clientForm.buyer.setValue(client.buyer);
                        console.log('HERE1', this.purchaseOrder);
                    });
            }
        });
    }

    get purchaseOrderForm() {
        return this.form.controls;
    }
}
