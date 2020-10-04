import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {MatDialogRef} from '@angular/material/dialog';
import {first, tap} from "rxjs/operators";
import {Router} from "@angular/router";

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

    constructor(public productService: ProductService, private dialogRef: MatDialogRef<SearchComponent>, private router: Router) {
    }

    ngOnInit(): void {
    }

    navigateToEntity(id) {
      this.dialogRef.afterClosed().pipe(
          tap(() => this.router.navigate(['/shop/product/', id])),
          first()
      ).subscribe();
      this.dialogRef.close();
    }
}
