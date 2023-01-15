import { Component, OnInit } from '@angular/core';
import {DashboardSummary} from "../../api/models/dashboard-summary";
import {Rfq} from "../../rfq/rfq.model";
import {Subject, takeUntil} from "rxjs";
import {DataSummaryService} from "../data-summary.service";
import {PurchaseOrder} from "../../api/models/purchase-order";

@Component({
  selector: 'app-purchase-order-dashboard',
  templateUrl: './purchase-order-dashboard.component.html',
  styleUrls: ['./purchase-order-dashboard.component.scss']
})
export class PurchaseOrderDashboardComponent implements OnInit {

    dashboardSummary: DashboardSummary;

    issuedPOs: PurchaseOrder[];
    isLoading: boolean = true;


    private _unsubscribeAll: Subject<any> = new Subject<any>();


    /**
     * Constructor
     */
    constructor(private _dataSummaryService: DataSummaryService) {
    }

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the data
        this.isLoading = true;

        this._dataSummaryService.getSummary()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) => {

                // Store the data
                console.log(">>>this.data", data);
                this.dashboardSummary = data;
                console.log(">>>this.dashboardSummary", this.dashboardSummary);

                this.isLoading = false;
                // Store the table data

                // Prepare the chart data
            });
    }

}
