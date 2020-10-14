import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {ProductService} from '../../shared/services/product.service';
import {Product} from '../../shared/models/product';
import {CheckoutService} from '../../shared/services/checkout.service';
import {CheckoutComponent} from "../../shared/components/checkout/checkout.component";
import {MatDialog} from '@angular/material/dialog';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

    public products: Product[] = [];

    constructor(public productService: ProductService, public checkoutService: CheckoutService, private dialog: MatDialog) {
        this.productService.cartItems.subscribe(response => this.products = response);
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
        // TODO: get available products and popup that says that you can only checkout whats available
        this.productService.getProducts.subscribe(availableProducts => {
            products = products.filter(p => {
              return availableProducts.find(ap => availableProducts.indexOf(p));
            });
        });
        if (products.length === 0) {
          alert('Product is no longer available');
        }
        this.dialog.open(CheckoutComponent, {
            width: '600px',
            height: '840px',
            data: {
                products
            }
        });
    }
}
