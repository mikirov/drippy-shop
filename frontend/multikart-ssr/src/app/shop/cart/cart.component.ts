import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {ProductService} from '../../shared/services/product.service';
import {Product} from '../../shared/models/product';
import {CheckoutService} from '../../shared/services/checkout.service';
import {CheckoutComponent} from "../../shared/components/checkout/checkout.component";
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

    public products: Product[] = [];
    private cartItems: Product[] = []

    constructor(public productService: ProductService, public checkoutService: CheckoutService, private dialog: MatDialog,
                private toastrService: ToastrService) {
        this.productService.cartItems.subscribe(response => {

            this.cartItems = response;

            console.log(this.products);
        });
        this.productService.getProducts.subscribe(availableProducts => {
            console.log(availableProducts);
            this.products = availableProducts.filter(ap => {
                if (ap.stock === 0) {
                    return false;
                }
                for (const p of this.cartItems) {
                    if (p.id === ap.id) {
                        return true;
                    }
                }
                return false;
            });
        });
    }

    ngOnInit(): void {
    }

    public get getTotal(): Observable<number> {
        return this.productService.cartTotalAmount();
    }

    // Increament
    increment(product, qty = 1) {
        this.productService.updateCartQuantity(product, qty);
    }

    // Decrement
    decrement(product, qty = -1) {
        this.productService.updateCartQuantity(product, qty);
    }

    public removeItem(product: any) {
        this.productService.removeCartItem(product);
    }

    checkoutProducts(products: Product[]) {
        this.dialog.open(CheckoutComponent, {
            width: '600px',
            height: '840px',
            data: {
                products
            }
        });
    }
}
