import {Component, OnInit} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {Router} from '@angular/router';
import {RfqService} from './rfq.service';
import {MatTableDataSource} from '@angular/material/table';
import {Rfq} from '../api/models/rfq';

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
    rfqs: any = [];
    endsubs$: Subject<any> = new Subject<any>();
    isLoading: boolean = false;
    dataSource: MatTableDataSource<Rfq>;
    displayedColumns = ['rfqId', 'rfqNo', 'status', 'due', 'itemCount', 'editDelete'];

    constructor(private rfqService: RfqService,
                private router: Router,) {

    }

    ngOnInit() {
        this.isLoading = true;
        this._getRfqs();
    }

    createRfq() {
        this.router.navigateByUrl('rfqs/form');
    }

    updateRfq(rfqId: string) {
        this.router.navigateByUrl(`rfqs/form/${rfqId}`);
    }

    viewRfq(rfqId: string){
        this.router.navigateByUrl(`rfqs/details/${rfqId}`);
    }

    deleteRfq(rfqId: string) {
        this.rfqService.deleteRfq(rfqId).pipe(takeUntil(this.endsubs$)).subscribe(() => {
            this._getRfqs();
        });
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    private _getRfqs() {
        this.rfqService
            .getRfqs()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((rfqs) => {
                this.rfqs = rfqs;
                this.dataSource = new MatTableDataSource(this.rfqs);
                this.isLoading = false;
            });
    }
}
