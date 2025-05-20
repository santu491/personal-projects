import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Content } from 'src/app/core/models/helpfulInfo';

@Component({
  selector: 'app-section-article',
  templateUrl: './section-article.component.html',
  styleUrls: ['./section-article.component.scss']
})
export class SectionArticleComponent implements OnInit {
  @Input() article!: Content;
  @Output() onEditArticle = new EventEmitter();
  @Output() onDeleteArticle = new EventEmitter();
  videoType = '^(HWVideo|HWVideoReference)$';

  constructor() {}

  ngOnInit(): void {}

  editArticle() {
    this.onEditArticle.emit();
  }

  deleteArticle() {
    this.onDeleteArticle.emit();
  }
}
