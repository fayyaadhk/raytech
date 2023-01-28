import {Component, OnInit} from '@angular/core';
import {ClientService} from "./client.service";
import {Subject, takeUntil} from "rxjs";
import {Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {Client} from "./client.model";
import {FuseConfirmationService} from "../../@fuse/services/confirmation";

@Component({
    selector: 'app-client',
    templateUrl: './client.component.html',
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
export class ClientComponent implements OnInit {
    clients: any = [];
    endsubs$: Subject<any> = new Subject<any>();
    isLoading: boolean = false;
    dataSource: MatTableDataSource<Client>;
    displayedColumns = ['id', 'name', 'buyer', 'editDelete'];

    constructor(private clientService: ClientService,
                private router: Router,
                private fuseConfirmationService: FuseConfirmationService) {
    }

    ngOnInit() {
        this.isLoading = true;
        this._getClients();
        // Assign the data to the data source for the table to render
    }

    createClient() {
        this.router.navigateByUrl('clients/form');
    }

    updateClient(clientId: string) {
        this.router.navigateByUrl(`clients/form/${clientId}`);
    }

    deleteClient(clientId: string) {
        const confirmation = this.fuseConfirmationService.open({
            title: 'Delete client',
            message: 'Are you sure you want to remove this client? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete'
                }
            }
        });

        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if (result === 'confirmed') {
                this.clientService.deleteClient(clientId).pipe(takeUntil(this.endsubs$)).subscribe(() => {
                    this._getClients();
                });
            }
        });
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    private _getClients() {
        this.clientService
            .getClients()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((clients) => {
                this.clients = clients;
                this.dataSource = new MatTableDataSource(this.clients);
                this.isLoading = false;
            });
    }
}
