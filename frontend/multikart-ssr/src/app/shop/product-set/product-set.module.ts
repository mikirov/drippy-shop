import {NgModule} from '@angular/core';
import {ProductSetComponent} from './product-set.component';
import {ProductSetRoutingModule} from './product-set-routing.module';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxDropzoneModule} from 'ngx-dropzone';
import {ImagePreviewComponent} from './image-preview/image-preview.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ImageCropperModule} from 'ngx-img-cropper';
import {AgmCoreModule} from '@agm/core';
// import {ProductSharedModule} from '../product-shared.module';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';
import {SharedModule} from '../../shared/shared.module';
import { ProductPreviewComponent } from './product-preview/product-preview.component';

@NgModule({
    declarations: [
        ProductSetComponent,
        // ImageComponent,
        ImagePreviewComponent,

        ProductPreviewComponent,
    ],
    imports: [
        SharedModule,
        ProductSetRoutingModule,
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
})
export class ProductSetModule {
}
