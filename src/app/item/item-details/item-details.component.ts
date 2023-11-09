import {Component, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Subject, takeUntil} from "rxjs";
import {ItemService} from "../item.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Item} from "../../api/models/item";
import {ItemSupplier} from "../../api/models/item-supplier";
import {SupplierItem} from "../../api/models/supplier-item";
import {DetailedItem} from "../../api/models/detailed-item";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {CreatePOFromRFQComponent} from "../../rfq/rfq-details/create-pofrom-rfq/create-pofrom-rfq.component";
import {AddItemSupplierComponent} from "../add-item-supplier/add-item-supplier.component";
import {FuseConfirmationService} from "../../../@fuse/services/confirmation";
import {DetailedRfqItem} from "../../api/models/detailed-rfq-item";
import {EditItemSupplierComponent} from "../edit-item-supplier/edit-item-supplier.component";

@Component({
    selector: 'app-item-details',
    templateUrl: './item-details.component.html',
    styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent {
    @ViewChild('rfqItemsTable', {read: MatSort}) rfqItemsTableMatSort: MatSort;

    itemId: number;
    item: DetailedItem;
    itemSuppliers: SupplierItem[] = [];

    data: any;

    endsubs$: Subject<any> = new Subject<any>();
    isLoading: boolean = false;

    rfqItemsDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
    rfqItemsTableColumns: string[] = ['rfqId', 'rfqNumber', 'rfqDate', 'quantity', 'priceQuoted', 'supplier', 'markup', 'status'];

    poItemsDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
    poItemsTableColumns: string[] = ['poId', 'poNumber', 'poDate', 'quantity', 'priceQuoted', 'supplier', 'status'];

    itemSuppliersDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
    itemSuppliersTableColumns: string[] = ['supplierName', 'price', 'dateQuoted', 'supplierItemCode', 'supplierDescription', 'actions'];

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(private route: ActivatedRoute, private itemService: ItemService, private router: Router,
                private dialog: MatDialog, private fuseConfirmationService: FuseConfirmationService) {
    }

    ngOnInit() {
        this.route.params.pipe(takeUntil(this.endsubs$)).subscribe(params => {
            this.itemId = params.id;
        });
        this.isLoading = true;
        this._getItem();
        this._getItemSuppliers();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.rfqItemId || index;
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFnIS(index: number, item: any): any {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    private _getItem() {
        this.itemService
            .getItemWithAllDetails(this.itemId)
            .pipe(takeUntil(this.endsubs$))
            .subscribe((item) => {
                this.item = item;
                this.rfqItemsDataSource = new MatTableDataSource(this.item.rfqItems);
                this.poItemsDataSource = new MatTableDataSource(this.item.purchaseOrderItems);
                this.isLoading = false;
            });
    }

    private _getItemSuppliers() {
        this.itemService
            .getItemSuppliers(this.itemId)
            .pipe(takeUntil(this.endsubs$))
            .subscribe((itemSuppliers) => {
                this.itemSuppliers = itemSuppliers;
                this.itemSuppliersDataSource = new MatTableDataSource(this.itemSuppliers);
                this.isLoading = false;
            });
    }

    openAddSupplierDialog() {

        const dialogRef = this.dialog.open(AddItemSupplierComponent, {
            width: '600px',
            data: this.item.id,
        });

        dialogRef.afterClosed().subscribe(res => {
            // received data from dialog-component
            if (res && res.added) {
                this._getItemSuppliers();
            }
        })
    }

    openUpdateSupplierDialog(itemSupplier: any) {

        const dialogRef = this.dialog.open(EditItemSupplierComponent, {
            width: '600px',
            data: itemSupplier,
        });

        dialogRef.afterClosed().subscribe(res => {
            // received data from dialog-component
            if (res && res.updated) {
                this._getItemSuppliers();
            }
        })
    }


    deleteItem(itemId: number) {
        const confirmation = this.fuseConfirmationService.open({
            title: 'Delete item',
            message: 'Are you sure you want to remove this item? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete'
                }
            }
        });

        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if (result === 'confirmed') {
                this.itemService.deleteItem(itemId).pipe(takeUntil(this.endsubs$)).subscribe(() => {
                    this.router.navigateByUrl(`items`);
                });
            }
        });
    }


    deleteItemSupplier(itemSupplierId: number) {
        const confirmation = this.fuseConfirmationService.open({
            title: 'Delete item',
            message: 'Are you sure you want to remove this item supplier? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete'
                }
            }
        });

        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if (result === 'confirmed') {
                this.itemService.deleteItemSupplier(itemSupplierId).pipe(takeUntil(this.endsubs$)).subscribe(() => {
                    this._getItemSuppliers();
                });
            }
        });
    }

    getSupplierPriceForItem(rfqItem: DetailedRfqItem){
        return rfqItem.supplier?.supplierItems?.find(x => x.itemId == this.itemId).price;
    }

    getMarkup(rfqItem: DetailedRfqItem){
        return  (this.getSupplierPriceForItem(rfqItem) / rfqItem.priceQuoted) * 100;
    }

}
