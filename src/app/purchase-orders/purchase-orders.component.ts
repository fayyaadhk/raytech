import { Component } from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {Router} from "@angular/router";
import {FuseConfirmationService} from "../../@fuse/services/confirmation";
import {PurchaseOrder} from "../api/models/purchase-order";
import {PurchaseOrderService} from "./purchase-order.service";

@Component({
  selector: 'app-purchase-orders',
  templateUrl: './purchase-orders.component.html',
    styles: [
        /* language=SCSS */`
            .inventory-grid {
                grid-template-columns: 48px auto 40px;

                @screen sm {
                    grid-template-columns: 48px auto 112px 72px;
                }

                @screen md {
                    grid-template-columns: 48px 112px auto 112px 72px;
                }

                @screen lg {
                    grid-template-columns: 48px 112px auto 112px 96px 96px 72px;
                }
            }
        `
    ]
})
export class PurchaseOrdersComponent {

    purchaseOrders: any = [];
    endsubs$: Subject<any> = new Subject<any>();
    isLoading: boolean = false;
    dataSource: MatTableDataSource<PurchaseOrder>;
    displayedColumns = ['id', 'PONumber', 'RFQNumber', 'DateReceived', 'DateDue', 'itemCount', 'status', 'editDelete'];


    constructor(private purchaseOrderService: PurchaseOrderService,
                private router: Router,
                private fuseConfirmationService: FuseConfirmationService) {

    }

    ngOnInit(){
        this.isLoading = true;
        this._getPurchaseOrders();
    }

    createItem(){
        this.router.navigateByUrl('purchase-orders/form');
    }

    updateItem(itemId: string){
        this.router.navigateByUrl(`purchase-orders/form/${itemId}`);
    }

    deleteItem(itemId: number) {
        const confirmation = this.fuseConfirmationService.open({
            title: 'Delete Purchase Order',
            message: 'Are you sure you want to remove this Purchase Order? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete'
                }
            }
        });

        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if (result === 'confirmed') {
                this.purchaseOrderService.deletePurchaseOrder(itemId).pipe(takeUntil(this.endsubs$)).subscribe(() => {
                    this._getPurchaseOrders();
                });
            }
        });
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    private _getPurchaseOrders(){
        this.purchaseOrderService
            .getPurchaseOrders()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((purchaseOrders) => {
                this.purchaseOrders = purchaseOrders;
                this.dataSource = new MatTableDataSource(this.purchaseOrders);
                this.isLoading = false;
            });
    }
}
