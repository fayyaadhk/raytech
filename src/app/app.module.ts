import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { FuseMockApiModule } from '@fuse/lib/mock-api';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { mockApiServices } from 'app/mock-api';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { AngularMaterialModule } from './angular-material.module';
import { SupplierModule } from './supplier/supplier.module';
import {ClientModule} from './client/client.module';
import {AddClientModule} from './client/add-client/add-client.module';
import {AddSupplierModule} from './supplier/add-supplier/add-supplier.module';
import {RfqModule} from './rfq/rfq.module';
import {CategoryModule} from './category/category.module';
import {ItemModule} from './item/item.module';
import {AddRfqModule} from './rfq/add-rfq/add-rfq.module';
import {AddCategoryModule} from './category/add-category/add-category.module';

const routerConfig: ExtraOptions = {
    preloadingStrategy       : PreloadAllModules,
    scrollPositionRestoration: 'enabled'
};

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),

        // Fuse, FuseConfig & FuseMockAPI
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),

        // Core module of your application
        CoreModule,

        // Layout module of your application
        LayoutModule,

        // 3rd party modules that require global configuration via forRoot
        MarkdownModule.forRoot({}),
        AngularMaterialModule,
        SupplierModule,
        ClientModule,
        AddSupplierModule,
        AddClientModule,
        RfqModule,
        AddRfqModule,
        ItemModule,
        CategoryModule,
        AddCategoryModule,
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
