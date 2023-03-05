import {Component, ViewChild} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {ActivatedRoute, Router} from "@angular/router";
import {FuseConfirmationService} from "../../@fuse/services/confirmation";
import {PurchaseOrder} from "../api/models/purchase-order";
import {PurchaseOrderService} from "./purchase-order.service";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {Rfq} from "../api/models/rfq";

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
    poStatus: string;

    purchaseOrders: any = [];
    endsubs$: Subject<any> = new Subject<any>();
    isLoading: boolean = false;
    dataSource: MatTableDataSource<PurchaseOrder>;
    displayedColumns = ['id', 'poNumber', 'rfqId', 'dateReceived', 'due', 'itemCount', 'status', 'editDelete'];

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private route: ActivatedRoute,
                private purchaseOrderService: PurchaseOrderService,
                private router: Router,
                private fuseConfirmationService: FuseConfirmationService) {
    }

    ngOnInit() {
        this.isLoading = true;
        this.route.queryParams
            .subscribe(params => {
                    this.poStatus = params.status;
                }
            );
        this._getPurchaseOrders(this.poStatus);
    }

    createPurchaseOrders() {
        this.router.navigateByUrl('purchase-orders/form');
    }

    updateItem(itemId: string) {
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
                    this._getPurchaseOrders(this.poStatus);
                });
            }
        });
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    private _getPurchaseOrders(status: string) {
        if (status != null) {
            this.purchaseOrderService
                .getPurchaseOrdersByStatus(status)
                .pipe(takeUntil(this.endsubs$))
                .subscribe((purchaseOrders) => {
                    this.purchaseOrders = purchaseOrders;
                    this.dataSource = new MatTableDataSource(this.purchaseOrders);
                    this.isLoading = false;
                });
        } else {
            this.purchaseOrderService
                .getPurchaseOrders()
                .pipe(takeUntil(this.endsubs$))
                .subscribe((purchaseOrders) => {
                    this.purchaseOrders = purchaseOrders;
                    this.dataSource = new MatTableDataSource(this.purchaseOrders);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    this.isLoading = false;
                });
        }
    }
    getItemsSummaryForPO(po: PurchaseOrder){
        let itemString: string[] = [];
        po.items.forEach(item =>{
            itemString.push(item.quantity + " x " + item.item.name);
        });
        return itemString.join(', ');
    }
}
