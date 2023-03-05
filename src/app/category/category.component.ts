import {Component, OnInit, ViewChild} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {Router} from '@angular/router';
import {CategoryService} from './category.service';
import {MatTableDataSource} from "@angular/material/table";
import {Category} from "../api/models/category";
import {FuseConfirmationService} from "../../@fuse/services/confirmation";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
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
export class CategoryComponent implements OnInit {
    categories: any = [];
    endsubs$: Subject<any> = new Subject<any>();
    isLoading: boolean = false;
    dataSource: MatTableDataSource<Category>;
    displayedColumns = ['id', 'name', 'actions'];

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private cateogryService: CategoryService,
                private router: Router,
                private fuseConfirmationService: FuseConfirmationService) {

    }

    ngOnInit(){
        this.isLoading = true;
        this._getCategories();
    }

    createCategory(){
        this.router.navigateByUrl('categories/form');
    }

    updateCategory(categoryId: string){
        this.router.navigateByUrl(`categories/form/${categoryId}`);
    }

    deleteCategory(categoryId: string){
        const confirmation = this.fuseConfirmationService.open({
            title: 'Delete category',
            message: 'Are you sure you want to remove this category? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete'
                }
            }
        });

        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if (result === 'confirmed') {
                this.cateogryService.deleteCategory(categoryId).pipe(takeUntil(this.endsubs$)).subscribe(() => {
                    this._getCategories();
                });
            }
        });

    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    private _getCategories(){
        this.cateogryService
            .getCategories()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((categories) => {
                this.categories = categories;
                this.dataSource = new MatTableDataSource(this.categories);
                this.isLoading = false;
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            });
    }
}
