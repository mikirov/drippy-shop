import {Component, OnInit, ViewChild} from '@angular/core';
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
import {OrderService} from '../../../shared/services/order.service';
import {User} from '../../../shared/models/user';
import {MatDialog} from '@angular/material/dialog';
import {CheckoutComponent} from '../../../shared/components/checkout/checkout.component';

@Component({
    selector: 'app-three-column',
    templateUrl: './three-column.component.html',
    styleUrls: ['./three-column.component.scss']
})

export class ThreeColumnComponent {

    constructor(private route: ActivatedRoute, private router: Router,
                public productService: ProductService, public checkoutService: CheckoutService, public auth: AuthService,
                private http: HttpClient, private orderService: OrderService, private dialog: MatDialog) {

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
        this.auth.user$.subscribe((user) => {
            this.user = user;
        });

    }

    checkoutUrl = '';


    public product$: Observable<Product>;
    public product: Product;
    private user: User;
    public counter = 1;
    public activeSlide: any = 0;
    public selectedSize: any;
    isCheckingOut = false;


    @ViewChild('sizeChart') SizeChart: SizeModalComponent;

    public ProductDetailsMainSliderConfig: any = ProductDetailsMainSlider;
    public ProductDetailsThumbConfig: any = ProductDetailsThumbSlider;

    // Add to Wishlist
    currentUrl: string = window.location.href;


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

    addToWishlist(product: any) {
        if (this.user) {
            this.productService.addToWishlist(product);
        }
    }

    setCheckingOut() {
        this.isCheckingOut = !this.isCheckingOut;
    }


    private handleError(payload: any) {

        // tslint:disable-next-line:only-arrow-functions ban-types
        return function (p1: any, p2: Observable<Object>) {
            return undefined;
        };
    }

    openDialog(products: Product[]) {
        this.dialog.open(CheckoutComponent, {
            width: '600px',
            height: '840px',
            data: {
                products
            }
        }).afterClosed().subscribe((result) => {
            if (result === 'success') {
                this.productService.removeCartItem(this.product);
                this.router.navigateByUrl('/home', {skipLocationChange: true});
            }
        });
    }
}
