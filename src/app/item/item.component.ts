import { Component, OnInit } from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {ClientService} from "../client/client.service";
import {Router} from "@angular/router";
import {ItemService} from "./item.service";

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

    constructor(private itemService: ItemService,
                private router: Router,) {

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

    deleteItem(itemId: string){
        this.itemService.deleteItem(itemId).pipe(takeUntil(this.endsubs$)).subscribe(() => {
            this._getItems();
        });
    }

    private _getItems(){
        this.itemService
            .getItems()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((items) => {
                this.items = items;
                this.isLoading = false;
            });
    }
}
