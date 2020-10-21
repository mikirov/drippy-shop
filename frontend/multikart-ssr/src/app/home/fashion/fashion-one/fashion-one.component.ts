import {Component, OnInit} from '@angular/core';
import {ProductSlider} from '../../../shared/data/slider';
import {Product} from '../../../shared/models/product';
import {ProductService} from '../../../shared/services/product.service';

@Component({
    selector: 'app-fashion-one',
    templateUrl: './fashion-one.component.html',
    styleUrls: ['./fashion-one.component.scss']
})
export class FashionOneComponent implements OnInit {

    public products: Product[] = [];
    public productCollections: any[] = [];

    // Product Tab collection
    currentYear: any;


    constructor(public productService: ProductService) {
        this.productService.getProducts.subscribe(response => {
            // this.products = response.filter(item => item.type === 'fashion');
            this.products = response;
            // Get Product Collection
            // console.log(response);

            this.products = this.products.filter(item => item.stock > 0);
            this.products.filter((item) => {
                item.collection.filter((collection) => {
                    const index = this.productCollections.indexOf(collection);
                    if (index === -1) {
                        this.productCollections.push(collection);
                    }
                });
            });
        });
        console.log(this.productCollections);
        this.currentYear = new Date().getFullYear();
    }

    public ProductSliderConfig: any = ProductSlider;

    public sliders = [{

        title: 'Women fashion',
        category: 'Women',
        // subTitle: 'Men fashion',
        image: 'assets/images/slider/1.jpg'
    }, {

        title: 'Men fashion',
        category: 'Men',
        // subTitle: 'Women fashion',
        image: 'assets/images/slider/2.jpg'
    }, {

        title: 'Accessories',
        category: 'Accessories',
        // subTitle: 'Women fashion',
        image: 'assets/images/slider/3.jpg'
    }
    ];

    // Collection banner
    public collections = [{
        image: 'assets/images/collection/fashion/1.jpg',
        save: 'save up to 50%',
        title: 'asian'
    }, {
        image: 'assets/images/collection/fashion/2.jpg',
        save: 'save up to 50%',
        title: 'tops'
    }

    ];

    // Blog
    // public blog = [{
    //   image: 'assets/images/blog/1.jpg',
    //   date: '25 January 2018',
    //   title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
    //   by: 'John Dio'
    // }, {
    //   image: 'assets/images/blog/2.jpg',
    //   date: '26 January 2018',
    //   title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
    //   by: 'John Dio'
    // }, {
    //   image: 'assets/images/blog/3.jpg',
    //   date: '27 January 2018',
    //   title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
    //   by: 'John Dio'
    // }, {
    //   image: 'assets/images/blog/4.jpg',
    //   date: '28 January 2018',
    //   title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
    //   by: 'John Dio'
    // }];

    // Logo
    public logo = [{
        image: 'assets/images/logos/1.png',
    },
        {
            image: 'assets/images/logos/2.png',
        }, {
            image: 'assets/images/logos/3.png',
        }, {
            image: 'assets/images/logos/4.png',
        }, {
            image: 'assets/images/logos/5.png',
        }, {
            image: 'assets/images/logos/6.png',
        }, {
            image: 'assets/images/logos/7.png',
        }, {
            image: 'assets/images/logos/8.png',
        }
    ];

    ngOnInit(): void {
    }


    getCollectionProducts(collection) {
        return this.products.filter((item) => {
            if (item.collection.find(i => i == collection)) {
                return item;
            }
        });
    }
}
