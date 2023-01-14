import {Component} from '@angular/core';
import {RfqService} from "../rfq/rfq.service";
import {DataSummaryService} from "./data-summary.service";
import {Rfq} from "../rfq/rfq.model";
import {BehaviorSubject, Observable, Subject, takeUntil} from "rxjs";
import {DashboardSummary} from "../api/models/dashboard-summary";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

    dashboardSummary: DashboardSummary;

    issuedRFQs: Rfq[];
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
