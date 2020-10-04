import {Component, OnInit, Injectable, PLATFORM_ID, Inject} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {Observable} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {ProductService} from '../../services/product.service';
import {Product} from '../../models/product';
import {MatDialog} from "@angular/material/dialog";
import {SearchComponent} from "../search/search.component";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    public products: Product[] = [];

    public languages = [{
        name: 'English',
        code: 'en'
    }, {
        name: 'Български',
        code: 'bg'
    }];

    public currencies = [{
        name: 'Лев',
        currency: 'лв',
        price: 1 // price of lev
    }, {
        name: 'Euro',
        currency: 'EUR',
        price: 0.51 // price of inr
    }, {
        name: 'Pound',
        currency: 'GBP',
        price: 0.47 // price of euro
    }, {
        name: 'Dollar',
        currency: 'USD',
        price: 0.59 // price of usd
    }];

    // tslint:disable-next-line:ban-types
    constructor(@Inject(PLATFORM_ID) private platformId: Object,
                private translate: TranslateService,
                public productService: ProductService, public dialog: MatDialog) {
        this.productService.cartItems.subscribe(response => this.products = response);
        translate.setDefaultLang('en');
    }

    ngOnInit(): void {
    }

    changeLanguage(code) {
        if (isPlatformBrowser(this.platformId)) {
            this.translate.use(code);
        }
    }

    get getTotal(): Observable<number> {
        return this.productService.cartTotalAmount();
    }

    removeItem(product: any) {
        this.productService.removeCartItem(product);
    }

    changeCurrency(currency: any) {
        this.productService.Currency = currency;
    }

    openSearch() {
        const dialogRef = this.dialog.open(SearchComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%'
        });

        // dialogRef.afterClosed().subscribe(result => {
        //     console.log(`Dialog result: ${result}`);
        // });
    }
}
