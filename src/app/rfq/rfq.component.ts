import {Component, OnInit, ViewChild} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {RfqService} from './rfq.service';
import {MatTableDataSource} from '@angular/material/table';
import {Rfq} from '../api/models/rfq';
import {FuseConfirmationService} from "../../@fuse/services/confirmation";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {RfqStatus} from "../data/rfq-status";

@Component({
    selector: 'app-rfq',
    templateUrl: './rfq.component.html',
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
    ],
})
export class RfqComponent implements OnInit {
    rfqStatus: string;
    rfqs: any = [];
    endsubs$: Subject<any> = new Subject<any>();
    isLoading: boolean = false;
    dataSource: MatTableDataSource<Rfq>;
    displayedColumns = ['id', 'rfqNumber', 'status', 'due', 'type', 'itemCount', 'editDelete'];

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private route: ActivatedRoute,
                private rfqService: RfqService,
                private router: Router,
                private fuseConfirmationService: FuseConfirmationService) {

    }

    ngOnInit() {
        this.isLoading = true;
        this.route.queryParams
            .subscribe(params => {
                    this.rfqStatus = params.status;
                }
            );
        this._getRfqs(this.rfqStatus);
    }

    createRfq() {
        this.router.navigateByUrl('rfqs/form');
    }

    updateRfq(rfqId: string) {
        this.router.navigateByUrl(`rfqs/form/${rfqId}`);
    }

    viewRfq(rfqId: string) {
        this.router.navigateByUrl(`rfqs/details/${rfqId}`);
    }

    deleteRfq(rfqId: string) {
        const confirmation = this.fuseConfirmationService.open({
            title: 'Delete RFQ',
            message: 'Are you sure you want to remove this RFQ? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete'
                }
            }
        });

        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if (result === 'confirmed') {
                this.rfqService.deleteRfq(rfqId).pipe(takeUntil(this.endsubs$)).subscribe(() => {
                    this._getRfqs(this.rfqs);
                });
            }
        });
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    private _getRfqs(status: string) {
        if (status != null) {
            this.rfqService
                .getRfqsByStatus(status)
                .pipe(takeUntil(this.endsubs$))
                .subscribe((rfqs) => {
                    this.rfqs = rfqs.sort((a,b) => 0 - (a.id > b.id ? 1 : -1));
                    this.dataSource = new MatTableDataSource(this.rfqs);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    this.isLoading = false;
                });
        } else {
            this.rfqService
                .getRfqs()
                .pipe(takeUntil(this.endsubs$))
                .subscribe((rfqs) => {
                    this.rfqs = rfqs;
                    this.dataSource = new MatTableDataSource(this.rfqs);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    this.isLoading = false;
                });
        }
    }

    getItemsSummaryForRfq(rfq: Rfq){
        let itemString: string[] = [];
        rfq.items.forEach(item =>{
            itemString.push(item.quantity + " x " + item.item.name);
        });
        return itemString.join(', ');
    }
}
