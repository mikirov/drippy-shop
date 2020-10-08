import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, startWith, delay} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {Product} from '../models/product';
import {AngularFireStorage} from '@angular/fire/storage';
import {AngularFirestore} from '@angular/fire/firestore';

const state = {
    products: JSON.parse(localStorage.products || '[]'),
    wishlist: JSON.parse(localStorage.wishlistItems || '[]'),
    compare: JSON.parse(localStorage.compareItems || '[]'),
    cart: JSON.parse(localStorage.cartItems || '[]')
};

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    // public Currency = { name: 'Dollar', currency: 'USD', price: 1 }; // Default Currency
    public Currency = {name: 'Лев', currency: 'лв.', price: 1}; // Default Currency
    public OpenCart = false;
    public Products;

    constructor(private http: HttpClient,
                private toastrService: ToastrService,
                private db: AngularFirestore) {
    }

    /*
      ---------------------------------------------
      ---------------  Product  -------------------
      ---------------------------------------------
    */

    // Product
    private get products(): Observable<Product[]> {
        this.Products = this.db.collection<Product>('products').valueChanges();
        // this.Products = this.http.get<Product[]>('assets/data/products.json').pipe(map(data => data));
        // this.Products.subscribe(next => { localStorage['products'] = JSON.stringify(next) });
        // return this.Products = this.Products.pipe(startWith(JSON.parse(localStorage['products'] || '[]')));
        return this.Products;
    }

    // Get Products
    public get getProducts(): Observable<Product[]> {
        // return this.products;
        return this.db.collection<Product>('products').valueChanges();

    }

    // Get Products By Slug
    public getProduct(id: string): Observable<Product> {
        return this.db.doc<Product>(`products/${id}`).valueChanges();
        // return this.products.pipe(map(items => {
        //   return items.find((item: any) => {
        //     return item.title.replace(' ', '-') === slug;
        //   });
        // }));
    }

    async createProduct(data: any) {
        console.log('creating product');
        const key: string = data.id || this.db.createId();
        const product: Product = {id: key, ...data};
        const documentReference = this.db.doc<Product>(`/products/${key}`);
        await documentReference.set(Object.assign({}, product), {merge: true});
        return key;
    }

    /*
      ---------------------------------------------
      ---------------  Wish List  -----------------
      ---------------------------------------------
    */

    // Get Wishlist Items
    public get wishlistItems(): Observable<Product[]> {
        // return this.db.collection<Product>('wishlist').valueChanges();
        const itemsStream = new Observable(observer => {
            observer.next(state.wishlist);
            observer.complete();
        });
        return itemsStream as Observable<Product[]>;

    }

    // Add to Wishlist
    public addToWishlist(product): any {
        // console.log('creating wishlist item');
        // const key: string = data.id || this.db.createId();
        // const product: Product = {id: key, ...data};
        // const documentReference = this.db.doc<Product>(`/wishlist/${key}`);
        // await documentReference.set(Object.assign({}, product), {merge: true});
        // return key;
        // this.db.collection('wishlist').add(product);
        const wishlistItem = state.wishlist.find(item => item.id === product.id);
        if (!wishlistItem) {
            state.wishlist.push({
                ...product
            });
        }
        this.toastrService.success('Product has been added in wishlist.');
        localStorage.setItem('wishlistItems', JSON.stringify(state.wishlist));
        return true;
    }

    // Remove Wishlist items
    public removeWishlistItem(product: Product): any {
        // this.db.doc<Product>(`/wishlist/${product.id}`).delete();
        const index = state.wishlist.indexOf(product);
        state.wishlist.splice(index, 1);
        localStorage.setItem("wishlistItems", JSON.stringify(state.wishlist));
        return true;
    }

    /*
      ---------------------------------------------
      -------------  Compare Product  -------------
      ---------------------------------------------
    */

    // Get Compare Items
    public get compareItems(): Observable<Product[]> {
        const itemsStream = new Observable(observer => {
            observer.next(state.compare);
            observer.complete();
        });
        return itemsStream as Observable<Product[]>;
    }

    // Add to Compare
    public addToCompare(product): any {
        const compareItem = state.compare.find(item => item.id === product.id);
        if (!compareItem) {
            state.compare.push({
                ...product
            });
        }
        this.toastrService.success('Product has been added in compare.');
        localStorage.setItem('compareItems', JSON.stringify(state.compare));
        return true;
    }

    // Remove Compare items
    public removeCompareItem(product: Product): any {
        const index = state.compare.indexOf(product);
        state.compare.splice(index, 1);
        localStorage.setItem('compareItems', JSON.stringify(state.compare));
        return true;
    }

    /*
      ---------------------------------------------
      -----------------  Cart  --------------------
      ---------------------------------------------
    */

    // Get Cart Items
    public get cartItems(): Observable<Product[]> {
        const itemsStream = new Observable(observer => {
            observer.next(state.cart);
            observer.complete();
        });
        return itemsStream as Observable<Product[]>;
    }

    // Add to Cart
    public addToCart(product): any {
        const cartItem = state.cart.find(item => item.id === product.id);
        const qty = product.quantity ? product.quantity : 1;
        const items = cartItem ? cartItem : product;
        const stock = this.calculateStockCounts(items, qty);

        if (!stock) {
            return false;
        }

        if (cartItem) {
            cartItem.quantity += qty;
        } else {
            state.cart.push({
                ...product,
                quantity: qty
            });
        }

        this.OpenCart = true; // If we use cart variation modal
        localStorage.setItem('cartItems', JSON.stringify(state.cart));
        return true;
    }

    // Update Cart Quantity
    public updateCartQuantity(product: Product, quantity: number): Product | boolean {
        return state.cart.find((items, index) => {
            if (items.id === product.id) {
                const qty = state.cart[index].quantity + quantity;
                const stock = this.calculateStockCounts(state.cart[index], quantity);
                if (qty !== 0 && stock) {
                    state.cart[index].quantity = qty;
                }
                localStorage.setItem('cartItems', JSON.stringify(state.cart));
                return true;
            }
        });
    }

    // Calculate Stock Counts
    public calculateStockCounts(product, quantity) {
        const qty = product.quantity + quantity;
        const stock = product.stock;
        if (stock < qty || stock == 0) {
            this.toastrService.error('You can not add more items than available. In stock ' + stock + ' items.');
            return false;
        }
        return true;
    }

    // Remove Cart items
    public removeCartItem(product: Product): any {
        const index = state.cart.indexOf(product);
        state.cart.splice(index, 1);
        localStorage.setItem('cartItems', JSON.stringify(state.cart));
        return true;
    }

    // Total amount
    public cartTotalAmount(): Observable<number> {
        return this.cartItems.pipe(map((product: Product[]) => {
            return product.reduce((prev, curr: Product) => {
                let price = curr.price;
                if (curr.discount) {
                    price = curr.price - (curr.price * curr.discount / 100);
                }
                return (prev + price * curr.quantity) * this.Currency.price;
            }, 0);
        }));
    }

    /*
      ---------------------------------------------
      ------------  Filter Product  ---------------
      ---------------------------------------------
    */

    // Get Product Filter
    public filterProducts(filter: any): Observable<Product[]> {
        return this.products.pipe(map(product => {
                return product.filter((item: Product) => {
                    if (!filter.length) {
                        return true;
                    }
                    const Tags = filter.some((prev) => { // Match Tags
                        if (item.variants) {
                            for (const variant of item.variants) {
                                if (variant.color === prev || variant.size === prev) {
                                    return prev;
                                }
                            }
                        }
                    });
                    return Tags;
                });
            }
        ));
    }

    // Sorting Filter
    public sortProducts(products: Product[], payload: string): any {

        if (payload === 'ascending') {
            return products.sort((a, b) => {
                if (a.id < b.id) {
                    return -1;
                } else if (a.id > b.id) {
                    return 1;
                }
                return 0;
            });
        } else if (payload === 'a-z') {
            return products.sort((a, b) => {
                if (a.name < b.name) {
                    return -1;
                } else if (a.name > b.name) {
                    return 1;
                }
                return 0;
            });
        } else if (payload === 'z-a') {
            return products.sort((a, b) => {
                if (a.name > b.name) {
                    return -1;
                } else if (a.name < b.name) {
                    return 1;
                }
                return 0;
            });
        } else if (payload === 'low') {
            return products.sort((a, b) => {
                if (a.price < b.price) {
                    return -1;
                } else if (a.price > b.price) {
                    return 1;
                }
                return 0;
            });
        } else if (payload === 'high') {
            return products.sort((a, b) => {
                if (a.price > b.price) {
                    return -1;
                } else if (a.price < b.price) {
                    return 1;
                }
                return 0;
            });
        }
    }

    /*
      ---------------------------------------------
      ------------- Product Pagination  -----------
      ---------------------------------------------
    */
    public getPager(totalItems: number, currentPage: number = 1, pageSize: number = 16) {
        // calculate total pages
        const totalPages = Math.ceil(totalItems / pageSize);

        // Paginate Range
        const paginateRange = 3;

        // ensure current page isn't out of range
        if (currentPage < 1) {
            currentPage = 1;
        } else if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        let startPage: number, endPage: number;
        if (totalPages <= 5) {
            startPage = 1;
            endPage = totalPages;
        } else if (currentPage < paginateRange - 1) {
            startPage = 1;
            endPage = startPage + paginateRange - 1;
        } else {
            startPage = currentPage - 1;
            endPage = currentPage + 1;
        }

        // calculate start and end item indexes
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        const pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

        // return object with all pager properties required by the view
        return {
            totalItems,
            currentPage,
            pageSize,
            totalPages,
            startPage,
            endPage,
            startIndex,
            endIndex,
            pages
        };
    }

//   constructor(
//       private db: AngularFirestore,
//       private storage: AngularFireStorage,
//       private http: HttpClient
//   ) {
//   }
//
//   getProducts(): Observable<Product[]> {
//     return this.db.collection<Product>('products').valueChanges();
//   }
//
// // TODO: store reference for the product in the service so you can manipulate it without making extra requests
//   getProduct(id: string): Observable<Product> {
//
//     return this.db.doc<Product>(`products/${id}`).valueChanges();
//   }
//
//   updateProduct(product: Product): Promise<void> {
//     return this.db.doc<Product>(`products/${product.id}`).update(product);
//   }
//
//   // parameter is object and not a product since we don't want the product id starting value(undefined)
//   async createProduct(data: any) {
//     console.log('creating product');
//     const key: string = data.id || this.db.createId();
//     const product: Product = {id: key, ...data};
//     const documentReference = this.db.doc<Product>(`/products/${key}`);
//     await documentReference.set(Object.assign({}, product), {merge: true});
//     return key;
//   }
//
//
//   deleteProduct(product: Product): Promise<void> {
//     return this.db.doc<Product>(`/products/${product.id}`).delete();
//   }

}
