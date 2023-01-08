import {Component, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {MatTableDataSource} from '@angular/material/table';
import {ItemClass} from "../item/item.model";
import {ItemService} from "../item/item.service";
import {Router} from "@angular/router";
import {FuseConfirmationService} from "../../@fuse/services/confirmation";
import {CommodityService} from "./commodity.service";
import {Commodity} from "./commodity.model";

@Component({
  selector: 'app-commodity',
  templateUrl: './commodity.component.html',
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
export class CommodityComponent implements OnInit{
    commodities: any = [];
    endsubs$: Subject<any> = new Subject<any>();
    isLoading: boolean = false;
    dataSource: MatTableDataSource<Commodity>;
    displayedColumns = ['name', 'editDelete'];

    constructor(private commodityService: CommodityService,
                private router: Router,
                private fuseConfirmationService: FuseConfirmationService) {

    }

    ngOnInit(){
        this.isLoading = true;
        this._getCommodities();
    }

    createCommodity(){
        this.router.navigateByUrl('commodities/form');
    }

    updateCommodity(commodityId: string){
        this.router.navigateByUrl(`commodities/form/${commodityId}`);
    }

    deleteCommodity(commodityId: string) {
        const confirmation = this.fuseConfirmationService.open({
            title: 'Delete client',
            message: 'Are you sure you want to remove this client? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete'
                }
            }
        });

        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if (result === 'confirmed') {
                this.commodityService.deleteCommodity(commodityId).pipe(takeUntil(this.endsubs$)).subscribe(() => {
                    this._getCommodities();
                });
            }
        });
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    private _getCommodities(){
        this.commodityService
            .getCommodities()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((commodities) => {
                this.commodities = commodities;
                this.dataSource = new MatTableDataSource(this.commodities);
                this.isLoading = false;
            });
    }
}
