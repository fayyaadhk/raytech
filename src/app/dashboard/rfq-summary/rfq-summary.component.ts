import {Component, Input, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Subject, takeUntil} from 'rxjs';
import {MatSort} from "@angular/material/sort";
import {RfqService} from "../../rfq/rfq.service";
import {Rfq} from "../../rfq/rfq.model";

@Component({
    selector: 'app-rfq-summary',
    templateUrl: './rfq-summary.component.html',
    styleUrls: ['./rfq-summary.component.scss']
})
export class RfqSummaryComponent {

    @Input() issuedRFQs: Rfq[] = [];
    @Input() sourcingRFQs: Rfq[] = [];
    @Input() closingSoonRFQs: Rfq[] = [];
    @Input() inProgressRFQs: Rfq[] = [];
    @Input() pendingSubmissionRFQs: Rfq[] = [];

    @ViewChild('issuedRFQTable', {read: MatSort}) issuedRFQTableMatSort: MatSort;

    issuedRFQDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
    issuedRFQTableColumns: string[] = ['rfqId', 'rfqNo', 'created', 'due', 'type', 'itemCount', 'status'];

    @ViewChild('sourcingRFQTable', {read: MatSort}) sourcingRFQTableMatSort: MatSort;

    sourcingRFQDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
    sourcingRFQTableColumns: string[] = ['rfqId', 'rfqNo', 'created', 'due', 'type', 'itemCount', 'status'];

    @ViewChild('closingSoonRFQTable', {read: MatSort}) closingSoonRFQTableMatSort: MatSort;

    closingSoonRFQDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
    closingSoonRFQTableColumns: string[] = ['rfqId', 'rfqNo', 'created', 'due', 'type', 'itemCount', 'status'];

    /**
     * After view init
     */
    ngAfterViewInit(): void {
        // Make the data source sortable
        this.issuedRFQDataSource.sort = this.issuedRFQTableMatSort;
        this.closingSoonRFQDataSource.sort = this.closingSoonRFQTableMatSort;
        this.sourcingRFQDataSource.sort = this.sourcingRFQTableMatSort;
    }


    /**
     * On init
     */
    ngOnInit(): void {
        // Get the data
        this.issuedRFQDataSource.data = this.issuedRFQs;

        this.closingSoonRFQDataSource.data = this.closingSoonRFQs;
        this.sourcingRFQDataSource.data = this.sourcingRFQs;
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
