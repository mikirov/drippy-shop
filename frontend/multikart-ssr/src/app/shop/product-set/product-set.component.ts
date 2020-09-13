import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFireStorage} from '@angular/fire/storage';
import {BehaviorSubject, combineLatest, Observable, Subject} from 'rxjs';
import {first, last, map, startWith} from 'rxjs/operators';
import UploadTaskSnapshot = firebase.storage.UploadTaskSnapshot;
import {FormlyFieldConfig} from '@ngx-formly/core';
import {ErrorStateMatcher} from '@angular/material/core';
import {User} from '../../shared/models/user';
import {PreviewProduct, Product} from '../../shared/models/product';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../../shared/services/auth.service';
import {ProductService} from '../../shared/services/product.service';

export class CustomErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

@Component({
    selector: 'app-product-create',
    templateUrl: './product-set.component.html',
    styleUrls: ['./product-set.component.scss']
})
export class ProductSetComponent implements OnInit {

    user: User;
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;

    form = new FormGroup({});
    fields: FormlyFieldConfig[] = [];
    additionalDetails = {};
    newFiles: File[] = [];

    previewProduct$: Observable<PreviewProduct>;
    product = new Product();
    uploading = false;
    private NAME_MIN_LENGTH = 3;
    private NAME_MAX_LENGTH = 50;
    private DESCRIPTION_MAX_LENGTH = 10000;
    productForm = this.formBuilder.group({
        name: [null, Validators.compose(
            [Validators.required, Validators.minLength(this.NAME_MIN_LENGTH), Validators.maxLength(this.NAME_MAX_LENGTH)])],
        description: [null, Validators.compose(
            [Validators.required, Validators.maxLength(this.DESCRIPTION_MAX_LENGTH)])],
        price: [null, Validators.required],
    });
    private urlsChanges = new BehaviorSubject<string[]>(['https://via.placeholder.com/500']);

    constructor(
        private productService: ProductService,
        public auth: AuthService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        private storage: AngularFireStorage,
        private dialog: MatDialog
    ) {

    }

    /*async*/
    ngOnInit() {
        const productId = this.activatedRoute.snapshot.paramMap.get('id');
        if (productId) {
            // if there was an id provided - use the data from the product
            this.productService.getProduct(productId).pipe(first()).toPromise().then(product => {
                this.product = product;
                this.productForm.controls.name.setValue(this.product.name);
                this.productForm.controls.description.setValue(this.product.description);
                this.productForm.controls.price.setValue(this.product.price);
                this.additionalDetails = product.additionalDetails;
                this.urlsChanges.next(this.product.urls);
            });
        }
        this.previewProduct$ = combineLatest(
            this.productForm.controls.name.valueChanges.pipe(
                startWith('Name')),
            this.productForm.controls.price.valueChanges.pipe(startWith(0)),
            this.urlsChanges
            // previewUrls as well
        ).pipe(
            map(([name, price, urls]: [string, number, string[]]) => ({name, price, urls}))
        );
    }

    async uploadProduct() {
        this.uploading = true;
        await this.uploadAllFiles();
        const productId = await this.productService.createProduct(this.product);
        this.uploading = false;
        console.log(productId);
        // const dialogRef = this.dialog.open(CheckoutComponent, {
        //     data: {productId},
        // });
        // dialogRef.afterClosed().subscribe(result => {
        //     this.router.navigate(['products']);
        // });
        alert('product successfully created');
        // this.router.navigate(['products', productId]);
    }


    getNameErrorMessage() {
        let message: string;
        if (this.productForm.controls.name.hasError('required')) {
            message = 'Product name is required';
        } else if (this.productForm.controls.name.hasError('minlength')) {
            message = `Product name must be more than ${this.NAME_MIN_LENGTH}`;
        } else if (this.productForm.controls.name.hasError('maxlength')) {
            message = `Product name must be less than ${this.NAME_MAX_LENGTH}`;
        }
        return message;
    }

    getDescriptionErrorMessage() {
        let message: string;
        if (this.productForm.controls.description.hasError('required')) {
            message = 'Product name is required';
        } else if (this.productForm.controls.description.hasError('maxlength')) {
            message = `Product name must be less than ${this.NAME_MAX_LENGTH}`;
        }
        return message;
    }

    onFilesSelected(files: File[]) {
        this.newFiles = [...this.newFiles, ...files];
    }

    uploadFile(file: File): Promise<UploadTaskSnapshot> {
        const path = `images/${Date.now()}_${file.name}`;
        const task = this.storage.upload(path, file);
        return task.snapshotChanges().pipe(last()).toPromise() as Promise<UploadTaskSnapshot>;
    }

    async uploadAllFiles() {
        const uploads = await Promise.all(this.newFiles.map(file => this.uploadFile(file)));
        console.log(this.product.urls);
        this.product.urls = [...this.product.urls, ...await Promise.all(uploads.map(upload => upload.ref.getDownloadURL()))];
    }


    fillProductDetails(name: string, description: string, price: string) {
        name = name.trim();
        description = description.trim();
        const priceInt = parseInt(price.trim(), 10);
        this.product.name = name;
        this.product.description = description;
        this.product.price = priceInt;
        this.product = {...this.product, additionalDetails: this.additionalDetails};
    }


    onUrlsSelected($event: string[]) {
        this.urlsChanges.next($event);
    }

}
