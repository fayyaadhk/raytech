import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {debounceTime, map, merge, Observable, Subject, Subscription, switchMap, take, takeUntil} from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import {SupplierService} from './supplier.service';
import {Supplier} from '../api/models/supplier';
import { Router } from '@angular/router';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
    styles         : [
        /* language=SCSS */
        `
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
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations     : fuseAnimations
})
export class SupplierComponent implements OnInit{
    suppliers = [];
    endsubs$: Subject<any> = new Subject<any>();
    isLoading: boolean = false;
    dataSource: MatTableDataSource<Supplier>;
    displayedColumns = ['id', 'name', 'contactPerson', 'editDelete'];

    constructor(private supplierService: SupplierService,
                private router: Router,) {

    }

    ngOnInit(){
        this.isLoading = true;
        this._getSuppliers();
        console.log(this.suppliers);
    }

    createSupplier(){
        this.router.navigateByUrl('suppliers/form');
    }

    updateSupplier(supplierId: string){
        this.router.navigateByUrl(`suppliers/form/${supplierId}`);
    }

    deleteSupplier(supplierId: string){
        this.supplierService.deleteSupplier(supplierId).pipe(takeUntil(this.endsubs$)).subscribe(() => {
            this._getSuppliers();
        });
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    private _getSuppliers(){
        this.supplierService
            .getSuppliers()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((suppliers) => {
                this.suppliers = suppliers;
                this.dataSource = new MatTableDataSource(this.suppliers);
                this.isLoading = false;
                console.log(this.suppliers);
            });
    }
}
