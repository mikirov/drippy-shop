import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CarouselModule} from 'ngx-owl-carousel-o';
import {BarRatingModule} from 'ngx-bar-rating';
import {LazyLoadImageModule} from 'ng-lazyload-image';
import {NgxSkeletonLoaderModule} from 'ngx-skeleton-loader';
import {TranslateModule} from '@ngx-translate/core';

// Header and Footer Components
import {HeaderOneComponent} from './header/header-one/header-one.component';
import {HeaderTwoComponent} from './header/header-two/header-two.component';
import {FooterTwoComponent} from './footer/footer-two/footer-two.component';
import {HeaderThreeComponent} from './header/header-three/header-three.component';
import {HeaderFourComponent} from './header/header-four/header-four.component';

// Components
import {LeftMenuComponent} from './components/left-menu/left-menu.component';
import {MenuComponent} from './components/menu/menu.component';
import {SettingsComponent} from './components/settings/settings.component';
import {CategoriesComponent} from './components/categories/categories.component';
import {BreadcrumbComponent} from './components/breadcrumb/breadcrumb.component';
import {ProductBoxOneComponent} from './components/product/product-box-one/product-box-one.component';
import {ProductBoxTwoComponent} from './components/product/product-box-two/product-box-two.component';
import {ProductBoxThreeComponent} from './components/product/product-box-three/product-box-three.component';
import {ProductBoxFourComponent} from './components/product/product-box-four/product-box-four.component';
import {ProductBoxFiveComponent} from './components/product/product-box-five/product-box-five.component';
import {ProductBoxVerticalComponent} from './components/product/product-box-vertical/product-box-vertical.component';
import {ProductBoxVerticalSliderComponent} from './components/product/product-box-vertical-slider/product-box-vertical-slider.component';

// Modals Components
import {NewsletterComponent} from './components/modal/newsletter/newsletter.component';
import {QuickViewComponent} from './components/modal/quick-view/quick-view.component';
import {CartModalComponent} from './components/modal/cart-modal/cart-modal.component';
import {CartVariationComponent} from './components/modal/cart-variation/cart-variation.component';
import {VideoModalComponent} from './components/modal/video-modal/video-modal.component';
import {SizeModalComponent} from './components/modal/size-modal/size-modal.component';
import {AgeVerificationComponent} from './components/modal/age-verification/age-verification.component';

// Skeleton Loader Components
import {SkeletonProductBoxComponent} from './components/skeleton/skeleton-product-box/skeleton-product-box.component';


// Tap To Top
import {TapToTopComponent} from './components/tap-to-top/tap-to-top.component';

// Pipes
import {DiscountPipe} from './pipes/discount.pipe';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MaterialModule} from './material/material.module';
import {SafePipe} from './pipes/safe.pipe';
import {NgAisModule} from 'angular-instantsearch';
import {CheckoutComponent} from './components/checkout/checkout.component';
import {ProductPreviewComponent} from './components/product-preview/product-preview.component';
import {ImagePreviewComponent} from './components/image-preview/image-preview.component';
import {NgxDropzoneModule} from "ngx-dropzone";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {ImageCropperModule} from "ngx-img-cropper";
import {AgmCoreModule} from "@agm/core";
import {FormlyMaterialModule} from "@ngx-formly/material";
import {FormlyModule} from "@ngx-formly/core";
import { SearchComponent } from './components/search/search.component';

@NgModule({
    declarations: [
        HeaderOneComponent,
        // FooterOneComponent,
        HeaderTwoComponent,
        FooterTwoComponent,
        HeaderThreeComponent,
        // FooterThreeComponent,
        HeaderFourComponent,
        // FooterFourComponent,
        LeftMenuComponent,
        MenuComponent,
        SettingsComponent,
        BreadcrumbComponent,
        CategoriesComponent,
        ProductBoxOneComponent,
        ProductBoxTwoComponent,
        ProductBoxThreeComponent,
        ProductBoxFourComponent,
        ProductBoxFiveComponent,
        ProductBoxVerticalComponent,
        ProductBoxVerticalSliderComponent,
        NewsletterComponent,
        QuickViewComponent,
        CartModalComponent,
        CartVariationComponent,
        VideoModalComponent,
        SizeModalComponent,
        AgeVerificationComponent,
        SkeletonProductBoxComponent,
        TapToTopComponent,
        DiscountPipe,
        SafePipe,
        CheckoutComponent,
        ProductPreviewComponent,
        ImagePreviewComponent,
        SearchComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        CarouselModule,
        BarRatingModule,
        LazyLoadImageModule.forRoot({
            // preset: scrollPreset // <-- tell LazyLoadImage that you want to use scrollPreset
        }),
        NgxSkeletonLoaderModule,
        TranslateModule,
        MaterialModule,
        NgAisModule,
        ReactiveFormsModule,
        NgxDropzoneModule,
        DragDropModule,
        ImageCropperModule,
        AgmCoreModule,
        // ProductSharedModule,
        FormlyMaterialModule,
        FormlyModule.forRoot({
          validationMessages: [
            { name: 'required', message: 'This field is required' },
          ],
        }),
    ],
    exports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        NgbModule,
        CarouselModule,
        BarRatingModule,
        LazyLoadImageModule,
        NgxSkeletonLoaderModule,
        TranslateModule,
        HeaderOneComponent,
        // FooterOneComponent,
        HeaderTwoComponent,
        FooterTwoComponent,
        HeaderThreeComponent,
        // FooterThreeComponent,
        HeaderFourComponent,
        // FooterFourComponent,
        BreadcrumbComponent,
        CategoriesComponent,
        ProductBoxOneComponent,
        ProductBoxTwoComponent,
        ProductBoxThreeComponent,
        ProductBoxFourComponent,
        ProductBoxFiveComponent,
        ProductBoxVerticalComponent,
        ProductBoxVerticalSliderComponent,
        NewsletterComponent,
        QuickViewComponent,
        CartModalComponent,
        CartVariationComponent,
        VideoModalComponent,
        SizeModalComponent,
        AgeVerificationComponent,
        SkeletonProductBoxComponent,
        TapToTopComponent,
        DiscountPipe,
        ProductPreviewComponent,
        ImagePreviewComponent,

    ]
})
export class SharedModule {
}
