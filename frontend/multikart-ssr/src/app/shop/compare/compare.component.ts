import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ProductService} from "../../shared/services/product.service";
import {Product} from "../../shared/models/product";
import {combineLatest} from "rxjs";

@Component({
    selector: 'app-compare',
    templateUrl: './compare.component.html',
    styleUrls: ['./compare.component.scss']
})
export class CompareComponent implements OnInit {

    public products: Product[] = [];

    compareItems: Product[] = [];

    constructor(private router: Router,
                public productService: ProductService) {
        combineLatest(this.productService.getProducts, this.productService.compareItems)
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
        }
    }

    removeItem(product: any) {
        this.productService.removeCompareItem(product);
    }

}
