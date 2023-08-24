import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Rfq} from "../../rfq/rfq.model";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {PurchaseOrder} from "../../api/models/purchase-order";

@Component({
  selector: 'app-purchase-order-summary',
  templateUrl: './purchase-order-summary.component.html',
  styleUrls: ['./purchase-order-summary.component.scss']
})
export class PurchaseOrderSummaryComponent implements OnInit {

    @Input() issuedPOs: PurchaseOrder[] = [];
    @Input() pendingDeliveryPOs: PurchaseOrder[] = [];
    @Input() inProgressPOs: PurchaseOrder[] = [];
    @Input() invoicedPOs: PurchaseOrder[] = [];
    @Input() completedPOs: PurchaseOrder[] = [];
    @Input() closingSoonPOs: PurchaseOrder[] = [];

    @ViewChild('issuedPOTable', {read: MatSort}) issuedPOTableMatSort: MatSort;

    issuedPODataSource: MatTableDataSource<any> = new MatTableDataSource([]);
    issuedPOTableColumns: string[] = ['poId', 'poNo', 'created', 'due', 'itemCount', 'status'];

    @ViewChild('dueSoonPOTable', {read: MatSort}) dueSoonPOTableMatSort: MatSort;

    dueSoonPODataSource: MatTableDataSource<any> = new MatTableDataSource([]);
    dueSoonPOTableColumns: string[] = ['poId', 'poNo', 'created', 'due', 'itemCount', 'status'];

    @ViewChild('closingSoonRFQTable', {read: MatSort}) closingSoonRFQTableMatSort: MatSort;

    /**
     * After view init
     */
    ngAfterViewInit(): void {
        // Make the data source sortable
        this.issuedPODataSource.sort = this.issuedPOTableMatSort;
        this.dueSoonPODataSource.sort = this.dueSoonPOTableMatSort;
    }


    /**
     * On init
     */
    ngOnInit(): void {
        // Get the data
        this.issuedPODataSource.data = this.issuedPOs;
        this.dueSoonPODataSource.data = this.closingSoonPOs;
    }


    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

}
