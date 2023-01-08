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
export class AddRfqComponent implements OnInit, AfterViewInit {
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
    filteredItems: any = [];
    selectedId: number[];
    currentRfqId: string;
    sub: Subscription;
    dataSource: MatTableDataSource<RfqItem>;
    displayedColumns = ['id', 'name', 'quantity', 'price', 'actions']
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

    //
    // private onChanged(event: any) {
    //     console.log(">>> this.rfqItems", this.rfqForm["step3"].value["rfqItems"]);
    //     const selectedRFQItems = (this.verticalStepperForm.controls['step3'].value["rfqItems"] as FormArray);
    //     if (event.target.checked) {
    //         selectedRFQItems.push(new FormControl(event.target.value));
    //     } else {
    //         const index = selectedRFQItems.controls
    //             .findIndex(x => x.value === event.target.value);
    //         selectedRFQItems.removeAt(index);
    //     }
    // }

    openDialog() {
        console.log("before open");

        const dialogRef = this.dialog.open(RfqItemComponent, {
            width: '600px',
            data: {modalTitle: 'Add New RFQ Item'},
        });

        dialogRef.afterClosed().subscribe(res => {
            // received data from dialog-component
            if (res) {
                //if (this.rfqItems.{

                //} else {
                    this.rfqItems.push(res);
                //}

                this.dataSource = new MatTableDataSource(this.rfqItems);
                console.log(res.data);
                console.log(this.rfqItems);
            }
        })
    }

    private rfqItemExist(itemId: number): boolean {
        return this.rfqItems.some(x => x.itemId === itemId);
    }

    updateRfqItem(rfqId: number, quantity: string, price: number, status: string) {
        const dialogRef = this.dialog.open(RfqItemComponent, {
            width: '600px',
            data: {
                modalTitle: 'Add New RFQ Item',
                itemId: rfqId,
                quantity: quantity,
                price: price,
                status: status
            },
        });

        dialogRef.afterClosed().subscribe(res => {
            // received data from dialog-component
            if (this.rfqItemExist(res.itemId)) {
                let updateItem = this.rfqItems.find(this.findIndexToUpdate, res.itemId);

                let index = this.rfqItems.indexOf(updateItem);

                this.rfqItems[index] = res;

                this.dataSource = new MatTableDataSource(this.rfqItems);
                console.log(res.data);
                console.log(this.rfqItems);
            }else{
                this.rfqItems.push(res);
                this.dataSource = new MatTableDataSource(this.rfqItems);


            }
        })
    }

    findIndexToUpdate(newItem) {
        return newItem.itemId === this;
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
    }

