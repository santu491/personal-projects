import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { generic, roles, sortType } from 'src/app/core/constants';
import { activity, icons } from 'src/app/core/defines';
import { Community, PersonaDetails, reactionType } from 'src/app/core/models';
import { ActivityListItem } from 'src/app/core/models/activity';
import { dateDifference, sortBasedOnCreatedTime } from 'src/app/core/utils';
import { ActivityService } from './activity.service';
import { DraftContentService } from '../draft-content/draft-content.service';
@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {
  public display: string = 'none';
  public adminUserId: string = '';
  public modalTitle = 'Admin User Details';
  public personaDetails: any = [];
  public personaUsers: any = [];
  public communityPersonaUsers: any = [];
  public selectedPersona: any = null;
  public communityList: any = [];
  constructor(
    private _router: Router,
    private _activityService: ActivityService,
    private _toastrService: ToastrService,
    private _draftContentService: DraftContentService
  ) { }
  activityScreenHeader: string = activity.header;
  activityScreenSubHeader: string = activity.subheader;
  noActivityLine1: string = activity.noActivityLine1;
  noActivityLine2: string = activity.noActivityLine2;
  choosePersona: string = activity.choosePersona;
  activityListRes: Array<ActivityListItem> = [];
  activityList: Array<ActivityListItem> = [];
  profilePicture = icons.users.defaultUser;
  choosedUser: string | undefined = 'Choose Community';
  unread: number | string = 0;

  async callGetAllActivity(adminId = '') {
    // Get Activity List
    this._activityService.getAllActivity(adminId).subscribe(
      (data: any) => {
        this.activityListRes = data?.data?.value?.list ?? [];
        this.activityList = this.activityListRes;

        // Filter ActivityList which are Not Deleted
        this.activityList = this.activityList.filter(
          (activityItem: ActivityListItem) => !activityItem.isRemoved
        );

        // Number of Un-Read Notifications
        const unread = this.activityList.filter(
          (activityItem: ActivityListItem) => !activityItem.isRead
        ).length;
        this.unread = (unread > 99) ? 99 : unread;

        // Sorting based on createdAt
        this.activityList.sort(sortBasedOnCreatedTime(sortType.ASC));

        this.activityList.forEach((activityListItem, i) => {
          // Converting ISO Date to Relative Time
          this.activityList[i].createdAt = dateDifference(
            activityListItem.createdAt
          );
          if (
            this.activityList[i]?.reactionType &&
            this.activityList[i]?.reactionType != null
          ) {
            this.activityList[i].reactionType = this.getReactionImage(
              this.activityList[i]?.reactionType
            );
          }
        });
      },
      (_error: any) => {
        this._toastrService.error(generic.errorMessage);
      }
    );
  }

  getReactionImage(reactionTypeValue: reactionType | any) {
    switch (reactionTypeValue) {
      case 'like':
        return icons.reactions.like;
      case 'care':
        return icons.reactions.care;
      case 'celebrate':
        return icons.reactions.celebrate;
      case 'good_idea':
        return icons.reactions.good_idea;
      default:
        // Do Nothing
        return null;
    }
  }

  onClickActivityItem(item: ActivityListItem) {
    this._activityService.updateActivity(item._id).subscribe((res: any) => {
      if (res?.data?.isSuccess) {
        if (item.postId) {
          // Navigate to Post
          this._router.navigate(['/ui/pages/engage/search', item.postId]);
        }
        if (item.storyId) {
          // Navigate to story.
          this._router.navigate([
            '/ui/pages/engage/view-stories',
            { storyId: item.storyId }
          ]);
        }
        if (item.adminUserId) {
          // Open the model with user details.
          this.adminUserId = item.adminUserId;
          this.openModal();
        }
      }
    });
  }

  openModal() {
    this.display = 'block';
  }

  onCloseModal() {
    this.adminUserId = '';
    this.display = 'none';
  }

  isPersonaEnabled = () => {
    return (
      localStorage.getItem('role') === roles[0].role ||
      localStorage.getItem('role') === roles[2].role
    );
  };

  onSelectPersona(data: PersonaDetails | null) {
    console.log(data);
    this.selectedPersona = data;
    if (data) {
      this.choosedUser = data?.displayName ? data?.displayName : data?.firstName;
    } else {
      this.choosedUser = roles[0].name;
    }
    this.callGetAllActivity(data?.id)
  }

  getUserRoleTitle = () => {
    return localStorage.getItem('role') === roles[0].role
      ? roles[0].name + ' ' + activity.all
      : roles[2].name + ' ' + activity.all;
  };

  callGetPersonaDetails = async () => {
    this._draftContentService.getPersonaDetails(false).subscribe((response) => {
      if (response?.data?.value) {
        this.personaDetails = response?.data?.value;
      }
    });
  };

  callGetAllCommunities() {
    this._draftContentService.getAllCommunities(true, false).subscribe((data: any) => {
      this.communityList = data?.data?.value ?? [];
    });
  }

  async getData(item: Community) {
    this._activityService.getCommunityPersona(item.id).subscribe((response) => {
      if (response?.data?.value) {
        this.communityPersonaUsers = response?.data?.value;
      }
    });
  };

  async ngOnInit(): Promise<void> {
    await this.callGetAllCommunities();
    await this.callGetPersonaDetails();
    await this.callGetAllActivity();
  };
}
