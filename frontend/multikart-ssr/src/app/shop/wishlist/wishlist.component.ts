import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ProductService} from '../../shared/services/product.service';
import {Product} from '../../shared/models/product';
import {CheckoutService} from '../../shared/services/checkout.service';
import {CheckoutComponent} from '../../shared/components/checkout/checkout.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
    selector: 'app-wishlist',
    templateUrl: './wishlist.component.html',
    styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {

    public products: Product[] = [];

    constructor(private router: Router,
                public productService: ProductService, public checkoutService: CheckoutService, private dialog: MatDialog) {
        this.productService.wishlistItems.subscribe(response => this.products = response);
        this.productService.getProducts.subscribe(availableProducts => {
            this.products = this.products.filter(p => {
                return availableProducts.indexOf(p) !== -1;
            });
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
