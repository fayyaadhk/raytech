import {Component, OnInit, ViewChild} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {RfqItem} from "../../api/models/rfq-item";
import {RfqService} from "../../rfq/rfq.service";
import {ActivatedRoute} from "@angular/router";
import {ClientService} from "../client.service";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss']
})
export class ClientDetailsComponent implements OnInit{
    clients: any;
    endsubs$: Subject<any> = new Subject();
    isLoading: boolean = false;

    currentClientId: string;
    client: any;

    formFieldHelpers: string[] = [''];
    form: FormGroup;

    dataSource: MatTableDataSource<RfqItem>;
    displayedColumns = [
        'id',
        'rfqNumber',
        'dateCreated',
        //'description',
        'due',
        'status'
    ];


    RFQDataSource: MatTableDataSource<any> = new MatTableDataSource([]);
    RFQTableColumns: string[] = ['rfqId', 'rfqNo', 'created', 'due', 'status'];
    @ViewChild('RFQTable', {read: MatSort}) RFQTableMatSort: MatSort;

    PODataSource: MatTableDataSource<any> = new MatTableDataSource([]);
    POTableColumns: string[] = ['rfqId', 'rfqNo', 'created', 'due', 'status'];
    @ViewChild('POTable', {read: MatSort}) POTableMatSort: MatSort;



    items = [];

    statuses: any = [
        {id: 1, name: 'Issued'},
        {id: 2, name: 'Sourcing'},
        {id: 3, name: 'Could not source'},
        {id: 4, name: 'In progress'},
        {id: 5, name: 'Pending submission'},
        {id: 6, name: 'Quotation sent'},
        {id: 7, name: 'Successful'},
        {id: 8, name: 'Unsuccessful'},
        {id: 9, name: 'Cancelled'},
    ];

    constructor(private clientService: ClientService,
                private formBuilder: FormBuilder,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.isLoading = true;
        this._getRfqDetails();
    }

    private _getRfqDetails() {
        this.route.params.pipe(takeUntil(this.endsubs$)).subscribe((params) => {
            console.log(params);
            if (params.id) {
                this.currentClientId = params.id;
                this.clientService
                    .getClientDetails(this.currentClientId)
                    .pipe(takeUntil(this.endsubs$))
                    .subscribe((client) => {
                        this.clients = client;
                        console.log(this.clients);
                        console.log(">>> RFQs", this.clients.rfQs);
                        console.log(">>> RFQs", this.clients.purchaseOrders);

                        this.RFQDataSource.data = this.clients.rfQs;
                        this.PODataSource.data = this.clients.purchaseOrders;

                        this.isLoading = false;
                    });
            }
        });
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

    /**
     * After view init
     */
    ngAfterViewInit(): void {
        // Make the data source sortable
        this.RFQDataSource.sort = this.RFQTableMatSort;
        this.PODataSource.sort = this.POTableMatSort;
    }

}
