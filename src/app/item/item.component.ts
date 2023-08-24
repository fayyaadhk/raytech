import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {ClientService} from "../client/client.service";
import {Router} from "@angular/router";
import {ItemService} from "./item.service";
import {MatTableDataSource} from "@angular/material/table";
import {ItemClass} from './item.model';
import {FuseConfirmationService} from "../../@fuse/services/confirmation";
import {CategoryService} from "../category/category.service";
import {BrandService} from "../brand/brand.service";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";

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
export class ItemComponent implements OnInit, AfterViewInit {
    items: any = [];
    endsubs$: Subject<any> = new Subject<any>();
    isLoading: boolean = false;
    dataSource: MatTableDataSource<ItemClass>;
    displayedColumns = ['id', 'name', 'sku', 'shortDescription','brandId', 'categoryId', 'rrsp', 'editDelete'];

    categories: any = [];
    brands: any = [];

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private itemService: ItemService,
                private cateogryService: CategoryService,
                private brandService: BrandService,
                private router: Router,
                private fuseConfirmationService: FuseConfirmationService) {

    }

    ngOnInit() {
        this.isLoading = true;
        this._getCategories();
        this._getBrands();
    }

    createItem() {
        this.router.navigateByUrl('items/form');
    }

    updateItem(itemId: string) {
        this.router.navigateByUrl(`items/form/${itemId}`);
    }

    deleteItem(itemId: string) {
        const confirmation = this.fuseConfirmationService.open({
            title: 'Delete item',
            message: 'Are you sure you want to remove this item? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete'
                }
            }
        });

        confirmation.afterClosed().subscribe((result) => {
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

    getBrandById(brandId) {
        return this.brands.find(brand => brand.id === brandId).name;
    }

    getCategoryById(categoryId) {
        return this.categories.find(cat => cat.id === categoryId).name;
    }

    private _getItems() {
        this.isLoading = true;
        this.itemService
            .getItems()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((items) => {
                this.items = items.sort((a,b) => a.name.localeCompare(b.name));
                this.dataSource = new MatTableDataSource(this.items);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.isLoading = false;
            });
    }

    private _getCategories() {
        this.isLoading = true;
        this.cateogryService
            .getCategories()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((categories) => {
                this.categories = categories;
                this._getItems();
                this.dataSource = new MatTableDataSource(this.categories);
            });
    }

    private _getBrands() {
        this.isLoading = true;
        this.brandService
            .getBrands()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((brands) => {
                this.brands = brands;
                this.dataSource = new MatTableDataSource(this.brands);
            });
    }

    ngAfterViewInit() {

    }
}
