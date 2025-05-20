import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  articleProviders,
  CharacterLimits,
  helpfulInfo,
  messages,
  PARTNER_FILTER
} from 'src/app/core/constants';
import { AppImageData, ImageType } from 'src/app/core/models';
import { ArticleResponse } from 'src/app/core/models/helpfulInfo';
import { Partners } from 'src/app/core/models/partners';
import { SectionService } from '../../add-section/section.service';
import { PartnersService } from '../../partners/partners.service';

@Component({
  selector: 'app-meredith-article',
  templateUrl: './meredith-article.component.html',
  styleUrls: ['./meredith-article.component.scss']
})
export class MeredithArticleComponent implements OnInit {
  @Input() articleData!: ArticleResponse;
  @Output() onAddArticle = new EventEmitter<ArticleResponse>();
  articleError = false;
  isArticleLoaded = false;
  limits = CharacterLimits;
  articleId: string = '';

  // Partner Images
  imageData: AppImageData[] = [];
  iconType: ImageType = ImageType.ICON;
  activePartners: Partners[] = [];
  allPartners: Partners[] = [];
  selectedBrandLogo!: string;

  constructor(
    private _section: SectionService,
    private _toastr: ToastrService,
    private partnerService: PartnersService
  ) {}

  ngOnInit(): void {
    this.partnerService.getAllPartners(false).subscribe((result: any) => {
      this.allPartners = result.data.value;

      this.activePartners = this.allPartners?.filter(
        (item: any) => item.type === PARTNER_FILTER.meredith && item.active
      );
      this.imageData = this.partnerService.getPartnerArticleImages(
        this.activePartners
      );
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.articleData?.currentValue?.id) {
      this.articleId = <string>this.articleData.id;
      this.isArticleLoaded = true;
    }
  }

  getMeredithArticle() {
    if (this.articleId.trim() === '') {
      this.articleError = true;
      return;
    }
    this.articleError = false;
    this._section
      .getArticleData({
        articleId: this.articleId,
        provider: articleProviders.meredith
      })
      .subscribe(
        (result: any) => {
          if (result.data.isSuccess) {
            this.articleData = result.data.value;
            this.articleData.id = this.articleId;
            this.articleData.provider = articleProviders.meredith;
            this.isArticleLoaded = true;
            this._toastr.success(messages.fetchArticle);
          } else {
            this.isArticleLoaded = false;
          }
        },
        (error: any) => {
          console.error(error);
          this._toastr.error(messages.contentNotFound);
          this.isArticleLoaded = false;
        }
      );
  }

  createArticle() {
    this.onAddArticle.emit(this.articleData);
  }

  enableCreateArticle() {
    if (
      this.isArticleLoaded &&
      this.articleData.en.title.trim() != '' &&
      this.articleData.es.title.trim() != ''
    ) {
      return false;
    }
    return true;
  }

  getPartnerImage(): string | null {
    if (
      this.articleData?.isEdit &&
      this.activePartners.length > 0 &&
      this.articleData.en.brandLogo &&
      this.articleData.en.brandLogo !== '' &&
      this.articleData.en.brandLogo.includes('partner')
    ) {
      const partnerId = this._section.getPartnerId(
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
    this.articleData.en.brandLogo =
      this.articleData.es.brandLogo = `${helpfulInfo.partnerPath}/${this.activePartners[index].id}${helpfulInfo.logo}${helpfulInfo.isArticleParameter}`;
    this.selectedBrandLogo =
      this.activePartners[index].articleImage ||
      this.activePartners[index].logoImage;
  }

  getBrandLogo() {
    if (
      this.articleData?.isEdit &&
      this.allPartners.length > 0 &&
      this.articleData.en.brandLogo &&
      this.articleData.en.brandLogo.includes('partner')
    ) {
      const partnerId = this.articleData.en.brandLogo.split('/')[3];
      const partnerIndex = this.allPartners.findIndex(
        (partner) => partner.id === partnerId
      );

      this.selectedBrandLogo =
        this.allPartners[partnerIndex].articleImage ||
        this.allPartners[partnerIndex].logoImage;
    }
    return this.articleData.en.brandLogo &&
      this.articleData.en.brandLogo.includes('partner')
      ? this.selectedBrandLogo
      : this.articleData.en.brandLogo ?? '';
  }
}
