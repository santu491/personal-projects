import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { generic, roles } from "src/app/core/constants";
import { viewAllUser } from "src/app/core/defines";
import { GetProfileResponse } from "src/app/core/models";
import { DraftContentService } from "../draft-content/draft-content.service";
import { ProfileService } from "../profile/profile.service";
import { ViewAllUsersService } from "./view-all-users.service";
@Component({
  selector: "app-view-all-users",
  templateUrl: "./view-all-users.component.html",
  styleUrls: ["./view-all-users.component.scss"],
})
export class ViewAllUsersComponent implements OnInit {
  public roles = roles;
  public allProfileRes!: Array<any>;
  public viewAllUser = viewAllUser;
  public communityList: any;
  public myCommunities!: Array<any>;
  public assignedCommunities!: any;

  constructor(
    private _draftContentService: DraftContentService,
    private _profileService: ProfileService,
    private _toastrService: ToastrService,
    private _viewAllUsersService: ViewAllUsersService,
    private _router: Router
  ) {}

  // Get All Profile
  callGetAllProfile() {
    this._profileService.getAllProfile().subscribe(
      (data: any) => {
        this.allProfileRes = data?.data?.value ?? [];
        this.allProfileRes = this.allProfileRes.filter(
          (item: GetProfileResponse) =>
            item.role !== roles[2].role && item.active !== false
        );

        this.allProfileRes.sort(
          (a: GetProfileResponse, b: GetProfileResponse) =>
            (a.displayName || a.firstName).localeCompare(
              b.displayName || b.firstName
            )
        );

        this.allProfileRes.forEach((element: any) => {
          if (element?.communities?.length > 0) {
            element.communityName = this.getCommunityName(element?.communities);
          }
        });
      },
      (_error: any) => {
        this._toastrService.error(generic.errorMessage);
      }
    );
  }

  // Get Community List
  callGetAllCommunities() {
    this._draftContentService.getAllCommunities().subscribe((data: any) => {
      this.communityList = data?.data?.value ?? [];
    });
  }

  getCommunityName(communityArray: Array<any>) {
    let communityName: string;
    this.assignedCommunities = communityArray;
    if (communityArray?.length == this.communityList?.length) {
      communityName = viewAllUser.allCommunitiesLabel;
    } else {
      this.myCommunities =
        this.communityList?.filter(
          (item: any) => item.id === communityArray[0]
        ) || [];

      communityName = this.myCommunities[0]?.title;
    }
    return communityName;
  }

  removeUser(id: string) {
    if (confirm(viewAllUser.confirmRemove)) {
      this._viewAllUsersService.deleteUserById(id, false).subscribe((data: any) => {
        if (data?.data?.isSuccess) {
          this._toastrService.success(viewAllUser.deleteSuccess);
          // Refresh User List
          this.callGetAllProfile();
        }
      });
    }
  }

  // Passing userData to Profile Component
  editUserDetails(userData: GetProfileResponse) {
    this._viewAllUsersService.setUserDetails(userData);
    this._router.navigate(["/ui/pages/profile"]);
  }

  ngOnInit(): void {
    this.callGetAllCommunities();
    this.callGetAllProfile();
  }
}
