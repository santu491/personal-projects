import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { generic, MAX_IMAGE_UPLOAD_SIZE } from "src/app/core/constants";

@Component({
    selector: 'image-preview',
    templateUrl: './image-preview.component.html',
    styleUrls: ['./image-preview-componet.scss'],
})
export class ImagePreviewComponent implements OnInit {
    @Output() image = new EventEmitter<Object>();
    @Input() currentImage: string | undefined = '';
    @ViewChild("uploadedImage") private uploadedImage!: ElementRef;
    constructor(
        private _toastrService: ToastrService,
    ) { }

    title = 'angular-image-uploader';

    imageChangedEvent: any = '';
    croppedImage: any = '';
    imageUploaded: boolean = false;

    fileChangeEvent(event: any): void {
        if (event.target.files[0].size / (1024 * 1024) > MAX_IMAGE_UPLOAD_SIZE) {
            this._toastrService.error(generic.imageSizeErr);
        }
        this.imageUploaded = true;
        this.imageChangedEvent = event;
    }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
        this.image.emit(this.croppedImage);
    }

    imageLoaded() {
        // show cropper
        this.imageUploaded = true;
    }

    cropperReady() {
        // cropper ready
        this.imageUploaded = true;
        this.image.emit(this.croppedImage);

    }
    
    loadImageFailed() {
        this._toastrService.error(generic.imageFormat);
    }

    ngOnInit(): void { }

    clear() {
        this.uploadedImage.nativeElement.value = "";
        this.imageUploaded = false;
        this.croppedImage = '';
        this.imageChangedEvent = '';
        this.image.emit(this.currentImage);
    }

    viewImage() {
        return this.imageUploaded;
    }

}