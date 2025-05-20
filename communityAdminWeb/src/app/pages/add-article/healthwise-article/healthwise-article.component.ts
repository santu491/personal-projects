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
  CharacterLimits,
  articleProviders,
  messages
} from 'src/app/core/constants';
import { ArticleResponse } from 'src/app/core/models/helpfulInfo';
import { SectionService } from '../../add-section/section.service';

@Component({
  selector: 'app-healthwise-article',
  templateUrl: './healthwise-article.component.html',
  styleUrls: ['./healthwise-article.component.scss']
})
export class HealthwiseArticleComponent implements OnInit {
  @Input() articleData!: ArticleResponse;
  @Output() onAddArticle = new EventEmitter<ArticleResponse>();
  articleError = false;
  isArticleLoaded = false;
  limits = CharacterLimits;
  articleId: string = '';

  constructor(
    private _section: SectionService,
    private _toastr: ToastrService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.articleData?.currentValue?.id) {
      this.articleId = <string>this.articleData.id;
      this.isArticleLoaded = true;
    }
  }

  ngOnInit(): void {}

  getHWArticle() {
    if (this.articleId.trim() === '') {
      this.articleError = true;
      return;
    }
    this.articleError = false;
    this._section
      .getArticleData({
        articleId: this.articleId,
        provider: articleProviders.healthwise
      })
      .subscribe(
        (result: any) => {
          if (result.data.isSuccess) {
            this.articleData = result.data.value;
            this.articleData.id = this.articleId;
            this.articleData.provider = articleProviders.healthwise;
            this.isArticleLoaded = true;
            this._toastr.success(messages.fetchArticle);
          } else {
            this.isArticleLoaded = false;
          }
        },
        (error: any) => {
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
}
