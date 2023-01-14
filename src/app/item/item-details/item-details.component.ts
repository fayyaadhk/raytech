import {Component, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Subject, takeUntil} from "rxjs";
import {ItemService} from "../item.service";
import {ActivatedRoute} from "@angular/router";
import {Item} from "../../api/models/item";
import {ItemSupplier} from "../../api/models/item-supplier";
import {SupplierItem} from "../../api/models/supplier-item";
import {DetailedItem} from "../../api/models/detailed-item";
import {MatSort} from "@angular/material/sort";

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
    rfqItemsTableColumns: string[] = ['rfqId', 'rfqNumber', 'rfqDate', 'quantity', 'priceQuoted', 'supplier', 'status', 'actions'];

    poItemsDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
    poItemsTableColumns: string[] = ['poId', 'poNumber', 'poDate', 'quantity', 'priceQuoted', 'supplier', 'status', 'actions'];

    itemSuppliersDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
    itemSuppliersTableColumns: string[] = ['supplierName', 'price', 'dateQuoted', 'actions'];

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(private route: ActivatedRoute, private itemService: ItemService)
    {
    }

    ngOnInit(){
        this.route.params.pipe(takeUntil(this.endsubs$)).subscribe(params => {
           this.itemId = params.id;
           console.log(">>> init this.itemId: ", this.itemId);
        });
        this.isLoading = true;
        this._getItem();
        this._getItemSuppliers();
    }

    private _getItem(){
        this.itemService
            .getItemWithAllDetails(this.itemId)
            .pipe(takeUntil(this.endsubs$))
            .subscribe((item) => {
                this.item = item;
                console.log("this.item", this.item)
                this.rfqItemsDataSource = new MatTableDataSource(this.item.rfqItems);
                this.poItemsDataSource = new MatTableDataSource(this.item.purchaseOrderItems);
                this.isLoading = false;
            });
    }

    private _getItemSuppliers(){
        this.itemService
            .getItemSuppliers(this.itemId)
            .pipe(takeUntil(this.endsubs$))
            .subscribe((itemSuppliers) => {
                this.itemSuppliers = itemSuppliers;
                console.log(">>> this.itemSuppliers", this.itemSuppliers);
                this.itemSuppliersDataSource = new MatTableDataSource(this.itemSuppliers);
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
        return item.rfqItemId || index;
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

}
