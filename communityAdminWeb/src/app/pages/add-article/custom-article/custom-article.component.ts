import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';
import {
  articleProviders,
  contentType,
  helpfulInfo,
  PARTNER_FILTER
} from 'src/app/core/constants';
import { AppImageData, ImageType } from 'src/app/core/models';
import { ArticleResponse } from 'src/app/core/models/helpfulInfo';
import { Partners } from 'src/app/core/models/partners';
import { EditorConfig } from 'src/app/core/rich-text-editor';
import { generateHexId } from 'src/app/core/utils';
import { SectionService } from '../../add-section/section.service';
import { PartnersService } from '../../partners/partners.service';

@Component({
  selector: 'app-custom-article',
  templateUrl: './custom-article.component.html',
  styleUrls: ['./custom-article.component.scss']
})
export class CustomArticleComponent implements OnInit {
  @Input() articleData!: ArticleResponse;
  @Output() onAddArticle = new EventEmitter<ArticleResponse>();
  articleDescriptionError = false;
  editorConfig: AngularEditorConfig = new EditorConfig().getConfig();
  spanishEditorConfig: AngularEditorConfig = new EditorConfig().getConfig();
  articleForm!: UntypedFormGroup;
  imageData: AppImageData[] = [];
  iconType: ImageType = ImageType.ICON;
  activePartners: Partners[] = [];
  brandLogoLink!: string;
  partnerName!: string;

  constructor(
    private _toastr: ToastrService,
    private formBuilder: UntypedFormBuilder,
    private partnerService: PartnersService,
    private sectionService: SectionService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.partnerService.getAllPartners(true).subscribe((result: any) => {
      this.activePartners = result.data.value?.filter(
        (item: any) =>
          item.type === PARTNER_FILTER.OtherPartner ||
          item.type != PARTNER_FILTER.meredith
      );
      this.imageData = this.partnerService
        .getPartnerArticleImages(this.activePartners)
        ?.filter(
          (item) =>
            item.type === PARTNER_FILTER.OtherPartner ||
            item.type != PARTNER_FILTER.meredith
        );
    });
  }

  ngOnChanges() {
    if (this.articleData?.isEdit) {
      this.articleForm.setValue({
        en: {
          title: this.articleData.en.title,
          description: this.articleData.en.description
        },
        es: {
          title: this.articleData.es.title,
          description: this.articleData.es.description
        },
        thumbnail: this.articleData.en.thumbnail,
        brandLogo: this.articleData.en?.brandLogo ?? '',
        disclaimer: this.articleData.en?.copyright ?? ''
      });
    } else {
      this.createForm();
    }
  }

  getPartnerImage(): string | null {
    if (
      this.articleData?.isEdit &&
      this.activePartners.length > 0 &&
      this.articleData.en.brandLogo &&
      this.articleData.en.brandLogo !== ''
    ) {
      const partnerId = this.sectionService.getPartnerId(
        this.articleData.en.brandLogo ?? ''
      );
      const index = this.activePartners.findIndex(
        (p: Partners) => p.id === partnerId
      );
      return (
        this.activePartners[index]?.articleImage ??
        this.activePartners[index].logoImage
      );
    } else {
      return null;
    }
  }

  handleBrandLogo(index: number) {
    this.brandLogoLink = `${helpfulInfo.partnerPath}/${this.activePartners[index].id}${helpfulInfo.logo}?isArticle=true`;
    this.partnerName = this.activePartners[index].title;
  }

  createForm() {
    this.articleForm = this.formBuilder.group({
      en: this.formBuilder.group({
        title: ['', [Validators.required]],
        description: ['']
      }),
      es: this.formBuilder.group({
        title: ['', [Validators.required]],
        description: ['']
      }),
      thumbnail: [''],
      brandLogo: [{ value: '', disabled: true }],
      disclaimer: ['']
    });
  }

  addCustomArticle() {
    this.articleDescriptionError =
      this.articleForm.value.en.description.trim() === '';
    if (this.articleDescriptionError) {
      return;
    }

    this.articleData.en = {
      ...this.articleData.en,
      ...this.articleForm.value.en
    };
    this.articleData.es = {
      ...this.articleData.es,
      ...this.articleForm.value.es
    };
    if (this.articleForm.value.es.description === '') {
      this._toastr.info('Using English description as Spanish description.');
      this.articleData.es.description = this.articleData.en.description;
    }

    if (this.brandLogoLink && this.brandLogoLink !== '') {
      this.articleData.en.brandLogo = this.articleData.es.brandLogo =
        this.brandLogoLink;
      this.articleData.en.isPartnerArticle =
        this.articleData.es.isPartnerArticle = true;
      this.articleData.en.brand = this.articleData.es.brand = this.partnerName;
    }
    this.articleData.en.copyright = this.articleData.es.copyright =
      this.articleForm.value?.disclaimer ?? '';
    this.articleData.en.imgUrl =
      this.articleData.es.imgUrl =
      this.articleData.es.thumbnail =
      this.articleData.en.thumbnail =
        this.articleForm.value?.thumbnail ?? '';
    this.articleData.en.provider = this.articleData.es.provider =
      articleProviders.other;
    this.articleData.en.type = this.articleData.es.type = contentType.article;

    if (!this.articleData.isEdit) {
      this.articleData.es.contentId = this.articleData.en.contentId =
        generateHexId();
    }

    this.cleanArticleData();
    this.onAddArticle.emit(this.articleData);
  }

  cleanArticleData() {
    const newLine = /&#160;|&nbsp;|&#10;/gi;
    this.articleData.en.description =
      this.articleData.en.description.replaceAll(newLine, ' ');
    this.articleData.es.description =
      this.articleData.es.description.replaceAll(newLine, ' ');
  }
}
