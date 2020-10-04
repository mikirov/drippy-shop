import {Component, Input, OnInit} from '@angular/core';
import {PreviewProduct} from '../../models/product';

@Component({
  selector: 'app-product-preview',
  templateUrl: './product-preview.component.html',
  styleUrls: ['./product-preview.component.scss']
})
export class ProductPreviewComponent implements OnInit {

  @Input() product: PreviewProduct;

  constructor() { }

  ngOnInit(): void {
  }

}
