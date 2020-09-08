import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetailsMainSlider, ProductDetailsThumbSlider } from '../../../shared/data/slider';
import { Product } from '../../../shared/models/product';
import { ProductService } from '../../../shared/services/product.service';
import { SizeModalComponent } from '../../../shared/components/modal/size-modal/size-modal.component';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-three-column',
  templateUrl: './three-column.component.html',
  styleUrls: ['./three-column.component.scss']
})

export class ThreeColumnComponent implements OnInit {

  public product: Product = {};
  public counter = 1;
  public activeSlide: any = 0;
  public selectedSize: any;

  @ViewChild('sizeChart') SizeChart: SizeModalComponent;

  public ProductDetailsMainSliderConfig: any = ProductDetailsMainSlider;
  public ProductDetailsThumbConfig: any = ProductDetailsThumbSlider;

  constructor(private route: ActivatedRoute, private router: Router,
              public productService: ProductService, public http: HttpClient) {
      this.route.data.subscribe(response => this.product = response.data );
    }



  ngOnInit(): void {
  }

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
    this.counter++ ;
  }

  // Decrement
  decrement() {
    if (this.counter > 1) { this.counter-- ; }
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

  buyNowWithEcont(product: Product){
    const orderParams = {
      id_shop: environment.delivery_econt_shop_id, //идентификатор на магазина
      currency:'BGN',//валута на поръчката
      items: [ //списък с продуктите в количката
        {
          name: product.title,//Име на продукта
          // SKU:'ITM1',//Код на продукта (опционално)
          // URL:'http://example.org/shop/product-name-2',//адрес на продукта в магазина (опционално)
          // imageURL:'http://example.org/shop/product-images/product-name-2.jpg',//адрес картинка на продукта (опционално)
          count: 1,//закупени бройки (по избор, 1 по подразбиране)
          hideCount: 1,//приема стойности 0 и 1. Служи за скриване на формата за промяна на количество.
          totalWeight: 0.5,//общо тегло (тегло * брой)
          totalPrice: product.price //обща цена (ед. цена * брой)
        }
      ]
    };
    const url = 'http://delivery.econt.com/checkout.php'; // + jQuery.param(orderParams);

    const parameters = new HttpParams();
    for (const key in orderParams) {
      if (orderParams.hasOwnProperty(key)) {
        const element = orderParams[key];

        parameters.set(key, element);
      }
    }
    this.http.get(url, {params: parameters});
  }

  // Add to Wishlist
  addToWishlist(product: any) {
    this.productService.addToWishlist(product);
  }

}
