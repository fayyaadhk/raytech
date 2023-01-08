import {Component, OnInit} from '@angular/core';
import {ClientService} from "./client.service";
import {Subject, takeUntil} from "rxjs";
import {Router} from "@angular/router";

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
export class ClientComponent implements OnInit{
    clients: any = [];
    endsubs$: Subject<any> = new Subject<any>();
    isLoading: boolean = false;

    constructor(private clientService: ClientService,
                private router: Router,) {

    }

    ngOnInit(){
        this.isLoading = true;
        this._getClients();
    }

    createClient(){
        this.router.navigateByUrl('clients/form');
    }

    updateClient(clientId: string){
        this.router.navigateByUrl(`clients/form/${clientId}`);
    }

    deleteClient(clientId: string){
        this.clientService.deleteClient(clientId).pipe(takeUntil(this.endsubs$)).subscribe(() => {
            this._getClients();
        });
    }

    private _getClients(){
        this.clientService
            .getClients()
            .pipe(takeUntil(this.endsubs$))
            .subscribe((clients) => {
                this.clients = clients;
                this.isLoading = false;
            });
    }
}
