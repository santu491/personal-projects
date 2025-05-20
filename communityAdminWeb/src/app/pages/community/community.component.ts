import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommunityService } from 'src/app/components/community-filter/community.service';
import { Community } from 'src/app/core/models';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss']
})
export class CommunityComponent implements OnInit {

  communityData: Community[] = [];

  constructor(
    private communityService: CommunityService,
    private toastrService: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.communityService.getAllCommunities(false).subscribe(
      (result: any) => {
        if(result.data?.isSuccess) {
          this.communityData = result.data.value;
        }
      },
      (error: any) => {
        console.error(error);
        this.toastrService.error('Error fetching Communities');
      }
    )
  }

  navigateToAddCommunity() {
    this.router.navigate(["/ui/pages/admin/add-community"]);
  }

  navigateToPrompts(communityId: string, title: string) {
    this.router.navigate(["/ui/pages/admin/add-prompts", { communityId: communityId, title: title }]);
  }
  
  navigateToHelpfulInfo(communityId: string, title: string) {
    this.router.navigate(["/ui/pages/admin/add-helpful-info", { communityId: communityId, title: title }]);
  }

  onEdit(community: Community) {
    this.communityService.selectedCommunity = community;
    this.navigateToAddCommunity();
  }
}
