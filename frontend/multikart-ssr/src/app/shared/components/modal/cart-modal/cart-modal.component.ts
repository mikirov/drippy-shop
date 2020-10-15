import {
    Component, OnInit, OnDestroy, ViewChild, TemplateRef, Input, AfterViewInit,
    Injectable, PLATFORM_ID, Inject
} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {NgbModal, ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ProductService} from '../../../services/product.service';
import {Product} from '../../../models/product';
import {CheckoutService} from '../../../services/checkout.service';
import {CheckoutComponent} from '../../checkout/checkout.component';
import {MatDialog} from "@angular/material/dialog";

@Component({
    selector: 'app-cart-modal',
    templateUrl: './cart-modal.component.html',
    styleUrls: ['./cart-modal.component.scss']
})
export class CartModalComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input() product: Product;
    @Input() currency: any;

    @ViewChild('cartModal', {static: false}) CartModal: TemplateRef<any>;

    public closeResult: string;
    public modalOpen = false;
    public products: Product[] = [];

    // tslint:disable-next-line:ban-types
    constructor(@Inject(PLATFORM_ID) private platformId: Object,
                private modalService: NgbModal,
                private productService: ProductService,
                public dialog: MatDialog) {
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
    }

    openModal(product) {
        this.productService.getProducts.subscribe(response => this.products = response);
        this.products =  this.products.filter(items => items.category === product.category && items.id !== product.id);
        const status = this.productService.addToCart(product);
        if (status) {
            this.modalOpen = true;
            if (isPlatformBrowser(this.platformId)) { // For SSR
                this.modalService.open(this.CartModal, {
                    size: 'lg',
                    ariaLabelledBy: 'Cart-Modal',
                    centered: true,
                    windowClass: 'theme-modal cart-modal CartModal'
                }).result.then((result) => {
                    // tslint:disable-next-line:no-unused-expression
                    `Result ${result}`;
                }, (reason) => {
                    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                });
            }
        }
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    ngOnDestroy() {
        if (this.modalOpen) {
            this.modalService.dismissAll();
        }
    }

    openCheckoutDialog(products: Product[]) {
        this.modalService.dismissAll();
        this.dialog.open(CheckoutComponent, {
            width: '600px',
            height: '840px',
            data: {
                products
            }
        });
    }
}
