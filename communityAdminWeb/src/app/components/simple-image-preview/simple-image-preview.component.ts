import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { partnerText } from 'src/app/core/constants';

@Component({
  selector: 'app-simple-image-preview',
  templateUrl: './simple-image-preview.component.html',
  styleUrls: ['./simple-image-preview.component.scss']
})
export class SimpleImagePreviewComponent implements OnInit {
  @Input() previewImage!: string | null;
  @Input() imageBackground: string = 'transparent';
  @Input() title: string = partnerText.uploadImage;
  @Output() onAddImage = new EventEmitter<string|null>();
  @ViewChild('fileUpload') fileElement!: ElementRef;

  constructor() {}

  ngOnInit(): void {}

  handleUpload(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      this.previewImage = <string | null>reader.result;
      if (this.previewImage) {
        this.onAddImage.emit(this.previewImage);
      }
    };
  }

  reset() {
    this.fileElement.nativeElement.value = '';
    this.previewImage = null;
    this.onAddImage.emit(this.previewImage);
  }
}
