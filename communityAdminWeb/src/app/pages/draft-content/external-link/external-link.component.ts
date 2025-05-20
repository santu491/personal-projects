import { Component, EventEmitter, Input, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { generic, Language, MAX_IMAGE_UPLOAD_SIZE } from 'src/app/core/constants';
import { postsModule } from 'src/app/core/defines';
import { LinkEvent, LinkPreviewResponse } from 'src/app/core/models';
import { DraftContentService } from '../draft-content.service';

@Component({
  selector: 'app-external-link',
  templateUrl: './external-link.component.html',
  styleUrls: ['./external-link.component.scss'],
})
export class ExternalLinkComponent implements OnInit {
  @Output('selectedLink') selectedLink = new EventEmitter<LinkEvent>();
  @Input() isSpanishEnabled = false;
  @Input() editData!: LinkEvent;

  public postsModule = postsModule;
  private reader: FileReader | undefined;
  link: LinkEvent = {
    en: {
      title: '',
      description: '',
      url: ''
    },
    es: {
      title: '',
      description: '',
      url: ''
    },
    isImageUploaded: false
  };

  //Image Preview
  showPreview = false;
  images: string[] = [];
  disablePreviewClick = false;
  imagePath = '';
  imagePicked!:string;
  editedOnce = false;

  constructor(
    private draftContentSvc: DraftContentService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    if(this.editData && this.editData?.en?.url != '') {
      this.getPreviewImages(this.editData.en.url);
    }
  }

  setLinkData(data: LinkEvent){
    this.link = data;
    this.editedOnce = true;
    if(this.link.isImageUploaded) {
      if(this.link.imageBase64) {
        this.imagePath = this.link.imageBase64;
        this.imagePicked = '';
        this.disablePreviewClick = true;
      }
    }
    else {
      if(this.link?.imageLink){
        this.selectImage(this.link?.imageLink);
      }
    }
  }

  isValidUrl(url: string) {
    try {
      new URL(url);
      return true;
    }
    catch(err) {
      return false;
    }
  }

  getPreviewImages(url: string) {
    this.draftContentSvc
      .getLinkPreview(url)
      .subscribe(
        (previewResponse: LinkPreviewResponse) => {
          if (previewResponse?.data?.isSuccess) {
            const preview = previewResponse?.data?.value;
            if(this.editData && !this.editedOnce) {
              this.setLinkData(this.editData);
            }
            else {
              this.link.en.title = preview?.title ?? '';
              this.link.en.description = preview?.description ?? '';
            }
            this.images = preview?.images ?? [];
            this.showPreview = true;
          }
        },
        (error: any) => {
          console.error(error);
          this.toastrService.error('Error Occured! Please try again later.');
          this.link.es.title = '';
          this.link.en.title = '';
          this.showPreview = false;
        }
    );
  }

  getLinkData(data: any) {
    this.link.en.url = data.target.value.trim();
    if(this.link.en.url == '') {
      this.link.en.url = '';
      return;
    }
    if(!this.isValidUrl(this.link.en.url)) {
      this.toastrService.error('Invalid Url');
      this.link.en.url = '';
      this.showPreview = false;
      return;
    }

    this.getPreviewImages(this.link.en.url);
  }

  selectImage(image: string) {
    this.link.imageBase64 = undefined;
    this.link.imageLink = image;
    this.imagePicked = image;
    this.link.isImageUploaded = false;
    this.selectedLink.emit(this.link);
  }
  
  clearImage() {
    this.disablePreviewClick = false;
    this.link.imageBase64 = undefined;
    this.selectedLink.emit(this.link);
    this.imagePath = '';
    this.link.isImageUploaded = false;
  }

  onUploadImage(e: any, _imageInput: any) {
    if (e.target.files) {
      this.reader = new FileReader();
      if (e.target.files[0]) {
        if (e.target.files[0].size / (1024 * 1024) > MAX_IMAGE_UPLOAD_SIZE) {
          this.toastrService.error(generic.imageSizeErr);
          this.clearImage();
        } else {
          this.reader.readAsDataURL(e.target.files[0]);
          this.reader.onload = (event: any) => {
            this.link.imageLink = undefined;
            this.link.imageBase64 = this.imagePath = event.target.result;
            this.imagePicked = '';
            this.disablePreviewClick = true;
            this.link.isImageUploaded = true;
            this.selectedLink.emit(this.link);
          };
        }
      }
    }
  }

  setTitle(event: any, language: string) {
    language == Language.SPANISH ?
      this.link.es.title = event.target.value : 
      this.link.en.title = event.target.value;
    this.selectedLink.emit(this.link);
  }

  setDescription(event: any, language: string) {
    language == Language.SPANISH ?
      this.link.es.description = event.target.value : 
      this.link.en.description = event.target.value;
    this.selectedLink.emit(this.link);
  }

  getSpanishLinkInfo(data: any) {
    this.link.es.url = data.target.value.trim();
    if(this.link.es.url == '') {
      this.link.es.url = '';
      return;
    }
    if(!this.isValidUrl(this.link.es.url)) {
      this.toastrService.error('Invalid Url');
      this.link.es.url = '';
      this.showPreview = false;
      return;
    }

    this.draftContentSvc
      .getLinkPreview(this.link.es.url)
      .subscribe(
        (previewResponse: LinkPreviewResponse) => {
          if (previewResponse?.data?.isSuccess) {
            const preview = previewResponse?.data?.value;
            this.link.es.title = preview?.title ?? '';
            this.link.es.description = preview?.description ?? '';
          }
        },
        (error: any) => {
          console.error(error);
          this.toastrService.error('Error Occured! Please try again later.');
          this.link.es.title = '';
        }
      );
  }
}
