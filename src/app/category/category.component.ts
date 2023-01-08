import { Component, OnInit } from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {Router} from '@angular/router';
import {CategoryService} from './category.service';

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

    private _getCategories(){
        this.cateogryService
            .getCategories()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((categories) => {
                this.categories = categories;
                this.isLoading = false;
            });
    }
}
