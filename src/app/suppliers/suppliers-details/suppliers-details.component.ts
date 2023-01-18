import { Component } from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {RfqItem} from "../../api/models/rfq-item";
import {ClientService} from "../../client/client.service";
import {ActivatedRoute} from "@angular/router";
import {Supplier} from "../../api/models/supplier";
import {SupplierService} from "../suppliers.service";
import {SupplierItem} from "../../api/models/supplier-item";
import {PurchaseOrderItem} from "../../api/models/purchase-order-item";
import {
    EditPurchaseOrderItemComponent
} from "../../purchase-orders/edit-purchase-order-item/edit-purchase-order-item.component";
import {AddSupplierItemComponent} from "../add-supplier-item/add-supplier-item.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-suppliers-details',
  templateUrl: './suppliers-details.component.html',
  styleUrls: ['./suppliers-details.component.scss']
})
export class SuppliersDetailsComponent {
    suppliers: any;
    endsubs$: Subject<any> = new Subject();
    isLoading: boolean = false;
    currentSupplierId: string;
    supplier: any;
    form: FormGroup;
    dataSource: MatTableDataSource<Supplier>;
    displayedColumns = [
        'itemId',
        'supplierId',
        'itemName',
        'supplierPrice',
        'itemPriceDate',
        'rrsp'
    ];
    items = [];
    supplierItems: any;
    statuses: any = [
        {id: 1, name: 'Issued'},
        {id: 2, name: 'Sourcing'},
        {id: 3, name: 'Could not source'},
        {id: 4, name: 'In progress'},
        {id: 5, name: 'Pending submission'},
        {id: 6, name: 'Quotation sent'},
        {id: 7, name: 'Successful'},
        {id: 8, name: 'Unsuccessful'},
        {id: 9, name: 'Cancelled'},
    ];
    outcomes: any = [
        {id: 1, name: 'Issued'},
        {id: 2, name: 'Sourcing'},
        {id: 3, name: 'Could not source'},
        {id: 4, name: 'In progress'},
        {id: 5, name: 'Pending submission'},
        {id: 6, name: 'Quotation sent'},
        {id: 7, name: 'Successful'},
        {id: 8, name: 'Unsuccessful'},
        {id: 9, name: 'Cancelled'},
    ];

    constructor(private supplierService: SupplierService,
                private formBuilder: FormBuilder,
                private route: ActivatedRoute,
                private dialog: MatDialog) {
    }

    ngOnInit() {
        this.isLoading = true;
        this._getSupplierDetails();
        // this._initForm();
    }

    // private _initForm() {
    //     // Vertical stepper form
    //     this.form = this.formBuilder.group({
    //     });
    // }

    private _getSupplierDetails() {
        console.log("HERE");
        this.route.params.pipe(takeUntil(this.endsubs$)).subscribe((params) => {
            console.log(params);
            if (params.id) {
                this.currentSupplierId = params.id;
                console.log('>>>>>>', this.currentSupplierId)
                this.supplierService
                    .getSupplierDetails(this.currentSupplierId)
                    .pipe(takeUntil(this.endsubs$))
                    .subscribe((supplier) => {
                        this.suppliers = supplier;
                        console.log(this.suppliers);
                        console.log(this.suppliers.supplierItems);

                        this.supplierService.getSupplierItems(this.currentSupplierId)
                            .pipe(takeUntil(this.endsubs$))
                            .subscribe((supplierItems) =>{
                                this.supplierItems = supplierItems;
                                console.log(this.supplierItems);
                                for(let i = 0; i < this.supplierItems.length; i++){
                                    this.items.push({
                                        itemId: this.supplierItems[i].item.id,
                                        name: this.supplierItems[i].item.name,
                                        rrsp: this.supplierItems[i].item.rrsp,
                                        supplierId: this.supplierItems[i].supplier.id,
                                        price: this.supplierItems[i].supplierPrice,
                                        priceDate: this.supplierItems[i].supplierPriceDate,
                                    });
                                }
                                this.dataSource = new MatTableDataSource(this.supplierItems);
                            });

                        console.log('THIS.ITEMS ', this.items);

                        this.isLoading = false;
                        //this.clientForm.contactInformation.setValue(this.contactInfo);
                        //this.clientForm.thumbnail.setValidators([]);
                        //this.clientForm.thumbnail.updateValueAndValidity();
                    });
            }
        });
    }

    openDialog() {


        const dialogRef = this.dialog.open(AddSupplierItemComponent, {
            width: '600px',
            data: this.currentSupplierId,
        });

        dialogRef.afterClosed().subscribe(res => {
            console.log(">>> res", res);

            // received data from dialog-component
            if (res && res.updated) {
                this.dataSource = new MatTableDataSource(this.supplierItems);
            }
        })
    }

}
