import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Product} from '../models/product';
import param from 'jquery-param';
import {CheckoutComponent} from "../components/checkout/checkout.component";
import {MatDialog} from "@angular/material/dialog";

@Injectable({
    providedIn: 'root'
})
export class CheckoutService {

    constructor(private http: HttpClient, private dialog: MatDialog) {
    }

    public openEcontCheckout(products: Product[]) {
        window.open(this.checkoutWithEcont(products), 'econt-delivery-order', 'width=600,height=840');
    }

    openDialog(products: Product[]) {
        this.dialog.open(CheckoutComponent, {
            width: '600px',
            height: '840px',
            data: {
                products
            }
        });
    }

    userInfoEcont(){
        return environment.SHIPPMENT_CALC_URL;
    }

    checkoutWithEcont(products: Product[]) {
        // console.log(this.product);
        const orderParams = {
            id_shop: environment.delivery_econt_shop_id, // идентификатор на магазина
            currency: 'BGN', // валута на поръчката
            items: []
        };
        products.forEach(product => {

            orderParams.items.push({
                name: product.name, // Име на продукта
                SKU: product.id, // Код на продукта (опционално)
                URL: 'http://www.drippy.shop/shop/product/' + product.id, // адрес на продукта в магазина (опционално)
                imageURL: product.urls[0], // адрес картинка на продукта (опционално)
                count: 1, // закупени бройки (по избор, 1 по подразбиране)
                hideCount: 1, // приема стойности 0 и 1. Служи за скриване на формата за промяна на количество.
                totalWeight: 0.5, // общо тегло (тегло * брой)
                totalPrice: (product.price * product.discount) / 100 // обща цена (ед. цена * брой)
            });
        });

        return 'https://delivery.econt.com/checkout.php?' + param(orderParams);
    }
}
