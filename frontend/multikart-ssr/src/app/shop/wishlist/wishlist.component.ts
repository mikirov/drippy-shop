import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ProductService} from '../../shared/services/product.service';
import {Product} from '../../shared/models/product';
import {CheckoutService} from '../../shared/services/checkout.service';

@Component({
    selector: 'app-wishlist',
    templateUrl: './wishlist.component.html',
    styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {

    public products: Product[] = [];

    constructor(private router: Router,
                public productService: ProductService, public checkoutService: CheckoutService) {
        this.productService.wishlistItems.subscribe(response => this.products = response);
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

}
