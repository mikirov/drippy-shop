import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ProductService} from '../../shared/services/product.service';
import {Product} from '../../shared/models/product';
import {CheckoutService} from '../../shared/services/checkout.service';
import {CheckoutComponent} from '../../shared/components/checkout/checkout.component';
import {MatDialog} from '@angular/material/dialog';
import {combineLatest} from "rxjs";

@Component({
    selector: 'app-wishlist',
    templateUrl: './wishlist.component.html',
    styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {

    public products: Product[] = [];
    wishlistItems: Product[] = [];

    constructor(private router: Router,
                public productService: ProductService, public checkoutService: CheckoutService, private dialog: MatDialog) {
        combineLatest(this.productService.getProducts, this.productService.wishlistItems)
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

    async addToCart(product: any) {
        const status = await this.productService.addToCart(product);
        if (status) {
            this.router.navigate(['/shop/cart']);
            this.removeItem(product);
        }
    }

    removeItem(product: any) {
        this.productService.removeWishlistItem(product);
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
}