    ngAfterViewInit() {
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
                pushNotifications: ['everything', Validators.required],
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

    onCheckChange(event) {
        const formArray: FormArray = this.verticalStepperForm.get('step3.rfqItems') as FormArray;
        /* Selected */
        if (event.checked) {
            // Add a new control in the arrayForm
            console.log(event.source.value);
            formArray.push(new FormControl(event.source.value));
        }
        /* unselected */
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
    }

    ngOnDestroy() {
        //this.endsubs$.next(null);
        this.endsubs$.complete();
    }

    onSubmit() {
        this.isSubmitted = true;
        this.isLoading = true;

        if (this.verticalStepperForm.invalid) {
            return;
        }
        // const rfqFormData = new FormData();
        // Object.keys(this.rfqForm).map((key) => {
        //     rfqFormData.append(key, this.rfqForm[key].value);
        // });
        // updateClient.name = this.form.get('name').value;
        // updateClient.buyer = this.form.get('buyer').value;
        // updateClient.contactInformation = this.form.get('contactInformation').value;

        if (this.editmode) {
            const updateRfq = new Rfq();
            updateRfq.rfqNumber = this.verticalStepperForm.get('rfqNumber').value;
            updateRfq.buyerId = this.verticalStepperForm.get('buyerId').value;
            updateRfq.description = this.verticalStepperForm.get('description').value;
            updateRfq.clientId = this.verticalStepperForm.get('clientId').value;
            updateRfq.due = this.verticalStepperForm.get('dueDate').value;
            updateRfq.rfqDocumentUrl = this.verticalStepperForm.get('rfqDocument').value;
            updateRfq.status = this.verticalStepperForm.get('status').value;
            updateRfq.items = this.verticalStepperForm.get('rfqItems').value;
            this._updateRfq(updateRfq);
            this.isLoading = false;
        }
        // this.location.back();
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

    filterItems(event) {
        const value = event.target.value.toLowerCase();

        this.filteredItems = this.items.filter(item => item.name.toLowerCase().includes(value));
    }

    filterItemsInputKeyDown(event) {
        // Return if the pressed key is not 'Enter'
        if (event.key !== 'Enter') {
            return;
        }

        // If there is no tag available...
        if (this.filteredItems.length === 0) {
            // Create the tag
            //this.createTag(event.target.value);

            // Clear the input
            event.target.value = '';

            // Return
            return;
        }
    }

    addItem() {
        console.log('>>> GOT INTO ADD');
        const newItem: ItemClass = new ItemClass();
        console.log('>>> initialised ');
        newItem.name = this.verticalStepperForm.get('step3.itemForm.name').value;
        console.log('>>> get value name from controller', this.verticalStepperForm.get('step3.itemForm.name').value);
        newItem.shortDescription = this.verticalStepperForm.get(['step3.itemForm.shortDescription']).value;
        console.log('>>> get value short description from controller', this.verticalStepperForm.get(['step3.itemForm.shortDescription']).value);
        newItem.description = this.verticalStepperForm.get(['step3.itemForm.description']).value;
        console.log('>>> get value description from controller', this.verticalStepperForm.get(['step3.itemForm.description']).value);
        newItem.sku = this.verticalStepperForm.get(['step3.itemForm.sku']).value;
        console.log('>>> get value sku from controller', this.verticalStepperForm.get(['step3.itemForm.sku']).value);
        newItem.rrsp = this.verticalStepperForm.get(['step3.itemForm.rrsp']).value;
        console.log('>>> get value rrsp from controller', this.verticalStepperForm.get(['step3.itemForm.rrsp']).value);
        newItem.thumbnail = this.verticalStepperForm.get(['step3.itemForm.thumbnail']).value;
        console.log('>>> get value thumbnail from controller', this.verticalStepperForm.get(['step3.itemForm.thumbnail']).value);
        newItem.categoryId = this.verticalStepperForm.get(['step3.itemForm.category']).value;
        console.log('>>> get value category from controller', this.verticalStepperForm.get(['step3.itemForm.category']).value);
        newItem.brandId = this.verticalStepperForm.get(['step3.itemForm.brand']).value;
        console.log('>>> get value brand from controller', this.verticalStepperForm.get(['step3.itemForm.brand']).value);
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
            rfqNumber:this.verticalStepperForm.get('step1.rfqNumber').value,
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
        console.log("HERE");
        this.route.params.pipe(takeUntil(this.endsubs$)).subscribe((params) => {
            if (params.id) {
                this.editmode = true;
                this.currentRfqId = params.id;
                this.rfqService
                    .getRfq(params.id)
                    .pipe(takeUntil(this.endsubs$))
                    .subscribe((rfq) => {
                        this.rfqs = rfq;
                        this.rfqForm.rfqNumber.setValue(rfq.rfqNumber);
                        this.rfqForm.dueDate.setValue(rfq.due);
                        this.rfqForm.description.setValue(rfq.description);
                        this.rfqForm.rfqDocument.setValue(rfq.rfqDocumentUrl);
                        this.rfqForm.client.setValue(rfq.clientId);
                        this.rfqForm.buyer.setValue(rfq.buyerId);
                        this.rfqForm.status.setValue(rfq.status);
                        this.rfqForm.quoteDocument.setValue(rfq.quoteDocumentUrl);
                        this.rfqForm.quoteSentDate.setValue(rfq.quoteSentDate);
                        this.rfqForm.rfqItems.setValue(rfq.items);
                        this.rfqForm.rfqDocumentUrl.setValue(rfq.rfqDocumentUrl);
                        this.rfqForm.purchaseOrderReceivedDate.setValue(rfq.purchaseOrderReceivedDate);
                        this.rfqForm.purchaseOrderDueDate.setValue(rfq.purchaseOrderDueDate);
                        this.rfqForm.purchaseOrderDocumentUrl.setValue(rfq.purchaseOrderDocumentUrl);
                        console.log('HERE1', rfq.description);

                        console.log("Items ", rfq.items);
                        //this.clientForm.contactInformation.setValue(this.contactInfo);
                        //this.clientForm.thumbnail.setValidators([]);
                        //this.clientForm.thumbnail.updateValueAndValidity();
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
