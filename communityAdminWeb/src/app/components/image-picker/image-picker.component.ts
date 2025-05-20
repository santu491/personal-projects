import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppImageData, ImageType } from 'src/app/core/models';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss']
})
export class ImagePickerComponent implements OnInit {
  @Input() imageList: AppImageData[] = [];
  @Input() imageType!: ImageType;
  @Input() disableClick: boolean = false;
  @Input() imagePicked: string | null = null;
  @Output() onPickingImage = new EventEmitter<number>();
  imageStyle!: string;
  constructor() {}

  ngOnInit(): void {
    this.imageStyle =
      this.imageType && this.imageType === ImageType.ICON
        ? ImageType.ICON
        : ImageType.REGULAR;
  }

  selectImage(index: number) {
    this.imagePicked = this.imageList[index].image;
    this.onPickingImage.emit(index);
  }
}
