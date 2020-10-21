import {Component, OnInit} from '@angular/core';
import {forkJoin, Observable, combineLatest} from 'rxjs';
import {ProductService} from '../../shared/services/product.service';
import {Product} from '../../shared/models/product';
import {CheckoutService} from '../../shared/services/checkout.service';
import {CheckoutComponent} from '../../shared/components/checkout/checkout.component';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

    public products: Product[] = [];

    constructor(public productService: ProductService, public checkoutService: CheckoutService, private dialog: MatDialog,
                private toastrService: ToastrService, private router: Router) {

        combineLatest(this.productService.getProducts, this.productService.cartItems)
            .subscribe(([allProducts, cartItems]) => {
                // const availableProducts = result[0];
                // const cartItems = result[1];
                // console.log(availableProducts);
                // console.log(cartItems);
                this.products = cartItems.filter(p => {
                    if (p.stock === 0 || p.archived) {
                        return false;
                    }
                    for (const ap of allProducts) {
                        if (p.id === ap.id) {
                            if (ap.stock === 0 || ap.archived) {
                                return false;
                            }
                            return true;
                        }
                    }
                    return false;
                });
                console.log(this.products);
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

    async checkoutProducts(products: Product[]) {
        const dialogRef = this.dialog.open(CheckoutComponent, {
            width: '600px',
            height: '840px',
            data: {
                products
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'success') {
                this.products.forEach(p => this.productService.removeCartItem(p));
                this.router.navigateByUrl('/home', {skipLocationChange: true});
            }
        });
    }
}
