import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Rfq} from "../../rfq/rfq.model";
import {Client} from "../../api/models/client";
import {BehaviorSubject, combineLatest, Subject, takeUntil} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {RfqService} from "../../rfq/rfq.service";
import {ClientService} from "../../client/client.service";
import {MatSelectChange} from "@angular/material/select";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";
import {PurchaseOrder} from "../../api/models/purchase-order";
import {UpdateRfqItemStatusComponent} from "../../rfq/update-rfq-item-status/update-rfq-item-status.component";
import {MatDialog} from "@angular/material/dialog";
import {UpdatePoItemComponent} from "../../purchase-orders/update-po-item/update-po-item.component";
import {DataSummaryService} from "../data-summary.service";
import {DashboardSummary} from "../../api/models/dashboard-summary";

@Component({
  selector: 'app-po-job-tracker',
  templateUrl: './po-job-tracker.component.html',
  styleUrls: ['./po-job-tracker.component.scss']
})
export class PoJobTrackerComponent implements OnInit {

    @Input() purchaseOrders: PurchaseOrder[];

    clients: Client[];
    filteredPurhcaseOrders: PurchaseOrder[];
    filters: {
        clientId$: BehaviorSubject<number>;
        query$: BehaviorSubject<string>;
        hideCompleted$: BehaviorSubject<boolean>;
    } = {
        clientId$: new BehaviorSubject(0),
        query$: new BehaviorSubject(''),
        hideCompleted$: new BehaviorSubject(false)
    };

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    dashboardSummary: DashboardSummary;

    isLoading = false;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _rfqService: RfqService,
        private dialog: MatDialog,
        private _clientService: ClientService,
        private _dataSummaryService: DataSummaryService

    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the categories
        this._clientService.getClients()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((clients: Client[]) => {
                this.clients = clients;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });


        this.purchaseOrders = this.filteredPurhcaseOrders = this.purchaseOrders;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Filter the courses
        combineLatest([this.filters.clientId$, this.filters.query$, this.filters.hideCompleted$])
            .subscribe(([clientSlug, query, hideCompleted]) => {

                // Reset the filtered courses
                this.filteredPurhcaseOrders = this.purchaseOrders;

                // Filter by category
                if (clientSlug !== 0) {
                    this.filteredPurhcaseOrders = this.filteredPurhcaseOrders.filter(po => po.clientId === clientSlug);
                }

                // Filter by search query
                if (query !== '') {
                    this.filteredPurhcaseOrders = this.filteredPurhcaseOrders.filter(po => po.poNumber.toLowerCase().includes(query.toLowerCase())
                        || po.description.toLowerCase().includes(query.toLowerCase())
                        || po.status.toLowerCase().includes(query.toLowerCase()));
                }

                // Filter by completed
                if (hideCompleted) {
                    this.filteredPurhcaseOrders = this.filteredPurhcaseOrders.filter(rfq => rfq.status !== 'ISSUED');
                }
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Filter by search query
     *
     * @param query
     */
    filterByQuery(query: string): void {
        this.filters.query$.next(query);
    }

    /**
     * Filter by category
     *
     * @param change
     */
    filterByClient(change: MatSelectChange): void {
        this.filters.clientId$.next(change.value);
    }

    /**
     * Show/hide completed courses
     *
     * @param change
     */
    toggleCompleted(change: MatSlideToggleChange): void {
        this.filters.hideCompleted$.next(change.checked);
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

    getCountIncompleteRfqItems(po: PurchaseOrder): number {
        return po.items.filter(y => y.status === "QUOTATION RECEIVED").length;
    }

    openStatusDialog(poItemId: number, status: string) {

        const dialogRef = this.dialog.open(UpdatePoItemComponent, {
            data: {rfqItemId: poItemId, status: status},
        });

        dialogRef.afterClosed().subscribe(res => {
            // received data from dialog-component
            if (res && res.updated) {
                this.isLoading = true;

                this._dataSummaryService.getSummary()
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe((data) => {

                        // Store the data
                        this.dashboardSummary = data;
                        this.filteredPurhcaseOrders = this.dashboardSummary.issuedPOs.concat(this.dashboardSummary.inProgressPOs);
                        this.purchaseOrders = this.filteredPurhcaseOrders = this.purchaseOrders;
                        this._changeDetectorRef.markForCheck();
                        this.isLoading = false;
                        // Store the table data

                        // Prepare the chart data
                    });

            }
        })
    }
}
