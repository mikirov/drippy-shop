import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {
    CdkDrag,
    CdkDragStart,
    CdkDropList, CdkDropListGroup, CdkDragMove, CdkDragEnter,
    moveItemInArray
} from '@angular/cdk/drag-drop';
import {ViewportRuler} from '@angular/cdk/overlay';


@Component({
    selector: 'app-image-preview',
    templateUrl: './image-preview.component.html',
    styleUrls: ['./image-preview.component.scss'],
})
export class ImagePreviewComponent implements AfterViewInit, OnInit {


    constructor(private viewportRuler: ViewportRuler) {
        this.target = null;
        this.source = null;
    }

    @ViewChild(CdkDropListGroup) listGroup: CdkDropListGroup<CdkDropList>;
    @ViewChild(CdkDropList) placeholder: CdkDropList;

    public target: CdkDropList;
    public targetIndex: number;
    public source: CdkDropList;
    public sourceIndex: number;
    public dragIndex: number;
    public activeContainer;

    @Output()
    newFilesSelected = new EventEmitter<File[]>();
    @Output()
    previewUrlsChange = new EventEmitter<string[]>();

    files: File[] = [];

    @Input()
    previewUrls: (string | ArrayBuffer)[];

    indexOf(collection, node) {
        return Array.prototype.indexOf.call(collection, node);
    }

    /** Determines whether an event is a touch event. */
    isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
        return event.type.startsWith('touch');
    }

    isInsideDropListClientRect(dropList: CdkDropList, x: number, y: number) {
        const {top, bottom, left, right} = dropList.element.nativeElement.getBoundingClientRect();
        return y >= top && y <= bottom && x >= left && x <= right;
    }

    ngAfterViewInit() {
        console.log(this.previewUrls);
        const phElement = this.placeholder.element.nativeElement;

        phElement.style.display = 'none';
        phElement.parentNode.removeChild(phElement);
    }

    async onSelectFile(files: File[]) {
        if (!files) {
            return;
        }
        this.files = files;
        console.log(this.files);

        this.previewUrls = this.previewUrls.concat(await filesToUrls(files));

        // this.imageChangedEvent = this.displayFiles[0].file;
        this.previewUrlsChange.emit(this.previewUrls as string[]);
        this.newFilesSelected.emit(files);
        console.log(this.previewUrls);

    }

    dragMoved(e: CdkDragMove) {
        const point = this.getPointerPositionOnPage(e.event);

        this.listGroup._items.forEach(dropList => {
            if (this.isInsideDropListClientRect(dropList, point.x, point.y)) {
                this.activeContainer = dropList;
                return;
            }
        });
    }

    dropListDropped() {
        if (!this.target) {
            return;
        }

        const phElement = this.placeholder.element.nativeElement;
        const parent = phElement.parentElement;

        phElement.style.display = 'none';

        parent.removeChild(phElement);
        parent.appendChild(phElement);
        parent.insertBefore(this.source.element.nativeElement, parent.children[this.sourceIndex]);

        this.target = null;
        this.source = null;

        if (this.sourceIndex !== this.targetIndex) {
            moveItemInArray(this.previewUrls, this.sourceIndex, this.targetIndex);
        }
    }

    dropListEnterPredicate = (drag: CdkDrag, drop: CdkDropList) => {
        if (drop === this.placeholder) {
            return true;
        }

        if (drop !== this.activeContainer) {
            return false;
        }

        const phElement = this.placeholder.element.nativeElement;
        const sourceElement = drag.dropContainer.element.nativeElement;
        const dropElement = drop.element.nativeElement;

        const dragIndex = this.indexOf(dropElement.parentElement.children, (this.source ? phElement : sourceElement));
        const dropIndex = this.indexOf(dropElement.parentElement.children, dropElement);

        if (!this.source) {
            this.sourceIndex = dragIndex;
            this.source = drag.dropContainer;

            phElement.style.width = sourceElement.clientWidth + 'px';
            phElement.style.height = sourceElement.clientHeight + 'px';

            sourceElement.parentElement.removeChild(sourceElement);
        }

        this.targetIndex = dropIndex;
        this.target = drop;

        phElement.style.display = '';
        dropElement.parentElement.insertBefore(phElement, (dropIndex > dragIndex
            ? dropElement.nextSibling : dropElement));

        // this.placeholder.enter(drag, drag.element.nativeElement.offsetLeft, drag.element.nativeElement.offsetTop);
        this.placeholder.enterPredicate(drag, drop);
        return false;
    }

    getPointerPositionOnPage(event: MouseEvent | TouchEvent) {
        // `touches` will be empty for start/end events so we have to fall back to `changedTouches`.
        const point = this.isTouchEvent(event) ? (event.touches[0] || event.changedTouches[0]) : event;
        const scrollPosition = this.viewportRuler.getViewportScrollPosition();

        return {
            x: point.pageX - scrollPosition.left,
            y: point.pageY - scrollPosition.top
        };
    }


    onDelete(url: string | ArrayBuffer) {
        this.previewUrls.splice(this.previewUrls.indexOf(url), 1);
        this.files.splice(this.previewUrls.indexOf(url), 1);
        this.newFilesSelected.emit(this.files);
        this.previewUrlsChange.emit(this.previewUrls as string[]);
    }

    ngOnInit(): void {
    }
}


export async function filesToUrls(files: File[]) {
    // create function which return resolved promise
    // with data:base64 string
    function getBase64(file: File) {
        const reader = new FileReader();
        return new Promise<string>(resolve => {
            reader.onload = ev => {
                resolve((ev.target as FileReader).result as string);
            };
            reader.readAsDataURL(file);
        });
    }

    // here will be array of promisified functions
    const promises = files.map(file => getBase64(file));

    // array with base64 strings
    return await Promise.all(promises);
}
