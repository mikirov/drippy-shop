import {AfterViewInit, Component, ElementRef, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import {OrderService} from '../../services/order.service';
import {AuthService} from '../../services/auth.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {CheckoutService} from '../../services/checkout.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../../environments/environment.prod';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
    url = 'https://delivery.econt.com/customer_info.php';

    constructor(public dialogRef: MatDialogRef<CheckoutComponent>,
                @Inject(MAT_DIALOG_DATA) public data, private orderService: OrderService,
                private auth: AuthService,
                private http: HttpClient, private router: Router, private snackBar: MatSnackBar,
                private dialog: MatDialog) {

    }


    user;

    ngOnInit(): void {
        this.auth.user$.subscribe((user) => {
            this.user = user;
        });
        console.log(this.data.products);
    }

    @HostListener('window:message', ['$event'])
    async onCheckout(event) {
        const eventData = event.data;
        console.log(eventData);
        if (!eventData || eventData === '') {
            console.log('no data');
            return;
        }
        if (eventData.shippment_error && eventData.shipment_error !== '') {
            alert(eventData.shipment_error);
            return;
        }
        const dialogRef = this.dialog.open(ConfirmationDialogComponent);
        const result = await dialogRef.afterClosed().toPromise();
        console.log(result);
        if (!result) {
            return;
        }
        this.dialogRef.close();

        const payload = {
            id: '',
            orderNumber: '',
            status: '',
            orderTime: '',
            partialDelivery: 0,
            currency: environment.SHOP_CURRENCY,
            shipmentDescription: 'дрехи',
            shipmentNubmer: '',
            customerInfo: eventData,
            items: []
        };
        this.data.products.forEach(product => {
            payload.items.push({
                name: product.name, // Име на продукта
                SKU: product.id, // Код на продукта (опционално)
                URL: 'http://www.drippy.shop/shop/product/' + product.id, // адрес на продукта в магазина (опционално)
                imageURL: product.urls[0], // адрес картинка на продукта (опционално)
                count: 1, // закупени бройки (по избор, 1 по подразбиране)
                hideCount: 1, // приема стойности 0 и 1. Служи за скриване на формата за промяна на количество.
                totalWeight: 0.5, // общо тегло (тегло * брой)
                totalPrice: product.price  // обща цена (ед. цена * брой)
            });
        });

        const httpOptions = {
            headers: new HttpHeaders(
                {
                    'Content-Type': 'application/json',
                    Authorization: environment.PRIVATE_KEY
                })
        };
        await this.http.post(environment.UPDATE_ORDER_ENDPOINT, payload, httpOptions).toPromise();
        // TODO: create order

        const orderId = await this.orderService.create(this.data.products.map((product) => product.id), this.user);
        console.log('Created order with id:' + orderId);
        this.snackBar.open('Order successfully created', 'Okay');
        // this.dialogRef.close();

    }


}
