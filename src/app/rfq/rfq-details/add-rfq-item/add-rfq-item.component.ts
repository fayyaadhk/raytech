import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AddNewItemComponent} from "../../add-rfq/add-new-item/add-new-item.component";
import {RfqItemService} from "../../../rfq-item/rfq-item.service";
import {CreateRfqItem} from "../../../api/models/create-rfq-item";
import {RfqItemComponent} from "../../../rfq-item/rfq-item.component";

@Component({
    selector: 'app-add-rfq-item',
    templateUrl: './add-rfq-item.component.html',
    styleUrls: ['./add-rfq-item.component.scss']
})
export class AddRfqItemComponent implements OnInit {

    constructor(@Inject(MAT_DIALOG_DATA) public data,
                private dialogRef: MatDialogRef<AddRfqItemComponent>,
                private dialog: MatDialog,
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
                console.log(">>> Making service call", newRfqItem);

                this.rfqItemService.createRfqItem(newRfqItem).subscribe(res =>{
                    this.dialogRef.close({added: true});
                });
            }
        })
    }

    openAttachExistingItemDialog() {
        const dialogRef = this.dialog.open(RfqItemComponent, {
            width: '600px',
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
            console.log(">>> Making service call", newRfqItem);

            this.rfqItemService.createRfqItem(newRfqItem).subscribe(res =>{
                this.dialogRef.close({added: true});
            });
        })
    }


}
