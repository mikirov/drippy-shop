import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';


@Component({
    selector: 'app-image-preview',
    templateUrl: './image-preview.component.html',
    styleUrls: ['./image-preview.component.scss'],
})
export class ImagePreviewComponent implements OnInit {


    @Output()
    newFilesSelected = new EventEmitter<File[]>();
    @Output()
    previewUrlsChange = new EventEmitter<string[]>();

    files: File[] = [];

    @Input()
    previewUrls: (string | ArrayBuffer)[];


    async onSelect(event) {
        if (!event.addedFiles) {
            return;
        }
        this.files = this.files.concat(event.addedFiles);
        console.log(this.files);

        this.previewUrls = this.previewUrls.concat(await filesToUrls(event.addedFiles));

        // this.imageChangedEvent = this.displayFiles[0].file;
        this.previewUrlsChange.emit(this.previewUrls as string[]);
        this.newFilesSelected.emit(this.files);
        console.log(this.previewUrls);

    }


    async onRemove(file: File) {

        this.files.splice(this.files.indexOf(file), 1);
        console.log(this.files);

        this.previewUrls = await filesToUrls(this.files);

        // this.imageChangedEvent = this.displayFiles[0].file;
        this.previewUrlsChange.emit(this.previewUrls as string[]);
        this.newFilesSelected.emit(this.files);
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
