import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { icons } from 'src/app/core/defines';
import { ExistingPosts } from 'src/app/core/models';

@Component({
  selector: 'post-quick-view',
  templateUrl: './post-quick-view.component.html',
  styleUrls: ['./post-quick-view.component.scss']
})
export class PostQuickViewComponent implements OnInit {
  @Input() post!: ExistingPosts;
  public icons = icons;

  constructor(private _router: Router) {}

  ngOnInit(): void {}

  navigateToPost(postId: string) {
    this._router.navigate(['/ui/pages/engage/search', postId]);
  }
}
