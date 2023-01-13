import {Component, Inject, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ItemService} from "../item/item.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ItemClass} from "../item/item.model";

@Component({
    selector: 'app-rfq-item',
    templateUrl: './rfq-item.component.html',
    styleUrls: ['./rfq-item.component.scss']
})
export class RfqItemComponent implements OnInit {
    items: any = [];
    itemId: string;
    itemName: string;
    filteredRfqItems: any = [];
    rfqItemForm: FormGroup;
    isSubmitted = false;
    endsubs$: Subject<any> = new Subject();
    addSuccess = false;
    updateSuccess = false;
    currentItemId: string;
    editmode = false;
    isLoading: any;
    currentRfqItemId;
    public itemFilter: FormControl = new FormControl();

    ngOnInit() {
        this._initForm();
        this._getItems();
        this._checkEditMode();
    }

    constructor(private formBuilder: FormBuilder,
                private itemService: ItemService,
                private dialogRef: MatDialogRef<RfqItemComponent>,
                @Inject(MAT_DIALOG_DATA) public data) {
    }

    filterRfqItems(event): void {
        // Get the value
        const value = event.target.value.toLowerCase();

        // Filter the tags
        this.filteredRfqItems = this.items.filter(rfqItem => rfqItem.item.name.toLowerCase().includes(value));
    }

    private _initForm() {
        this.rfqItemForm = this.formBuilder.group({
            itemId: ['', Validators.required],
            name: [''],
            quantity: [null],
            price: [null],
            itemStatus: [''],
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

    onSubmit() {
        if(this.editmode) {

        }
        else{

        }
        this.itemId = this.rfqItemForm.get('itemId').value;
        this.itemService.getItem(this.itemId)
            .pipe(takeUntil(this.endsubs$))
            .subscribe((item) => {
                this.itemName = item.name;
                this.isLoading = false;
                if(this.editmode){
                    this.dialogRef.close(
                        {
                            editMode: this.editmode,
                            rfqItemId: this.data.rfqItemId,
                            itemId: this.rfqItemForm.get('itemId').value,
                            name: this.itemName,
                            quantity: this.rfqItemForm.get('quantity').value,
                            price: this.rfqItemForm.get('price').value,
                            status: this.rfqItemForm.get('itemStatus').value
                        }
                    )
                }
                else{
                    this.dialogRef.close(
                        {
                            editMode: this.editmode,
                            newItem: true,
                            rfqItemId: this.data.rfqItemId,
                            itemId: this.rfqItemForm.get('itemId').value,
                            name: this.itemName,
                            quantity: this.rfqItemForm.get('quantity').value,
                            price: this.rfqItemForm.get('price').value,
                            status: this.rfqItemForm.get('itemStatus').value
                        }
                    )
                }

            });
        this.addSuccess = true;
    }

    private _checkEditMode() {
        console.log(">>> HERE ", this.data);
            if (this.data.itemId) {
                this.editmode = true;
                this.currentRfqItemId = this.data.itemId;
                this.itemService.getItem(this.currentRfqItemId)
                    .pipe(takeUntil(this.endsubs$))
                    .subscribe((item) => {
                        this.isLoading = false;
                        this.itemForm.itemId.setValue(this.data.itemId);
                        this.itemForm.quantity.setValue(this.data.quantity);
                        this.itemForm.price.setValue(this.data.price);
                        this.itemForm.itemStatus.setValue(this.data.status);
                        //this.itemForm.name.setValue(item.name);
                    });
            }
        }

    get itemForm() {
        return this.rfqItemForm.controls;
    }
}
