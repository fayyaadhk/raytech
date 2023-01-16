import {ChangeDetectorRef, Component, Input} from '@angular/core';
import {BehaviorSubject, combineLatest, Subject, takeUntil} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {Client} from "../../api/models/client";
import {Rfq} from "../../rfq/rfq.model";
import {RfqService} from "../../rfq/rfq.service";
import {ClientService} from "../../client/client.service";
import {MatSelectChange} from "@angular/material/select";
import {MatSlideToggleChange} from "@angular/material/slide-toggle";

@Component({
    selector: 'app-job-tracker',
    templateUrl: './job-tracker.component.html',
    styleUrls: ['./job-tracker.component.scss']
})
export class JobTrackerComponent {

    @Input() rfqs: Rfq[];

    clients: Client[];
    filteredRfqs: Rfq[];
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

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _rfqService: RfqService,
        private _clientService: ClientService
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


        this.rfqs = this.filteredRfqs = this.rfqs;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Filter the courses
        combineLatest([this.filters.clientId$, this.filters.query$, this.filters.hideCompleted$])
            .subscribe(([clientSlug, query, hideCompleted]) => {

                // Reset the filtered courses
                this.filteredRfqs = this.rfqs;

                // Filter by category
                if (clientSlug !== 0) {
                    this.filteredRfqs = this.filteredRfqs.filter(rfq => rfq.clientId === clientSlug);
                }

                // Filter by search query
                if (query !== '') {
                    this.filteredRfqs = this.filteredRfqs.filter(rfq => rfq.rfqNumber.toLowerCase().includes(query.toLowerCase())
                        || rfq.description.toLowerCase().includes(query.toLowerCase())
                        || rfq.status.toLowerCase().includes(query.toLowerCase()));
                }

                // Filter by completed
                if (hideCompleted) {
                    this.filteredRfqs = this.filteredRfqs.filter(rfq => rfq.status !== 'ISSUED');
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

    getCountIncompleteRfqItems(rfq: Rfq): number {
        return rfq.items.filter(y => y.status === "QUOTATION RECEIVED").length;
    }

}
