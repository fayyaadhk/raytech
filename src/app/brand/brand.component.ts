import {Component} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {Category} from "../api/models/category";
import {CategoryService} from "../category/category.service";
import {Router} from "@angular/router";
import {Brand} from "../api/models/brand";
import {BrandService} from "./brand.service";
import {FuseConfirmationService} from "../../@fuse/services/confirmation";

@Component({
    selector: 'app-brand',
    templateUrl: './brand.component.html',
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
export class BrandComponent {
    brands: any = [];
    endsubs$: Subject<any> = new Subject<any>();
    isLoading: boolean = false;
    dataSource: MatTableDataSource<Brand>;
    displayedColumns = ['id', 'name', 'editDelete'];

    constructor(private brandService: BrandService,
                private router: Router,
                private fuseConfirmationService: FuseConfirmationService,) {

    }

    ngOnInit() {
        this.isLoading = true;
        this._getBrands();
    }

    createBrand() {
        this.router.navigateByUrl('brands/form');
    }

    updateBrand(brandId: string) {
        this.router.navigateByUrl(`brands/form/${brandId}`);
    }

    deleteBrand(brandId: string) {
        const confirmation = this.fuseConfirmationService.open({
            title: 'Delete brand',
            message: 'Are you sure you want to remove this brand? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete'
                }
            }
        });

        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if (result === 'confirmed') {
                this.brandService.deleteBrand(brandId).pipe(takeUntil(this.endsubs$)).subscribe(() => {
                    this._getBrands();
                });
            }
        });

    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    private _getBrands() {
        this.brandService
            .getBrands()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((brands) => {
                this.brands = brands;
                this.dataSource = new MatTableDataSource(this.brands);
                this.isLoading = false;
            });
    }
}
