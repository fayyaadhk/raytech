import { Component, OnInit } from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {Router} from '@angular/router';
import {CategoryService} from './category.service';
import {MatTableDataSource} from "@angular/material/table";
import {Category} from "../api/models/category";

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
    displayedColumns = ['name'];

    constructor(private cateogryService: CategoryService,
                private router: Router,) {

    }

    ngOnInit(){
        this.isLoading = true;
        this._getCategories();
    }

    createCategory(){
        this.router.navigateByUrl('commodities/form');
    }

    updateCategory(categoryId: string){
        this.router.navigateByUrl(`commodities/form/${categoryId}`);
    }

    deleteCategory(categoryId: string){
        this.cateogryService.deleteCategory(categoryId).pipe(takeUntil(this.endsubs$)).subscribe(() => {
            this._getCategories();
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
            });
    }
}
