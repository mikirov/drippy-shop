import {DragDropModule} from '@angular/cdk/drag-drop';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ImagePreviewComponent} from './image-preview.component';

describe('ImagePreviewComponent', () => {
    let component: ImagePreviewComponent;
    let fixture: ComponentFixture<ImagePreviewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ImagePreviewComponent],
            imports: [
                NoopAnimationsModule,
                DragDropModule,
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ImagePreviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should compile', () => {
        expect(component).toBeTruthy();
    });
});
