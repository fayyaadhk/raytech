import {Component, ViewChild} from '@angular/core';
import {SupplierItem} from "../../api/models/supplier-item";
import {Subject, takeUntil} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {ActivatedRoute} from "@angular/router";
import {PurchaseOrder} from "../../api/models/purchase-order";
import {PurchaseOrderService} from "../purchase-order.service";
import {RfqService} from "../../rfq/rfq.service";
import {Rfq} from "../../rfq/rfq.model";
import {MatSort} from "@angular/material/sort";
import {RfqItem} from "../../api/models/rfq-item";
import {EditRFQItemComponent} from "../../rfq/edit-rfqitem/edit-rfqitem.component";
import {MatDialog} from "@angular/material/dialog";
import {PurchaseOrderItem} from "../../api/models/purchase-order-item";
import {EditPurchaseOrderItemComponent} from "../edit-purchase-order-item/edit-purchase-order-item.component";

@Component({
  selector: 'app-purchase-order-detail',
  templateUrl: './purchase-order-detail.component.html',
  styleUrls: ['./purchase-order-detail.component.scss']
})
export class PurchaseOrderDetailComponent {
    @ViewChild('poItemsTable', {read: MatSort}) poItemsTableMatSort: MatSort;

    poId: number;
    purchaseOrder: PurchaseOrder;
    rfq: Rfq;
    itemSuppliers: SupplierItem[] = [];

    data: any;

    endsubs$: Subject<any> = new Subject<any>();
    isLoading: boolean = false;

    purchaseOrderItemsDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
    purchaseOrderItemsTableColumns: string[] = ['poItemId', 'id', 'name', 'sku', 'quantity', 'price', 'supplier', 'status', 'actions'];

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(private dialog: MatDialog, private route: ActivatedRoute, private purchaseOrderService: PurchaseOrderService, private rfqService: RfqService)
    {
    }

    ngOnInit(){
        this.route.params.pipe(takeUntil(this.endsubs$)).subscribe(params => {
            this.poId = params.id;
            console.log(">>> init this.poId: ", this.poId);
        });
        this.isLoading = true;
        this._getPurchaseOrder();
    }

    private _getPurchaseOrder(){
        this.purchaseOrderService
            .getPurchaseOrderDetails(this.poId)
            .pipe(takeUntil(this.endsubs$))
            .subscribe((purchaseOrder) => {
                this.purchaseOrder = purchaseOrder;
                console.log("this.purchaseOrder", this.purchaseOrder)
                this.purchaseOrderItemsDataSource = new MatTableDataSource(this.purchaseOrder.items);
                this._getRfq();

                this.isLoading = false;
            });
    }

    private _getRfq(){
        this.rfqService
            .getRfq(this.purchaseOrder.rfqId)
            .pipe(takeUntil(this.endsubs$))
            .subscribe((rfq) => {
                this.rfq = rfq;
                console.log("this.rfq", this.rfq)
                this.isLoading = false;
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFnIS(index: number, item: any): any
    {
        return item.id || index;
    }

    openDialog(poItem) {

        console.log(">> poItem before poItemToUpdate", poItem);

        const poItemToUpdate: PurchaseOrderItem = {
            purchaseOrderId: poItem.purchaseOrderId,
            id: poItem.id,
            priceQuoted: poItem.price,
            status: poItem.status,
            quantity: poItem.quantity,
            expectedArrivalDate: poItem.expectedArrivalDate,
            supplier: poItem.supplier,
            item: poItem.item
        }
        console.log(">> poItemToUpdate", poItemToUpdate);

        const dialogRef = this.dialog.open(EditPurchaseOrderItemComponent, {
            width: '600px',
            data: poItemToUpdate,
        });

        dialogRef.afterClosed().subscribe(res => {
            console.log(">>> res", res);

            // received data from dialog-component
            if (res.updated) {
                console.log("calling this._getPurchaseOrder()")
                this._getPurchaseOrder();
            }
        })
    }


    deletePOItem(id: number) {

    }
}
