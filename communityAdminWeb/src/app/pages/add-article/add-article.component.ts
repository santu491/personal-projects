import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';
import { CharacterLimits, articleProviders } from 'src/app/core/constants';
import { ArticleResponse } from 'src/app/core/models/helpfulInfo';
import { EditorConfig } from 'src/app/core/rich-text-editor';

@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.scss']
})
export class AddArticleComponent implements OnInit {
  @Input() displayModal: boolean = false;
  @Input() article!: ArticleResponse;
  @Output() onAddArticle = new EventEmitter<ArticleResponse>();
  @Output() onClose = new EventEmitter();
  healthWiseArticle!: ArticleResponse;
  meredithArticle!: ArticleResponse;
  customArticle!: ArticleResponse;

  limits = CharacterLimits;
  otherSpanishTranslation = false;
  isEdit = false;
  selectedTabIndex = 0;
  editorConfig: AngularEditorConfig = new EditorConfig().getConfig();

  constructor(private _toastr: ToastrService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.article) {
      const id = this.article?.id ?? '';

      if (id == '') {
        //If New Article Data
        this.selectedTabIndex = 0;
        this.healthWiseArticle =
          this.meredithArticle =
          this.customArticle =
            this.initArticleData();
        this.isEdit = false;
      } else {
        // If existing Article
        switch (this.article.en.provider) {
          case articleProviders.healthwise:
            this.selectedTabIndex = 0;
            this.healthWiseArticle = this.article;
            this.healthWiseArticle.isEdit = true;
            this.meredithArticle = this.customArticle = this.initArticleData();
            break;
          case articleProviders.meredith:
            this.selectedTabIndex = 1;
            this.meredithArticle = this.article;
            this.meredithArticle.isEdit = true;
            this.healthWiseArticle = this.customArticle =
              this.initArticleData();
            break;
          case articleProviders.other:
            this.selectedTabIndex = 2;
            this.customArticle = this.article;
            this.customArticle.isEdit = true;
            this.meredithArticle = this.healthWiseArticle =
              this.initArticleData();
            break;
          default:
            this._toastr.info('Unable to identify article provider');
            break;
        }
        this.isEdit = true;
      }
    } else {
      this.healthWiseArticle =
        this.meredithArticle =
        this.customArticle =
          this.initArticleData();
      this.isEdit = false;
    }
  }

  initArticleData() {
    const data = {
      isEdit: false,
      id: '',
      en: {
        title: '',
        description: '',
        contentId: '',
        communityId: '',
        type: '',
        link: '',
        video: '',
        thumbnail: ''
      },
      es: {
        title: '',
        description: '',
        contentId: '',
        communityId: '',
        type: '',
        link: '',
        video: '',
        thumbnail: ''
      }
    };
    return data;
  }

  createArticle(data: ArticleResponse) {
    this.onAddArticle.emit(data);
  }

  onCloseModal() {
    this.onClose.emit();
  }
}
