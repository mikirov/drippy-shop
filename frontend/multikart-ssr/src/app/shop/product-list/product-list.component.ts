import {Component, Input, OnInit, Output, ViewChild, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {Product} from '../../shared/models/product';
import { VirtualScrollerComponent} from 'ngx-virtual-scroller';
import {IPageInfo} from "ngx-virtual-scroller/virtual-scroller";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnChanges {

  @ViewChild(VirtualScrollerComponent)
  scroller: VirtualScrollerComponent;
  loading = false;
  viewportItems: Product[];
  @Input()
  products: Product[];
  @Input()
  theEnd = false; // todo make automatic by response []
  @Output()
  nextBatchEmitter = new EventEmitter<any>();
  @Output()
  more = new EventEmitter();
  private get total() {
    return this.products.length;
  }
  // constructor(private db: AngularFirestore) {
  //     const chancee = new chance.Chance();
  //     const coordinates = {lat: chancee.latitude(), lng: chancee.longitude()};
  //     for (let i = 0; i < 40; i++) {
  //         this.db.collection('products').add({
  //             id: this.db.createId(),
  //             name: chancee.name(),
  //             sellerUid: 'srK9w1MhosSUDCMiA3vGLyMt4Vk2',
  //             description: chancee.paragraph(),
  //             price: chancee.integer({min: 10, max: 1500}),
  //             coordinates: coordinates,
  //             previewUrls: [chancee.avatar({protocol: 'https'})]
  //         } as Product);
  //     }
  // }

  nextBatch(event: IPageInfo, offset) {
    console.log(event);
    if (event.endIndex !== this.total - 1 || this.theEnd) {
      return;
    }
    this.loading = true;

    console.log('%c next please', 'color: brown');
    this.nextBatchEmitter.emit(offset);
    this.more.emit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loading = false; // when product changes, new products have been loaded and so stop loading
    console.log(this.products);
  }

  trackById(index, item: Product) {
    return item.id;
  }

}
