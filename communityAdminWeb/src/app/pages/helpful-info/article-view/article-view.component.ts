import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-article-view',
  templateUrl: './article-view.component.html',
  styleUrls: ['./article-view.component.scss']
})
export class ArticleViewComponent implements OnInit {
  @Input() article!: any;
  @Input() parentId!: string;

  @Output() onDelete = new EventEmitter();
  @Output() onEdit = new EventEmitter();
  videoType = '^(HWVideo|HWVideoReference)$';

  constructor() {}

  ngOnInit(): void {}

  deleteArticle() {
    if (confirm('Are you sure you want to delete the article?')) {
      this.onDelete.emit({
        id: this.parentId,
        article: this.article
      });
    }
  }

  editArticle() {
    this.onEdit.emit(this.article);
  }
}
