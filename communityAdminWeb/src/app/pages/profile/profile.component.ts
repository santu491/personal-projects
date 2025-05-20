import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { MatOption } from "@angular/material/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ToastrService } from "ngx-toastr";
import { generic, MAX_IMAGE_UPLOAD_SIZE, roles } from "src/app/core/constants";
import { profile } from "src/app/core/defines";
import {
  Community,
  GetProfileResponse,
  UpdateProfilePayload,
} from "src/app/core/models";
import { DraftContentService } from "../draft-content/draft-content.service";
import { ViewAllUsersService } from "../view-all-users/view-all-users.service";
import { ProfileService } from "./profile.service";
@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  @ViewChild("imageInput") private myInputVariable!: ElementRef;
  @ViewChild("oa_ImageInput") private oaInputVariable!: ElementRef;
  @ViewChild("myCommunities") private myCommunities!: MatOption;
  @ViewChild("allSelected") private allSelected!: MatOption;

  constructor(
    private _profileService: ProfileService,
    private _toastrService: ToastrService,
    private formBuilder: UntypedFormBuilder,
    private _draftContentService: DraftContentService,
    private _viewAllUsersService: ViewAllUsersService
  ) {}

  public profile = profile;
  public myProfileRes!: GetProfileResponse;
  public allProfileRes: any;
  public profileForm!: UntypedFormGroup;
  public otherAdminForm!: UntypedFormGroup;
  public currentAdminRole = localStorage.getItem("role");
  public selectedAdmin: any;
  public roleList: any = roles;
  private reader: FileReader | undefined;
  public profileInitials: string = "";
  public otherProfileInitials: string = "";
  public oa_profileInitials: string = "";
  public myProfileImage: any;
  public otherProfileImage: any;
  private myFormFields =
    "displayName" ||
    "displayTitle" ||
    "firstName" ||
    "lastName" ||
    "aboutMe" ||
    "interests" ||
    "location";
  private otherAdminFormFields =
    "oa_selectedRole" ||
    "oa_displayName" ||
    "oa_displayTitle" ||
    "oa_firstName" ||
    "oa_lastName" ||
    "oa_aboutMe" ||
    "oa_interests" ||
    "oa_location" ||
    "oa_isActive" ||
    "oa_communities";
  public communityList: Array<Community> = [];
  public allCommunitiesId: any = [];
  public selectedCommunityName: string = "";
  private selectedCommunitiesId: Array<any> = [];
  public myCommunityList: Array<Community> = [];
  public myCommunityName: string = "";
  public selectedRole: string = "";
  public isProfilePicAvailable: boolean = false;
  private userIdFromViewAll: string | undefined = "";
  public isAdvocate = this.currentAdminRole === this.roleList[1].role ?? false;
  public oa_isActive: boolean = false;

  // Get My Profile
  getMyProfile() {
    this._profileService.getMyProfile().subscribe(
      (data: any) => {
        this.myProfileRes = data?.data?.value ?? {};

        if (this.myProfileRes) {
          this.handleMyCommunities();

          this.handleAvatar(this.myProfileRes?.profileImage, "myProfile");

          this.profileForm.controls["displayName"].setValue(
            this.myProfileRes?.displayName ?? ""
          );
          this.profileForm.controls["displayTitle"].setValue(
            this.getDisplayTitle(
              this.myProfileRes?.role,
              this.myProfileRes?.displayTitle
            )
          );
          this.profileForm.controls["firstName"].setValue(
            this.myProfileRes?.firstName ?? ""
          );
          this.profileForm.controls["lastName"].setValue(
            this.myProfileRes?.lastName ?? ""
          );
          this.profileForm.controls["aboutMe"].setValue(
            this.myProfileRes?.aboutMe ?? ""
          );
          this.profileForm.controls["interests"].setValue(
            this.myProfileRes?.interests ?? ""
          );
          this.profileForm.controls["location"].setValue(
            this.myProfileRes?.location ?? ""
          );
        }
        this.onFormChange();
      },
      (_error: any) => {
        this._toastrService.error(generic.errorMessage);
      }
    );
  }

  handleAvatar(imagePath: string, type: string) {
    if (type === "myProfile") {
      if (imagePath) {
        this.myProfileImage = imagePath;
        this.profileInitials = "";
        this.profileForm.controls["profileImage"].setValue(imagePath);
      } else {
        this.handleInitials(type);
      }
    } else {
      if (imagePath) {
        this.otherProfileImage = imagePath;
        this.otherProfileInitials = "";
        this.otherAdminForm.controls["profileImage"].setValue(imagePath);
      } else {
        this.handleInitials(type);
      }
    }
  }

  getDisplayTitle(role: string, displayTitle: string) {
    return role === roles[0].role
      ? profile.sydneyCommunity
      : role === roles[1].role
      ? profile.communityAdvocate
      : role === roles[2].role
      ? profile.systemAdmin
      : displayTitle;
  }

  handleMyCommunities() {
    setTimeout(() => {
      this.profileForm.controls["communities"].setValue(
        this.myProfileRes?.communities ?? []
      );
      if (this.myProfileRes?.communities) {
        this.getMyCommunityList();
        this.singleSelectMyCommunity();
      }
    }, 100);
  }

  handleInitials(type: string) {
    if (type === "myProfile") {
      this.myProfileImage = "";
      this.profileInitials = (
        this.myProfileRes?.displayName || this.myProfileRes?.firstName
      )?.charAt(0);
    } else if (type === "otherProfile") {
      this.otherProfileImage = "";
      this.otherProfileInitials = (
        this.selectedAdmin?.displayName || this.selectedAdmin?.firstName
      )?.charAt(0);
    }
  }

  // Get All Profile
  callGetAllProfile(selectedAdminId?: string) {
    this._profileService.getAllProfile().subscribe(
      (data: any) => {
        this.allProfileRes = data?.data?.value ?? [];

        this.allProfileRes.sort(
          (a: GetProfileResponse, b: GetProfileResponse) =>
            (a.displayName || a.firstName).localeCompare(
              b.displayName || b.firstName
            )
        );

        if (this.userIdFromViewAll && this.allProfileRes) {
          this.setDataToEditProfile(this.userIdFromViewAll);
        }
        if (selectedAdminId && !this.userIdFromViewAll) {
          this.selectedProfile(selectedAdminId);
        }
      },
      (_error: any) => {
        this._toastrService.error(generic.errorMessage);
      }
    );
  }

  // Select Other Admin Profile and Set Data to Form2
  selectedProfile = (id: any) => {
    let result = this.allProfileRes?.find((element: any) => element?.id == id);
    if (result.id) {
      this.selectedAdmin = result;

      if (this.selectedAdmin?.profileImage) {
        this.otherAdminForm.controls["oa_profileImage"].setValue(
          this.selectedAdmin?.profileImage
        );
        this.otherProfileImage = this.selectedAdmin?.profileImage;
        this.otherProfileInitials = "";
      } else {
        this.handleInitials("otherProfile");
      }

      this.otherAdminForm.controls["oa_selectedRole"].setValue(
        this.selectedAdmin?.role
      );
      this.selectedRole = this.selectedAdmin?.role;
      this.otherAdminForm.controls["oa_displayName"].setValue(
        this.selectedAdmin?.displayName
      );
      this.otherAdminForm.controls["oa_displayTitle"].setValue(
        this.getDisplayTitle(
          this.selectedAdmin?.role,
          this.selectedAdmin?.displayTitle
        )
      );
      this.otherAdminForm.controls["oa_firstName"].setValue(
        this.selectedAdmin?.firstName
      );
      this.otherAdminForm.controls["oa_lastName"].setValue(
        this.selectedAdmin?.lastName
      );

      this.otherAdminForm.controls["oa_communities"].setValue(
        this.selectedAdmin?.communities
      );
      if (this.selectedAdmin?.communities) {
        this.singleSelectAssignedCommunity();
      }

      this.otherAdminForm.controls["oa_aboutMe"].setValue(
        this.selectedAdmin?.aboutMe
      );
      this.otherAdminForm.controls["oa_interests"].setValue(
        this.selectedAdmin?.interests
      );
      this.otherAdminForm.controls["oa_location"].setValue(
        this.selectedAdmin?.location
      );

      this.otherAdminForm.controls["oa_isActive"].setValue(
        this.selectedAdmin?.active
      );
    }
  };

  onRoleChange = (role: any) => {
    this.selectedRole = role;
    this.otherAdminForm.controls["oa_selectedRole"].setValue(role);
    this.otherAdminForm.controls["oa_displayTitle"].setValue(
      this.getDisplayTitle(role, "")
    );
    this.singleSelectAssignedCommunity();
  };

  // Getter for easy access to Form Fields
  get form() {
    return this.profileForm.controls;
  }
  get form2() {
    return this.otherAdminForm.controls;
  }
  get communities(): UntypedFormControl {
    return this.profileForm.get("communities") as UntypedFormControl;
  }
  get oa_communities(): UntypedFormControl {
    return this.otherAdminForm.get("oa_communities") as UntypedFormControl;
  }

  onBlurForm1(
    event: any,
    type:
      | "displayName"
      | "displayTitle"
      | "firstName"
      | "lastName"
      | "aboutMe"
      | "interests"
      | "location"
      | "profileImage"
  ) {
    this.profileForm.controls[type].setValue(event.target.value.trim());
    this.onFormChange();
  }

  onBlurForm2(
    event: any,
    type:
      | "oa_selectedRole"
      | "oa_displayName"
      | "oa_displayTitle"
      | "oa_firstName"
      | "oa_lastName"
      | "oa_aboutMe"
      | "oa_interests"
      | "oa_location"
      | "oa_profileImage"
  ) {
    this.otherAdminForm.controls[type].setValue(event.target.value.trim());
    this.onOtherAdminFormChange();
  }

  onUpdateProfile = (removeImage?: boolean, updateFormDataOnly?: boolean) => {
    if (this.profileForm.invalid) {
      return;
    }
    const updateProfilePayload: UpdateProfilePayload = updateFormDataOnly
      ? {
          firstName: this.form.firstName.value,
          lastName: this.form.lastName.value,
          displayName: this.form.displayName.value,
          displayTitle: this.form.displayTitle.value,
          aboutMe: this.form.aboutMe.value,
          interests: this.form.interests.value,
          location: this.form.location.value
        }
      : {
          firstName: this.form.firstName.value,
          lastName: this.form.lastName.value,
          displayName: this.form.displayName.value,
          displayTitle: this.form.displayTitle.value,
          aboutMe: this.form.aboutMe.value,
          interests: this.form.interests.value,
          location: this.form.location.value,
          profileImage: removeImage ? "" : this.form.profileImage.value
        };

    this.updateAdminProfile(updateProfilePayload, "myProfile", removeImage);
  };

  onUpdateOtherProfile(removeImage?: boolean, updateFormDataOnly?: boolean) {
    if (this.otherAdminForm.invalid) {
      return;
    }
    let updateProfilePayload: UpdateProfilePayload = updateFormDataOnly
      ? {
          role: this.form2.oa_selectedRole.value,
          firstName: this.form2.oa_firstName.value,
          lastName: this.form2.oa_lastName.value || "",
          displayName: this.form2.oa_displayName.value || "",
          displayTitle: this.form2.oa_displayTitle.value || "",
          aboutMe: this.form2.oa_aboutMe.value,
          interests: this.form2.oa_interests.value || "",
          location: this.form2.oa_location.value || "",
          active: this.form2.oa_isActive.value,
          id: this.selectedAdmin.id,
        }
      : {
          role: this.form2.oa_selectedRole.value,
          firstName: this.form2.oa_firstName.value,
          lastName: this.form2.oa_lastName.value || "",
          displayName: this.form2.oa_displayName.value || "",
          displayTitle: this.form2.oa_displayTitle.value || "",
          aboutMe: this.form2.oa_aboutMe.value,
          interests: this.form2.oa_interests.value || "",
          location: this.form2.oa_location.value || "",
          id: this.selectedAdmin.id,
          active: this.form2.oa_isActive.value,
          profileImage: removeImage ? "" : this.form2.oa_profileImage.value,
        };
    if (this.form2.oa_selectedRole.value !== roles[0].role) {
      let communityInfo = { communities: this.selectedCommunitiesId };
      updateProfilePayload = { ...updateProfilePayload, ...communityInfo };
    }
    this.updateAdminProfile(updateProfilePayload, "otherProfile", removeImage);
  }

  updateAdminProfile(
    updateProfilePayload: UpdateProfilePayload,
    type: "myProfile" | "otherProfile",
    isRemoveImage?: boolean
  ) {
    this._profileService.updateAdminProfile(updateProfilePayload).subscribe(
      (data: any) => {
        if (data?.data?.isSuccess) {
          isRemoveImage
            ? this._toastrService.success(profile.imageDeleted)
            : this._toastrService.success(profile.updatedSuccessfully);

          if (type === "myProfile") {
            this.myInputVariable.nativeElement.value = "";
            this.getMyProfile();
          } else {
            if (isRemoveImage) {
              this.handleAvatar("", "otherProfile");
            }
            this.oaInputVariable.nativeElement.value = "";
            this.callGetAllProfile();
          }
        } else {
          this._toastrService.error(generic.errorMessage);
        }
      },
      (_error: any) => {
        this.clearImageElement(type);
        this._toastrService.error(generic.errorMessage);
        type === "myProfile"
          ? this.getMyProfile()
          : this.callGetAllProfile(this.selectedAdmin?.id);
      }
    );
  }

  // Get Community List
  getAllCommunities() {
    this._draftContentService.getAllCommunities().subscribe((data: any) => {
      this.communityList = data?.data?.value ?? [];
      if (data?.data?.value) {
        this.communityList.forEach((item: any) => {
          this.allCommunitiesId.push(item.id);
        });
      }
    });
  }

  onFormChange() {
    if (
      this.profileForm.controls["firstName"].value.length > 0 &&
      this.profileForm.controls["aboutMe"].value.length > 0
    ) {
      return false;
    } else return true;
  }

  onOtherAdminFormChange() {
    if (
      this.otherAdminForm.controls["oa_selectedRole"].value &&
      this.otherAdminForm.controls["oa_communities"].value?.length > 0 &&
      this.otherAdminForm.controls["oa_firstName"]?.value?.length > 0 &&
      this.otherAdminForm.controls["oa_aboutMe"]?.value?.length > 0
    ) {
      return false;
    } else return true;
  }

  onTextChange = (
    _event: any,
    inputType:
      | "displayName"
      | "displayTitle"
      | "firstName"
      | "lastName"
      | "aboutMe"
      | "interests"
      | "location"
      | "oa_selectedRole"
      | "oa_displayName"
      | "oa_displayTitle"
      | "oa_firstName"
      | "oa_lastName"
      | "oa_aboutMe"
      | "oa_interests"
      | "oa_location"
      | "oa_communities"
  ) => {
    if (inputType === this.myFormFields) {
      this.onFormChange();
    } else if (inputType === this.otherAdminFormFields) {
      this.onOtherAdminFormChange();
    }
  };

  onSelectImage(e: any, _imageInput: any, type: string) {
    if (e.target.files) {
      this.reader = new FileReader();
      if (e.target.files[0]) {
        if (e.target.files[0].size / (1024 * 1024) > MAX_IMAGE_UPLOAD_SIZE) {
          this._toastrService.error(generic.imageSizeErr);
          this.clearImageElement(type);
        } else {
          this.reader.readAsDataURL(e.target.files[0]);
          this.reader.onload = (event: any) => {
            if (type === "myProfile") {
              this.profileForm.controls["profileImage"].setValue(
                event.target.result
              );
              this.onUpdateProfile(false, false);
              this.myProfileImage = event.target.result;
            } else {
              this.otherAdminForm.controls["oa_profileImage"].setValue(
                event.target.result
              );
              this.onUpdateOtherProfile(false, false);
              this.otherProfileImage = event.target.result;
            }
          };
        }
      }
    }
  }

  clearImageElement(type: string) {
    if (type === "myProfile") {
      this.myInputVariable.nativeElement.value = "";
    } else {
      this.oaInputVariable.nativeElement.value = "";
    }
  }

  clearImage(type: string) {
    if (type === "myProfile") {
      if (this.myInputVariable) {
        this.myInputVariable.nativeElement.value = "";
      }
      this.myProfileImage = "";
      this.profileForm.controls["profileImage"].setValue("");
    } else {
      if (this.oaInputVariable) {
        this.oaInputVariable.nativeElement.value = "";
      }
      this.otherProfileImage = "";
      this.otherAdminForm.controls["profileImage"].setValue("");
    }
  }

  onRemoveProfilePic(_imageInput: any, type: string) {
    if (type === "myProfile") {
      this.onUpdateProfile(true, false);
    } else {
      this.onUpdateOtherProfile(true, false);
    }
  }

  getMyCommunityList() {
    this.communityList.forEach((communityListItem) => {
      this.myProfileRes?.communities?.forEach((communityRespItem) => {
        if (communityListItem.id == communityRespItem) {
          this.myCommunityList.push(communityListItem);
        }
      });
    });
  }

  singleSelectMyCommunity() {
    if (this.myCommunities?.selected) {
      this.myCommunities?.deselect();
    }
    if (
      this.profileForm.controls.communities.value?.length ==
      this.communityList?.length
    ) {
      this.myCommunities?.select();
    }
    if (this.profileForm.controls.communities?.value?.length > 0) {
      let checkValue = this.profileForm.controls.communities?.value[0];
      const selectedCommunity = this.communityList?.filter(
        (item: any) => item.id === checkValue
      );
      this.myCommunityName =
        selectedCommunity?.length == this.communityList?.length
          ? profile.allCommunitiesLabel
          : selectedCommunity[0]?.title;
    }
  }

  singleSelectAssignedCommunity() {
    if (this.allSelected?.selected) {
      this.allSelected?.deselect();
    }
    if (
      this.otherAdminForm.controls.oa_communities.value?.length ==
      this.communityList?.length
    ) {
      this.allSelected?.select();
    }
    if (this.otherAdminForm.controls.oa_communities?.value) {
      let checkValue = this.otherAdminForm.controls.oa_communities?.value[0];
      const selectedCommunity = this.communityList?.filter(
        (item: any) => item.id == checkValue
      );
      this.selectedCommunityName =
        selectedCommunity[0]?.title || profile.allCommunitiesLabel;
      const tempArray: Array<any> =
        this.otherAdminForm.controls.oa_communities?.value;
      this.selectedCommunitiesId = tempArray.filter((item: any) => item !== 0);
    }
  }

  toggleAllSelection() {
    if (this.allSelected?.selected) {
      this.otherAdminForm.controls.oa_communities.patchValue([
        ...this.allCommunitiesId,
        0,
      ]);
      this.selectedCommunityName = profile.allCommunitiesLabel;
      let tempArray: Array<any> =
        this.otherAdminForm.controls.oa_communities?.value;
      this.selectedCommunitiesId = tempArray.filter((item: any) => item !== 0);
    } else {
      this.otherAdminForm.controls.oa_communities.patchValue([]);
    }
  }

  setDataToEditProfile(selectedUserId: string) {
    if (this.allProfileRes) {
      this.otherAdminForm.controls["selectedAdminProfile"].setValue(
        selectedUserId
      );
      this.selectedProfile(selectedUserId);
      window?.scrollBy(0, window.innerHeight);
      this.userIdFromViewAll = "";
    }
  }

  ngOnInit(): void {
    this.getAllCommunities();
    this.getMyProfile();
    this.profileForm = this.formBuilder.group({
      displayName: [""],
      displayTitle: [{ value: "", disabled: true }],
      firstName: [""],
      lastName: [""],
      aboutMe: [""],
      interests: [""],
      location: [""],
      profileImage: [""],
      communities: [""],
      scAdminCommunity: [
        { value: profile.allCommunitiesLabel, disabled: true },
      ],
    });

    if (!this.isAdvocate ) {
      this.userIdFromViewAll = this._viewAllUsersService.getUserDetails()?.id;
      this.callGetAllProfile();

      this.otherAdminForm = this.formBuilder.group({
        selectedAdminProfile: [""],
        oa_selectedRole: [""],
        oa_displayName: [""],
        oa_displayTitle: [{ value: "", disabled: true }],
        oa_firstName: [""],
        oa_lastName: [""],
        oa_aboutMe: [""],
        oa_interests: [""],
        oa_location: [""],
        oa_profileImage: [""],
        oa_communities: [""],
        oa_isActive: [false],
        oa_scAdminCommunity: [
          { value: profile.allCommunitiesLabel, disabled: true },
        ],
      });
    }
  }
}
