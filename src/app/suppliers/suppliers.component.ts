import {Component, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {Supplier} from "../api/models/supplier";
import {Router} from "@angular/router";
import {SupplierService} from "./suppliers.service";

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit{
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
                console.log(this.suppliers);
                this.dataSource = new MatTableDataSource(this.suppliers);
                this.isLoading = false;
            });
    }
}
