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
import {PreviewProduct, Product, Variants} from '../../shared/models/product';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../../shared/services/auth.service';
import {ProductService} from '../../shared/services/product.service';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatSelectChange} from '@angular/material/select';
import {MatRadioChange} from '@angular/material/radio';

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


    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    form = new FormGroup({});
    fields: FormlyFieldConfig[] = [];
    additionalDetails = {};
    newFiles: File[] = [];
    tags: string[] = [];
    collections: string[] = [];
    previewProduct$: Observable<PreviewProduct>;
    product = new Product();
    variants: Variants[] = [];
    currentVariant: Variants = {};

    uploading = false;
    private NAME_MIN_LENGTH = 3;
    private NAME_MAX_LENGTH = 50;
    private DESCRIPTION_MAX_LENGTH = 10000;
    productForm = this.formBuilder.group({
        name: [null, Validators.compose(
            [Validators.required, Validators.minLength(this.NAME_MIN_LENGTH), Validators.maxLength(this.NAME_MAX_LENGTH)])],
        brand: [null],
        description: [null, Validators.compose(
            [Validators.required, Validators.maxLength(this.DESCRIPTION_MAX_LENGTH)])],
        price: [50, Validators.compose([Validators.required, Validators.min(1), Validators.max(1000)])],
        stock: [1, Validators.compose([Validators.required, Validators.min(1), Validators.max(1000)])],
        quantity: [1, Validators.compose([Validators.required, Validators.min(1), Validators.max(1000)])],
        discount: [0, Validators.compose([Validators.min(0), Validators.max(100)])]
    });


    productNew = false;
    productSale = false;

    variantForm = this.formBuilder.group({
        size: ['M', Validators.required],
        color: [null, Validators.required],
        imageIndex: [0, Validators.required]
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

    addTag(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        // Add our fruit
        if ((value || '').trim()) {
            this.tags.push(value.trim());
        }
        // Reset the input value
        if (input) {
            input.value = '';
        }
    }

    removeTag(tag: string): void {
        const index = this.tags.indexOf(tag);

        if (index >= 0) {
            this.tags.splice(index, 1);
        }
    }

    addCollection(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        // Add our fruit
        if ((value || '').trim()) {
            this.collections.push(value.trim());
        }
        // Reset the input value
        if (input) {
            input.value = '';
        }
    }

    removeCollection(collection: string): void {
        const index = this.collections.indexOf(collection);

        if (index >= 0) {
            this.collections.splice(index, 1);
        }
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
                this.productForm.controls.brand.setValue(this.product.brand);
                this.productForm.controls.stock.setValue(this.product.stock);
                this.productForm.controls.quantity.setValue(this.product.quantity);
                this.productForm.controls.discount.setValue(this.product.discount);
                this.tags = this.product.tags;
                this.variants = this.product.variants;
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
        alert('product successfully created');
        this.router.navigate(['shop/product', productId]);
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

    onFilesSelected(files
                        :
                        File[]
    ) {
        this.newFiles = files;
    }

    uploadFile(file
                   :
                   File
    ):
        Promise<UploadTaskSnapshot> {
        const path = `images/${Date.now()}_${file.name}`;
        const task = this.storage.upload(path, file);
        return task.snapshotChanges().pipe(last()).toPromise() as Promise<UploadTaskSnapshot>;
    }

    async uploadAllFiles() {
        const uploads = await Promise.all(this.newFiles.map(file => this.uploadFile(file)));
        console.log(this.product.urls);
        this.product.urls = [...this.product.urls, ...await Promise.all(uploads.map(upload => upload.ref.getDownloadURL()))];
    }


    fillProductDetails(name: string, description: string, price: string, discount: string, quantity: string, stock: string, brand: string) {
        name = name.trim();
        description = description.trim();
        brand = brand.trim();
        const quantityInt = parseInt(quantity.trim(), 10);
        const stockInt = parseInt(stock.trim(), 10);
        const priceInt = parseInt(price.trim(), 10);
        const discountInt = parseInt(discount.trim(), 10);


        this.product.new = this.productNew;
        this.product.sale = this.productSale;
        this.product.tags = this.tags;
        this.product.collection = this.collections;
        this.product.name = name;
        this.product.description = description;
        this.product.price = priceInt;
        this.product.quantity = quantityInt;
        this.product.stock = stockInt;
        this.product.discount = discountInt;

    }


    onUrlsSelected($event: string[]) {
        this.urlsChanges.next($event);
    }

    setType(event: MatSelectChange) {
        this.product.type = event.value;
    }

    setCategory(event: MatSelectChange) {
        this.product.category = event.value;
    }

    setVariationSize(event: MatRadioChange) {
        this.currentVariant.size = event.value;
    }

    addVariation(color: string, imageIndex: string) {
        this.currentVariant.color = color.trim();
        this.currentVariant.image_id = parseInt(imageIndex.trim(), 1);
        this.variants.push(this.currentVariant);
        this.currentVariant = {};
        this.variantForm.controls.size.setValue('Universal');
        this.variantForm.controls.color.setValue('');
        this.variantForm.controls.imageIndex.setValue('');
    }
}
