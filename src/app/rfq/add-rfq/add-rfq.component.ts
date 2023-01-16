import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CreateClientRequest} from "../../api/models/create-client-request";
import {Subject, Subscription, takeUntil} from "rxjs";
import {Client} from "../../client/client.model";
import {RfqService} from "../rfq.service";
import {RfqModule} from "../rfq.module";
import {Rfq} from "../rfq.model";
import {ActivatedRoute, Router} from "@angular/router";
import {ClientService} from "../../client/client.service";
import {ItemService} from "../../item/item.service";
import {ItemClass} from "../../item/item.model";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {RfqItemComponent} from "../../rfq-item/rfq-item.component";
import {MatTableDataSource} from "@angular/material/table";
import {RfqItem} from "../../api/models/rfq-item";
import {CreateRfqRequest} from "../../api/models/create-rfq-request";
import {UpdateRfqItem} from "../../api/models/update-rfq-item";
import {CreateRfqItem} from "../../api/models/create-rfq-item";
import {CategoryService} from "../../category/category.service";
import {BrandService} from "../../brand/brand.service";
import {POStatus} from "../../data/purchase-order-status";
import {RfqStatus} from "../../data/rfq-status";

@Component({
    selector: 'app-add-rfq',
    templateUrl: './add-rfq.component.html',
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

export class AddRfqComponent implements OnInit {
    editmode = false;
    verticalStepperForm: FormGroup;
    quoteDocumentPreview: string;
    rfqDocumentPreview: string;
    isSubmitted = false;
    formFieldHelpers: string[] = [''];
    isLoading: boolean = false;
    endsubs$: Subject<any> = new Subject();
    addSuccess = false;
    updateSuccess = false;
    rfqs: any = [];
    buyers: [] = [];
    clients: any = [];
    items: any = [];
    rfqItems: any = [];
    categories: any = [];
    brands: any = [];
    public rfqDetails: any = {};
    public rfqItemDetails: any = [];
    setStep3: any = [];
    createNew: boolean = false;
    currentRfqId: number;
    sub: Subscription;
    dataSource: MatTableDataSource<RfqItem>;
    displayedColumns = ['id', 'name', 'supplierName', 'quantity', 'priceQuoted', 'actions'];
    keys = Object.keys;
    rfqStatus = RfqStatus;

    constructor(private location: Location,
                private formBuilder: FormBuilder,
                private rfqService: RfqService,
                private route: ActivatedRoute,
                private clientService: ClientService,
                private itemService: ItemService,
                private dialog: MatDialog,
                private router: Router,
                private categoryService: CategoryService,
                private brandService: BrandService) {
    }

    openDialog() {

        const dialogRef = this.dialog.open(RfqItemComponent, {
            width: '600px',
            data: {modalTitle: 'Add New RFQ Item'},
        });

        dialogRef.afterClosed().subscribe(res => {
            // received data from dialog-component
            if (res) {
                this.rfqItems.push(res);

                console.log(">>> Adding an item - this.rfq.items ", this.rfqItems);

                this.dataSource = new MatTableDataSource(this.rfqItems);

            }
        })
    }

    updateRfqItem(rfqItemId: number, rfqId: number, supplierId: number, quantity: string, price: number, status: string) {

        const dialogRef = this.dialog.open(RfqItemComponent, {
            width: '600px',
            data: {
                rfqItemId: rfqItemId,
                itemId: rfqId,
                quantity: quantity,
                supplierId: supplierId,
                priceQuoted: price,
                status: status
            },
        });

        dialogRef.afterClosed().subscribe(res => {
            if (res.editMode) {

                this.rfqItems[res.rfqItemId] = res;

                this.dataSource = new MatTableDataSource(this.rfqItems);
            } else {
                this.rfqItems.push(res);
                this.dataSource = new MatTableDataSource(this.rfqItems);
            }
        })
    }

    removeRfqItem(rfqId: number) {
        this.rfqItems.splice(rfqId, 1);
        this.dataSource = new MatTableDataSource(this.rfqItems);
    }

    ngOnInit() {
        this.isLoading = true;
        this._initForm();
        this._getClients();
        this._getItems();
        this._checkEditMode();
        this._getCategories();
        this._getBrands();

        console.log(">>> Init -  this.rfqItems", this.rfqItems);
    }

    private _initForm() {
        // Vertical stepper form
        this.verticalStepperForm = this.formBuilder.group({
            step1: this.formBuilder.group({
                rfqNumber: ['', [Validators.required]],
                dueDate: ['', Validators.required],
                description: [''],
                rfqDocument: [''],
                client: [null, Validators.required],
                buyer: [null],
                status: ['', Validators.required],
            }),
            step2: this.formBuilder.group({
                quoteDocument: [''],
                quoteSentDate: ['']
            }),
            step3: this.formBuilder.group({
                rfqItems: new FormArray([]),
                quantity: [null],
                status: [''],
                supplierId: [''],
                expectedArrivalDate: [''],
                price: [null],
                itemForm: this.formBuilder.group({
                    name: ['',],
                    description: [''],
                    shortDescription: [''],
                    sku: [''],
                    rrsp: [''],
                    thumbnail: [''],
                    category: [''],
                    brand: [''],
                }),
            }),
        });
        //this.addCheckboxes();
    }

    /* onCheckChange(event) {
         const formArray: FormArray = this.verticalStepperForm.get('step3.rfqItems') as FormArray;
         /!* Selected *!/
         if (event.checked) {
             // Add a new control in the arrayForm
             console.log(event.source.value);
             formArray.push(new FormControl(event.source.value));
         }
         else {
             // find the unselected element
             let i: number = 0;
             formArray.controls.forEach((ctrl: FormControl) => {
                 if (ctrl.value == event.checked) {
                     // Remove the unselected element from the arrayForm
                     formArray.removeAt(i);
                     return;
                 }

                 i++;
             });
         }
     }*/

    ngOnDestroy() {
        this.endsubs$.complete();
    }

    onSubmit() {
        this.isSubmitted = true;
        this.isLoading = true;

        if (this.verticalStepperForm.invalid) {
            return;
        }

        if (this.editmode) {
            const updateRfq: Rfq = {
                items: this.rfqItems,
                description: this.verticalStepperForm.get('step1.description').value,
                status: this.verticalStepperForm.get('step1.status').value,
                clientId: this.verticalStepperForm.get('step1.client').value,
                buyerId: this.verticalStepperForm.get('step1.buyer').value,
                due: this.verticalStepperForm.get('step1.dueDate').value,
                rfqNumber: this.verticalStepperForm.get('step1.rfqNumber').value,
                rfqDocumentUrl: this.verticalStepperForm.get('step1.rfqDocument').value
            };
            this._updateRfq(updateRfq);

            for (let r = 0; r < this.rfqItems.length; r++) {

                    if (this.rfqItems[r].editMode === true) {
                        const updateRfqItem: UpdateRfqItem = {
                            rfqItemId: this.rfqs.items[r].id,
                            itemId: this.rfqItems[r].itemId,
                            quantity: this.rfqItems[r].quantity,
                            supplierId: this.rfqItems[r].supplier,
                            expectedArrivalDate: this.rfqItems[r].expectedArrivalDate,
                            priceQuoted: this.rfqItems[r].priceQuoted,
                            status: this.rfqItems[r].status
                        };
                        this.rfqService
                            .updateRfqItem(updateRfqItem, this.rfqs.items[r].id)
                            .pipe(takeUntil(this.endsubs$))
                            .pipe(takeUntil(this.endsubs$))
                            .subscribe(
                                (rfq: RfqModule) => {
                                    this.updateSuccess = true;
                                },
                                () => {
                                    this.updateSuccess = false;
                                }
                            );
                    } else if(this.rfqItems[r].editMode === false){
                        const addRfqItem: CreateRfqItem = {
                            rfqId: this.currentRfqId,
                            itemId: this.rfqItems[r].itemId,
                            quantity: this.rfqItems[r].quantity,
                            supplierId: this.rfqItems[r].supplier,
                            expectedArrivalDate: this.rfqItems[r].expectedArrivalDate,
                            priceQuoted: this.rfqItems[r].priceQuoted,
                            status: this.rfqItems[r].status
                        };
                        this.rfqService
                            .createRfqItem(addRfqItem)
                            .pipe(takeUntil(this.endsubs$))
                            .subscribe(
                                (rfq: RfqModule) => {
                                    this.addSuccess = true;
                                },
                                () => {
                                    this.addSuccess = false;
                                }
                            );
                    }
            }
            this.isLoading = false;
            this.updateSuccess = true;
            this.onCancle();
        } else {
            this._addRfq();
            this.isLoading = false;
            this.verticalStepperForm.reset();
            this.addSuccess = true;
            this.onCancle();
        }
    }

    onCancle() {
        this.isLoading = true;
        this.location.back();
    }

    addItem() {
        const newItem: ItemClass = new ItemClass();
        newItem.name = this.verticalStepperForm.get('step3.itemForm.name').value;
        newItem.shortDescription = this.verticalStepperForm.get('step3.itemForm.shortDescription').value;
        newItem.description = this.verticalStepperForm.get('step3.itemForm.description').value;
        newItem.sku = this.verticalStepperForm.get('step3.itemForm.sku').value;
        newItem.rrsp = this.verticalStepperForm.get('step3.itemForm.rrsp').value;
        newItem.thumbnail = this.verticalStepperForm.get('step3.itemForm.thumbnail').value;
        newItem.categoryId = this.verticalStepperForm.get('step3.itemForm.category').value;
        newItem.brandId = this.verticalStepperForm.get('step3.itemForm.brand').value;
        this.itemService
            .addItem(newItem)
            .pipe(takeUntil(this.endsubs$))
            .subscribe(
                (client) => {
                    this.addSuccess = true;
                    // this.verticalStepperForm.step3.itemForm.reset();
                    this.verticalStepperForm['step3.itemForm'].reset();
                },
                (error) => {
                    this.addSuccess = false;
                    console.log(error);
                }
            );
    }

    private _getClients() {
        this.clientService
            .getClients()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((clients) => {
                this.clients = clients;
                this.isLoading = false;
            });
    }

    private _getItems() {
        this.itemService
            .getItems()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((items) => {
                this.items = items;
                this.isLoading = false;
            });
    }

    private _getBrands() {
        this.brandService
            .getBrands()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((brands) => {
                this.brands = brands;
                this.isLoading = false;
            });
    }

    private _getCategories() {
        this.categoryService
            .getCategories()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((categories) => {
                this.categories = categories;
                this.isLoading = false;
            });
    }

    private _addRfq() {
        const newRfq: CreateRfqRequest = {
            items: this.rfqItems,
            description: this.verticalStepperForm.get('step1.description').value,
            status: this.verticalStepperForm.get('step1.status').value,
            clientId: this.verticalStepperForm.get('step1.client').value,
            buyerId: this.verticalStepperForm.get('step1.buyer').value,
            due: this.verticalStepperForm.get('step1.dueDate').value,
            rfqNumber: this.verticalStepperForm.get('step1.rfqNumber').value,
            rfqDocumentUrl: this.verticalStepperForm.get('step1.rfqDocument').value
        };

        if (newRfq) {
            console.log(">>> Create RFQ Request: ", newRfq);
            this.rfqService
                .createRfq(newRfq)
                .pipe(takeUntil(this.endsubs$))
                .subscribe(
                    (rfq) => {
                        this.addSuccess = true;
                        console.log(rfq);
                        this.verticalStepperForm.reset();
                    },
                    (error) => {
                        this.addSuccess = false;
                        console.log(error);
                    }
                );
        } else {
            console.log(newRfq);
        }
    }

    private _updateRfq(rfqData: Rfq) {
        this.rfqService
            .updateRfq(rfqData, this.currentRfqId)
            .pipe(takeUntil(this.endsubs$))
            .subscribe(
                (rfq: RfqModule) => {
                    this.updateSuccess = true;
                },
                () => {
                    this.updateSuccess = false;
                }
            );
    }

    private _updateRfqItem(rfqItemData: UpdateRfqItem) {
        this.rfqService
            .updateRfqItem(rfqItemData, this.currentRfqId)
            .pipe(takeUntil(this.endsubs$))
            .subscribe(
                (rfq: RfqModule) => {
                    this.updateSuccess = true;
                },
                () => {
                    this.updateSuccess = false;
                }
            );
    }

    private _checkEditMode() {
        this.route.params.pipe(takeUntil(this.endsubs$)).subscribe((params) => {
            if (params.id) {
                this.editmode = true;
                this.currentRfqId = params.id;
                this.rfqService
                    .getRfqDetails(params.id)
                    .pipe(takeUntil(this.endsubs$))
                    .subscribe((rfq) => {
                        this.rfqs = rfq;
                        if (this.rfqs) {
                            this.rfqDetails = {
                                rfqNumber: this.rfqs.rfqNumber,
                                dueDate: this.rfqs.due,
                                description: this.rfqs.description,
                                rfqDocument: this.rfqs.rfqDocumentUrl,
                                client: this.rfqs.clientId,
                                buyer: this.rfqs.buyerId,
                                status: this.rfqs.status
                            };
                        }
                        console.log(this.rfqs);

                        for (let r = 0; r < this.rfqs.items.length; r++) {
                            // this.rfqItems = this.rfqs.items;
                            this.rfqItemDetails.push({
                                rfqItemId: this.rfqs.items[r].id,
                                itemId: this.rfqs.items[r].item.id,
                                name: this.rfqs.items[r].item.name,
                                quantity: this.rfqs.items[r].quantity,
                                supplierId: this.rfqs.items[r].supplier?.id,
                                expectedArrivalDate: this.rfqs.items[r].expectedArrivalDate,
                                supplierName: this.rfqs.items[r].supplier?.name,
                                status: this.rfqs.items[r].status,
                                priceQuoted: this.rfqs.items[r].priceQuoted,
                            });
                            //
                            // console.log('rfqItemDetails before step 3', this.rfqItemDetails)
                            //
                            // this.setStep3 = {
                            //     rfqItems: this.rfqItemDetails[r],
                            //     quantity: this.rfqs.items[r].quantity,
                            //     status: this.rfqs.items[r].status,
                            //     price: this.rfqs.items[r].priceQuoted,
                            //     itemForm: null
                            // };
                        }

                        this.rfqItems = this.rfqItemDetails;
                        //     //this.rfqItems = this.rfqs.items;
                        this.rfqForm.step1.setValue(this.rfqDetails);
                        //this.rfqForm.step3.setValue(this.setStep3);
                        console.log(">>> checkEdit - this.rfqItems", this.rfqItems);
                        this.dataSource = new MatTableDataSource(this.rfqItems);
                        //this.rfqForm.step3['rfqItems'].setValue(this.rfqItemDetails);
                        // this.rfqForm['step3']['status'].setValue(this.rfqs.items.status);
                        // this.rfqForm['step3']['price'].setValue(this.rfqs.priceQuoted);
                        // this.rfqForm['step3']['itemForm'].setValue(null);
                    });
            }
        });
    }

    get rfqForm() {
        return this.verticalStepperForm.controls;
    }

    // Image Preview
    uploadRFQDocument(event) {
        const file = (event.target as HTMLInputElement).files[0];
        this.verticalStepperForm.patchValue({
            rfqDocument: file
        });
        this.verticalStepperForm.get('rfqDocument').updateValueAndValidity();
        // File Preview
        const reader = new FileReader();
        reader.onload = () => {
            this.rfqDocumentPreview = reader.result as string;
        };
        reader.readAsDataURL(file);
    }

    // Image Preview
    uploadQuotation(event) {
        const file = (event.target as HTMLInputElement).files[0];
        this.verticalStepperForm.patchValue({
            quoteDocument: file
        });
        this.verticalStepperForm.get('quoteDocument').updateValueAndValidity();
        // File Preview
        const reader = new FileReader();
        reader.onload = () => {
            this.quoteDocumentPreview = reader.result as string;
        };
        reader.readAsDataURL(file);
    }
}
