import { Component, OnInit } from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {ClientService} from "../client/client.service";
import {Router} from "@angular/router";
import {ItemService} from "./item.service";
import {MatTableDataSource} from "@angular/material/table";
import {ItemClass} from './item.model';
import {FuseConfirmationService} from "../../@fuse/services/confirmation";

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
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
export class ItemComponent implements OnInit {
    items: any = [];
    endsubs$: Subject<any> = new Subject<any>();
    isLoading: boolean = false;
    dataSource: MatTableDataSource<ItemClass>;
    displayedColumns = ['id', 'name', 'shortDescription', 'category', 'editDelete'];


    constructor(private itemService: ItemService,
                private router: Router,
                private fuseConfirmationService: FuseConfirmationService) {

    }

    ngOnInit(){
        this.isLoading = true;
        this._getItems();
    }

    createItem(){
        this.router.navigateByUrl('items/form');
    }

    updateItem(itemId: string){
        this.router.navigateByUrl(`items/form/${itemId}`);
    }

    deleteItem(itemId: string) {
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
                this.itemService.deleteItem(itemId).pipe(takeUntil(this.endsubs$)).subscribe(() => {
                    this._getItems();
                });
            }
        });
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    private _getItems(){
        this.itemService
            .getItems()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((items) => {
                this.items = items;
                this.dataSource = new MatTableDataSource(this.items);
                this.isLoading = false;
            });
    }
}
