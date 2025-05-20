import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { roles } from 'src/app/core/constants';
import { viewAllPNModule, viewStoryModule } from 'src/app/core/defines';
import { Community } from 'src/app/core/models/communities';
import { CommunityService } from './community.service';

@Component({
  selector: 'app-community-filter',
  templateUrl: './community-filter.component.html',
  styleUrls: ['./community-filter.component.scss'],
})
export class CommunityFilterComponent implements OnInit {
  @ViewChild('allSelected') private allSelected!: MatOption;
  @ViewChild('noCommunity') private noCommunity!: MatOption;
  @Output() selectedCommunities = new EventEmitter<string[]>();
  public selectedCommunity = '';
  public currentAdminRole = localStorage.getItem('role');
  private myCommunities = localStorage.getItem('communities');
  public roleList: any = roles;
  public isAdvocate = this.currentAdminRole === this.roleList[1].role ?? false;
  public communityList: Array<Community> = [];
  public allCommunitiesId: Array<string> = [];
  public selectedCommunityIds: string[] = [];
  public formFilter!: UntypedFormGroup;
  viewAllPNModule = viewAllPNModule;

  constructor(
    private _communityService: CommunityService,
    private _formBuilder: UntypedFormBuilder,
    private _toasterService: ToastrService
  ) {}

  ngOnInit(): void {
    this.formFilter = this._formBuilder.group({
      communities: [''],
    });
    this.getAllCommunities();
  }

  get formControls() {
    return this.formFilter.controls;
  }

  isAdvocateAction() {
    return this.currentAdminRole !== roles[1].role;
  }

  getAllCommunities() {
    this._communityService.getAllCommunities(true, false).subscribe((data: any) => {
      this.communityList = data?.data?.value ?? [];
      if (this.communityList?.length) {
        this._communityService.communityList = this.communityList;
        if (this.isAdvocate) {
          this.communityList = this.communityList.filter((item) =>
            this.myCommunities?.includes(item.id)
          );
        }
        this.communityList.forEach((item: any) => {
          this.allCommunitiesId.push(item.id);
        });
      }
      this.toggleAllSelection(true);
    });
  }

  toggleAllSelection(selectAll?: boolean) {
    if (this.allSelected?.selected || selectAll) {
      if(this.isAdvocate) {
        this.formFilter.controls.communities.patchValue([
          ...this.allCommunitiesId,
          0
        ]);
      }
      else {
        this.formFilter.controls.communities.patchValue([
          ...this.allCommunitiesId,
          0,
          this.viewAllPNModule.noCommunity,
        ]);
      }
      
      this.selectedCommunityIds =
        this.formFilter?.controls?.communities?.value?.filter(
          (item: any) => item !== 0
        );
      this.selectedCommunity = viewAllPNModule.allUsers;
    } else {
      if (this.isAdvocateAction()) {
        this.noCommunity.deselect();
      }
      this.selectedCommunityIds = [];
      this.formFilter.controls.communities.patchValue([]);
      this._toasterService.error(viewStoryModule.selectCommunity);
      this.selectedCommunity = '';
    }
    this.selectedCommunities.emit(this.selectedCommunityIds);
  }

  singleSelectAssignedCommunity() {
    if (this.allSelected?.selected) {
      this.allSelected.deselect();
    }
    if (
      this.formControls.communities.value.length ===
      this.communityList.length + 1
    ) {
      this.allSelected.select();
    }
    if (this.formControls.communities.value.length > 0) {
      this.selectedCommunity =
        this.formControls.communities.value.length === 1 &&
        this.formControls.communities.value[0] === viewAllPNModule.noCommunity
          ? this.viewAllPNModule.unjoinedUsers
          : this.communityList.find(
              (item) => item.id === this.formControls.communities.value[0]
            )?.title ?? viewAllPNModule.allUsers;
    }

    this.selectedCommunityIds =
      this.formControls.communities.value.length === 0
        ? []
        : this.formControls.communities.value;
    this.selectedCommunityIds = this.selectedCommunityIds.filter(
      (communityId) => +communityId != 0
    );
    this.selectedCommunities.emit(this.selectedCommunityIds);
  }
}
