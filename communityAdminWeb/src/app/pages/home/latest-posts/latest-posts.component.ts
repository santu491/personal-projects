import { Component, OnInit } from '@angular/core';
import { ExistingPosts } from 'src/app/core/models';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'latest-posts',
  templateUrl: './latest-posts.component.html',
  styleUrls: ['./latest-posts.component.scss']
})
export class LatestPostsComponent implements OnInit {
  posts!: ExistingPosts[];

  constructor(private dashboardSvc: DashboardService) {}

  ngOnInit(): void {
    this.dashboardSvc.getLatestPost().subscribe((response: any) => {
      this.posts = response.data?.value;
    });
  }
}
