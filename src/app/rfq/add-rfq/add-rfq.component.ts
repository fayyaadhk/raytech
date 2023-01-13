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
    public rfqDetails: any = {};
    public rfqItemDetails: any = {};
    currentRfqId: string;
    sub: Subscription;
    dataSource: MatTableDataSource<RfqItem>;
    displayedColumns = ['id', 'name', 'quantity', 'price', 'actions'];
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

    constructor(private location: Location,
                private formBuilder: FormBuilder,
                private rfqService: RfqService,
                private route: ActivatedRoute,
                private clientService: ClientService,
                private itemService: ItemService,
                private dialog: MatDialog,
                private router: Router) {
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
                this.dataSource = new MatTableDataSource(this.rfqItems);
                console.log(res.data);
                console.log(this.rfqItems);
            }
        })
    }

    updateRfqItem(rfqItemId: number, rfqId: number, quantity: string, price: number, status: string) {

        const dialogRef = this.dialog.open(RfqItemComponent, {
            width: '600px',
            data: {
                modalTitle: 'Add New RFQ Item',
                rfqItemId: rfqItemId,
                itemId: rfqId,
                quantity: quantity,
                price: price,
                status: status
            },
        });

        dialogRef.afterClosed().subscribe(res => {
            console.log(">>> res", res);
            if (res.editMode) {

                this.rfqItems[res.rfqItemId] = res;

                this.dataSource = new MatTableDataSource(this.rfqItems);
                console.log(this.rfqItems);
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
            this.isLoading = false;
        }

        else {
            this._addRfq();
            this.isLoading = false;
            this.verticalStepperForm.reset();
            this.router.navigateByUrl('rfqs');
        }
    }

    onCancle() {
        this.location.back();
    }

    addItem() {
        const newItem: ItemClass = new ItemClass();
        newItem.name = this.verticalStepperForm.get('step3.itemForm.name').value;
        newItem.shortDescription = this.verticalStepperForm.get(['step3.itemForm.shortDescription']).value;
        newItem.description = this.verticalStepperForm.get(['step3.itemForm.description']).value;
        newItem.sku = this.verticalStepperForm.get(['step3.itemForm.sku']).value;
        newItem.rrsp = this.verticalStepperForm.get(['step3.itemForm.rrsp']).value;
        newItem.thumbnail = this.verticalStepperForm.get(['step3.itemForm.thumbnail']).value;
        newItem.categoryId = this.verticalStepperForm.get(['step3.itemForm.category']).value;
        newItem.brandId = this.verticalStepperForm.get(['step3.itemForm.brand']).value;
        console.log('>>> get values from controller', newItem);
        this.itemService
            .addItem(newItem)
            .pipe(takeUntil(this.endsubs$))
            .subscribe(
                (client) => {
                    this.addSuccess = true;
                    console.log(client);
                    this.verticalStepperForm['step3']['itemForm'].reset();
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

    private _addRfq() {
        console.log('>>> GOT INTO ADD');
        // @ts-ignore
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
                        console.log("--- rfqs ", this.rfqs);
                        if(this.rfqs) {
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
                            // for(let r = 0; r < this.rfqs.items.length; r++) {
                                console.log(this.rfqs.items[0].status);
                                this.rfqItems = this.rfqs.items;
                                this.rfqItemDetails = [{
                                    rfqItems: this.rfqs.items[0].item,
                                    quantity: this.rfqs.items[0].quantity,
                                    status: this.rfqs.items[0].status,
                                    price: this.rfqs.items[0].priceQuoted,
                                    itemForm: null
                                }];
                            // }
                        //     //this.rfqItems = this.rfqs.items;
                            console.log(this.rfqItemDetails);
                            this.rfqForm.step1.setValue(this.rfqDetails);
                            // this.rfqForm.step3.setValue(this.rfqItemDetails);
                        this.dataSource = new MatTableDataSource(this.rfqItems);
                        this.rfqForm.step3['rfqItems'].setValue(this.rfqItemDetails);
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
