import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AddNewItemComponent} from "../../add-rfq/add-new-item/add-new-item.component";
import {RfqItemService} from "../../../rfq-item/rfq-item.service";
import {CreateRfqItem} from "../../../api/models/create-rfq-item";
import {RfqItemComponent} from "../../../rfq-item/rfq-item.component";
import {FuseConfirmationService} from "../../../../@fuse/services/confirmation";

@Component({
    selector: 'app-add-rfq-item',
    templateUrl: './add-rfq-item.component.html',
    styleUrls: ['./add-rfq-item.component.scss']
})
export class AddRfqItemComponent implements OnInit {

    constructor(@Inject(MAT_DIALOG_DATA) public data,
                private dialogRef: MatDialogRef<AddRfqItemComponent>,
                private dialog: MatDialog,
                private _fuseConfirmationService: FuseConfirmationService,
                private rfqItemService: RfqItemService) {
    }

    ngOnInit(): void {

    }

    openCreateNewItemDialog() {
        const dialogRef = this.dialog.open(AddNewItemComponent, {
            width: '600px',
            height: '900px',
            data: this.data.id,
        });

        dialogRef.afterClosed().subscribe(res => {
            // received data from dialog-component
            if (res) {
                const newRfqItem: CreateRfqItem = {
                    rfqId: this.data.id,
                    quantity: res.quantity,
                    itemId: res.itemId,
                    supplierId: res.supplierId,
                    priceQuoted: res.priceQuoted,
                    expectedArrivalDate: res.expectedArrivalDate,
                    status: res.status
                };

                this.rfqItemService.createRfqItem(newRfqItem).subscribe(res =>{
                    this.dialogRef.close({added: true});
                });
            }
        })
    }

    openAttachExistingItemDialog() {
        const dialogRef = this.dialog.open(RfqItemComponent, {
            width: '600px',
            height: '800px',
            data: this.data.id,
        });

        dialogRef.afterClosed().subscribe(res => {
            // received data from dialog-component
            const newRfqItem: CreateRfqItem = {
                rfqId: this.data.id,
                quantity: res.quantity,
                itemId: res.itemId,
                supplierId: res.supplierId,
                priceQuoted: res.priceQuoted,
                expectedArrivalDate: res.expectedArrivalDate,
                status: res.status
            };

            this.rfqItemService.createRfqItem(newRfqItem).subscribe(res =>{
                this.dialogRef.close({added: true});
            });
        }, error => {
            this.displayError();
        })
    }

    displayError(){
        const confirmation = this._fuseConfirmationService.open({
            "title": "Error",
            "message": "Something went wrong. Please tell Zayd exactly what you did to get this error.",
            "icon": {
                "show": true,
                "name": "heroicons_outline:exclamation",
                "color": "warn"
            },
            "actions": {
                "confirm": {
                    "show": false,
                    "label": "Remove",
                    "color": "warn"
                },
                "cancel": {
                    "show": false,
                    "label": "Cancel"
                }
            },
            "dismissible": true
        });

        confirmation.afterClosed().subscribe((result) => {

        });
    }


}
