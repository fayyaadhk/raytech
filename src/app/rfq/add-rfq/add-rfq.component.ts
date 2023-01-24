import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Subject, Subscription, takeUntil} from "rxjs";
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
import {RfqStatus} from "../../data/rfq-status";
import {FileUploadService} from "../../shared/file-upload.service";

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
    itemForm: FormGroup;
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
    currentRfqId: number;
    sub: Subscription;
    dataSource: MatTableDataSource<RfqItem>;
    displayedColumns = ['id', 'name', 'supplierName', 'quantity', 'priceQuoted', 'actions'];
    keys = Object.keys;
    rfqStatus = RfqStatus;

    formData: FormData = new FormData();
    rfqDocumentFile: File;

    constructor(private location: Location,
                private formBuilder: FormBuilder,
                private rfqService: RfqService,
                private fileUploadService: FileUploadService,
                private route: ActivatedRoute,
                private clientService: ClientService,
                private itemService: ItemService,
                private dialog: MatDialog,
                private router: Router,
                private categoryService: CategoryService,
                private brandService: BrandService) {
    }

    get rfqForm() {
        return this.verticalStepperForm.controls;
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
                console.log(this.rfqItems);
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

    removeRfqItem(rfqId: number, rfqItemId: number) {
        if(rfqId){
            console.log('here 1');
            this.rfqItems.splice(rfqId, 1);
            this.dataSource = new MatTableDataSource(this.rfqItems);
        }
        else if (rfqItemId){
            console.log('here 2');
            this.rfqService.deleteRfqItem(rfqItemId)
                .pipe(takeUntil(this.endsubs$))
                .subscribe(() => {
                    this.rfqItems.splice(rfqId, 1);
                    this.dataSource = new MatTableDataSource(this.rfqItems);
                    this.isLoading = false;
                });
        }
    }

    ngOnInit() {
        this.isLoading = true;
        this._initForm();
        this._getClients();
        this._getItems();
        this._checkEditMode();
        this._getCategories();
        this._getBrands();
    }

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
                } else if (this.rfqItems[r].editMode === false) {
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
        newItem.name = this.itemForm.get('name').value;
        newItem.shortDescription = this.itemForm.get('shortDescription').value;
        newItem.description = this.itemForm.get('description').value;
        newItem.sku = this.itemForm.get('sku').value;
        newItem.rrsp = this.itemForm.get('rrsp').value;
        newItem.thumbnail = this.itemForm.get('thumbnail').value;
        newItem.categoryId = this.itemForm.get('category').value;
        newItem.brandId = this.itemForm.get('brand').value;
        this.itemService
            .addItem(newItem)
            .pipe(takeUntil(this.endsubs$))
            .subscribe(
                (client) => {
                    this.addSuccess = true;
                    // this.rfqForm.step3['itemForm'].reset();
                    this.itemForm.reset();
                },
                (error) => {
                    this.addSuccess = false;
                    console.log(error);
                }
            );
    }

    // Image Preview
    uploadRFQDocument(event) {
        if (event.target.files.length > 0) {

            const file = event.target.files[0];
            this.rfqDocumentFile = file;
        }
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
            }),
        });

        this.itemForm = this.formBuilder.group({
            name: ['',],
            description: [''],
            shortDescription: [''],
            sku: [''],
            rrsp: [''],
            thumbnail: [''],
            category: [''],
            brand: [''],
        })
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

                        this._uploadRfqDocument(rfq.id.toString().concat('_').concat(rfq.rfqNumber).concat('.pdf'));

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

    private _uploadRfqDocument(filename: string) {
        console.log(">>> this.rfqDocumentFile", this.rfqDocumentFile);
        if (this.rfqDocumentFile) {

            this.formData.append('file', this.rfqDocumentFile);
            this.formData.append('directory', "RFQs");
            this.formData.append('filename', filename);

            this.fileUploadService
                .uploadRfqDocument(this.formData)
                .pipe(takeUntil(this.endsubs$))
                .subscribe();
        }
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
                        }

                        this.rfqItems = this.rfqItemDetails;

                        this.rfqForm.step1.setValue(this.rfqDetails);

                        console.log(">>> checkEdit - this.rfqItems", this.rfqItems);
                        this.dataSource = new MatTableDataSource(this.rfqItems);
                    });
            }
        });
    }

}
