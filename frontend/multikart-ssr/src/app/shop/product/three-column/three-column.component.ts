import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductDetailsMainSlider, ProductDetailsThumbSlider} from '../../../shared/data/slider';
import {Product} from '../../../shared/models/product';
import {ProductService} from '../../../shared/services/product.service';
import {SizeModalComponent} from '../../../shared/components/modal/size-modal/size-modal.component';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {AuthService} from '../../../shared/services/auth.service';
import {CheckoutService} from '../../../shared/services/checkout.service';
import {MatDialog} from '@angular/material/dialog';
import {CheckoutComponent} from '../../../shared/components/checkout/checkout.component';
import {catchError} from 'rxjs/operators';

@Component({
    selector: 'app-three-column',
    templateUrl: './three-column.component.html',
    styleUrls: ['./three-column.component.scss']
})

export class ThreeColumnComponent {


    checkoutUrl = '';

    constructor(private route: ActivatedRoute, private router: Router,
                public productService: ProductService, public checkoutService: CheckoutService, public auth: AuthService,
                public dialog: MatDialog, private http: HttpClient) {

        const productId = this.route.snapshot.paramMap.get('id');
        if (productId) {
            this.product$ = this.productService.getProduct(productId);
            this.product$.subscribe(product => {
                this.product = product;
                this.checkoutUrl = this.checkoutService.checkoutWithEcont([product]);
            });
        } else {
            this.router.navigateByUrl('pages/404', {skipLocationChange: true});
        }
    }


    public product$: Observable<Product>;
    public product: Product;
    public counter = 1;
    public activeSlide: any = 0;
    public selectedSize: any;
    isCheckingOut = false;


    @ViewChild('sizeChart') SizeChart: SizeModalComponent;

    public ProductDetailsMainSliderConfig: any = ProductDetailsMainSlider;
    public ProductDetailsThumbConfig: any = ProductDetailsThumbSlider;


    // Get Product Color
    Color(variants) {
        const uniqColor = [];
        for (let i = 0; i < Object.keys(variants).length; i++) {
            if (uniqColor.indexOf(variants[i].color) === -1 && variants[i].color) {
                uniqColor.push(variants[i].color);
            }
        }
        return uniqColor;
    }

    // Get Product Size
    Size(variants) {
        const uniqSize = [];
        for (let i = 0; i < Object.keys(variants).length; i++) {
            if (uniqSize.indexOf(variants[i].size) === -1 && variants[i].size) {
                uniqSize.push(variants[i].size);
            }
        }
        return uniqSize;
    }

    selectSize(size) {
        this.selectedSize = size;
    }

    // Increament
    increment() {
        this.counter++;
    }

    // Decrement
    decrement() {
        if (this.counter > 1) {
            this.counter--;
        }
    }

    // Add to cart
    async addToCart(product: any) {
        product.quantity = this.counter || 1;
        const status = await this.productService.addToCart(product);
        if (status) {
            this.router.navigate(['/shop/cart']);
        }
    }

    // Buy Now
    async buyNow(product: any) {
        product.quantity = this.counter || 1;
        const status = await this.productService.addToCart(product);
        if (status) {
            this.router.navigate(['/shop/checkout']);
        }
    }

    // Add to Wishlist
    addToWishlist(product: any) {
        this.productService.addToWishlist(product);
    }

    setCheckingOut() {
        this.isCheckingOut = !this.isCheckingOut;
    }


    openCheckout() {
        const dialogRef = this.dialog.open(CheckoutComponent, {
            width: 'auto',
            height: 'auto',
            maxHeight: '100%',
            maxWidth: '100%',
            data: {
                products: [this.product]
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            // if (result.shipment_error) {
            //     console.log(result.shipment_error);
            //     return;
            // }
            // TODO: post request to ekont
            const payload = {
                id: '',
                orderNumber: '',
                status: '',
                orderTime: new Date(),
                cod: 1,
                partialDelivery: 0,
                currency: 'BGN',
                shipmentDescription: 'дрехи',
                shipmentNumber: '',
                customerInfo: { // Type: CustomerInfo -> http://delivery.econt.com/services/#CustomerInfo
                    id: result.id,
                    name: result.name,
                    face: result.face,
                    phone: result.phone,
                    'e-mail': result.email,
                    countryCode: result.country_code,
                    cityName: result.city_name,
                    postCode: result.post_code,
                    officeCode: result.office_code,
                    zipCode: result.zip,
                    address: result.address,
                    priorityFrom: '',
                    priorityTo: '',
                },
                items: [
                    {
                        name: this.product.name,
                        SKU: this.product.id,
                        URL: 'www.drippy.shop/shop/product/' + this.product.id,
                        count: 1,
                        hideCount: 1,
                        totalPrice: this.product.price,
                        totalWeight: 0.5
                    }
                ]
            };
            const httpOptions = {
                headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        Authorization: environment.PRIVATE_KEY,
                    },
                )
            };
            this.http.post(environment.UPDATE_ORDER_ENDPOINT, payload, httpOptions)
                .subscribe((response) => {
                    console.log(response);
                });
        });
    }

    openEcontCheckout() {
        window.open(this.checkoutUrl, 'econt-delivery-order', 'width=600,height=840');
    }

    private handleError(payload: any) {

        // tslint:disable-next-line:only-arrow-functions ban-types
        return function(p1: any, p2: Observable<Object>) {
            return undefined;
        };
    }
}
