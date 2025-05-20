import { Component, OnInit, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { MatOption } from "@angular/material/core";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ToastrService } from "ngx-toastr";
import { roles } from "src/app/core/constants";
import {
  schedulePNModule,
  viewAllPNModule,
  viewStoryModule,
} from "src/app/core/defines";
import { Community, EditPNResult, PNStatus } from "src/app/core/models";
import { DraftContentService } from "../draft-content/draft-content.service";
import { ViewAllPushNotificationsService } from "./view-all-push-notifications.service";

@Component({
  selector: "app-view-all-push-notifications",
  templateUrl: "./view-all-push-notifications.component.html",
  styleUrls: ["./view-all-push-notifications.component.scss"],
})
export class ViewAllPushNotificationsComponent implements OnInit {
  @ViewChild("allSelected") private allSelected!: MatOption;
  @ViewChild("noCommunity") private noCommunity!: MatOption;
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public filters: Array<any> = viewAllPNModule.pnFilters;
  public displayedColumns = viewAllPNModule.columns;
  public dataSource!: MatTableDataSource<any>;
  public communityList: Community[] = [];
  public formFilter!: UntypedFormGroup;
  public pageSizeOption = [10];
  public allCommunityIds: string[] = [];
  public selectedCommunityIds: string[] = [];
  public schedulePNModule = schedulePNModule;
  public selectedCommunity = "";
  public pageSize = 10;
  public totalPNs = 0;
  public pageJumpNumber: number = 0;
  public allPages: number[] = [];
  public totalPages: number = 0;
  public notificationList: Array<any> = [];
  public viewAllPNModule = viewAllPNModule;
  public currentAdminRole = localStorage.getItem("role");
  public myCommunities = localStorage.getItem("communities");
  public isAdvocate = this.currentAdminRole === roles[1].role ?? false;
  public allCommunitiesId: Array<string> = [];
  public selectedViewPN: any[] = [];
  public PN_STATUS = PNStatus;

  //modal controls
  public modalDisplay: string = "none";
  public viewPNModalDispaly: string = "none";
  public editData = null;

  constructor(
    private _draftContentService: DraftContentService,
    private _formBuilder: UntypedFormBuilder,
    private _viewAllPNService: ViewAllPushNotificationsService,
    private _toasterService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllCommunities();
    this.formFilter = this._formBuilder.group({
      communities: [""],
      pnFilters: ["AllStatus"],
    });
    this.dataSource = new MatTableDataSource(this.notificationList);
    this.dataSource.sort = this.matSort;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.matSort;
  }

  getAllCommunities() {
    this._draftContentService.getAllCommunities().subscribe((data: any) => {
      this.communityList = data.data.value ?? [];

      if (this.communityList?.length) {
        if (this.isAdvocate) {
          this.communityList = this.communityList.filter((item) =>
            this.myCommunities?.includes(item.id)
          );
        }
        this.communityList.forEach((item: any) => {
          this.allCommunitiesId.push(item.id);
        });
      }

      this.allCommunityIds = [...this.communityList].map((item) => item.id);
      this.toggleAllSelection(true);
    });
  }

  getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return "0 of " + length;
    }

    const startIndex = page * pageSize;
    const endIndex =
      startIndex + pageSize > length ? length : startIndex + pageSize;
    return startIndex + 1 + " - " + endIndex + " of " + length;
  };

  sortingData() {
    this.dataSource.sortingDataAccessor = (item, property) => {
      const sortData = item?.data;
      switch (property) {
        case "status":
          return this.getStatus(sortData);
        case "title":
          return sortData?.title;
        case "deepLink":
          return sortData?.deepLink?.label;
        case "author":
          return (
            sortData?.author?.displayName?.toLowerCase() ??
            sortData?.author?.firstName?.toLowerCase()
          );
        case "date":
          return sortData.sendOn;
        case "audience":
          return this.targetAudience(sortData);
        case "community":
          return this.getCommunitiesTitle(sortData?.communities);
        default:
          return sortData[property];
      }
    };
  }

  getPN(communities: string[], status: string, pageNumber = -1) {
    const payLoad = {
      communities: communities.filter((data: any) => data !== 0),
      status: [status],
    };
    let sort = -1;
    pageNumber = pageNumber > -1 ? pageNumber + 1 : 1;
    this._viewAllPNService
      .getAllPn(pageNumber, this.pageSize, sort, payLoad)
      .subscribe((response) => {
        if (response?.data?.value) {
          this.notificationList = response?.data?.value?.pushNotifications;
          this.dataSource = new MatTableDataSource(this.notificationList);
          this.sortingData();
          this.dataSource.sort = this.matSort;
          this.paginator.pageIndex = pageNumber - 1;
          this.totalPNs = response?.data?.value?.totalCount;
          this.totalPages = Math.ceil(this.totalPNs / this.pageSize);
          this.allPages = [...Array(this.totalPages).keys()];
          this.paginator._intl.getRangeLabel = this.getRangeLabel;
        }
      });
  }

  get formControls() {
    return this.formFilter.controls;
  }

  toggleAllSelection(selectAll?: boolean) {
    if (this.allSelected?.selected || selectAll) {
      this.formFilter.controls.communities.patchValue([
        ...this.allCommunityIds,
        0,
        this.viewAllPNModule.noCommunity,
      ]);
      this.selectedCommunityIds =
        this.formFilter?.controls?.communities?.value?.filter(
          (item: any) => item !== 0
        );
      this.selectedCommunity = viewAllPNModule.allCommunities;
      this.getPN(this.selectedCommunityIds, this.formControls.pnFilters.value);
    } else {
      if (this.isAdvocateAction()) {
        this.noCommunity.deselect();
      }
      this.selectedCommunityIds = [];
      this.formFilter.controls.communities.patchValue([]);
      this.dataSource = new MatTableDataSource(this.selectedCommunityIds);
      this.dataSource.sort = this.matSort;
      this.totalPNs = 0;
      this._toasterService.error(viewStoryModule.selectCommunity);
    }
  }

  singleSelectAssignedCommunity() {
    this.paginator.pageIndex = 0;
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
          ? this.viewAllPNModule.allUsers
          : this.communityList.find(
              (item) => item.id === this.formControls.communities.value[0]
            )?.title ?? viewAllPNModule.allCommunities;
    }

    if (this.formControls.communities.value.length === 0) {
      this.selectedCommunityIds = [];
      this.dataSource = new MatTableDataSource(this.selectedCommunityIds);
      this.dataSource.sort = this.matSort;
      this.totalPNs = 0;
      this._toasterService.error(viewStoryModule.selectCommunity);
    } else {
      this.getPN(
        this.formControls.communities.value,
        this.formControls.pnFilters.value
      );
    }
  }

  getCommunitiesTitle(communitiyIds: string[]) {
    if (communitiyIds.length > 0) {
      const title: any = communitiyIds.map((id) => {
        return this.communityList.find((community) => community?.id === id)
          ?.title;
      });
      return title?.toString().split(",").join(", ");
    }
    return this.viewAllPNModule.noCommunityTitle;
  }

  handleStatusFilter() {
    this.getPN(
      this.formControls.communities.value,
      this.formControls.pnFilters.value
    );
  }

  getStatus(data: any) {
    if (data.removed) {
      return PNStatus.cancelled;
    }
    return data.isSent ? PNStatus.sent : PNStatus.scheduled;
  }

  colorCode(item: any) {
    const status = this.getStatus(item);
    switch (status) {
      case PNStatus.cancelled:
        return "#adb5bd";
      case PNStatus.sent:
        return "green";
      case PNStatus.scheduled:
        return "orange";
    }
  }

  isActionEnabled(item: any) {
    const status = this.getStatus(item);
    return status === PNStatus.scheduled ? true : false;
  }

  isAdvocateAction() {
    return this.currentAdminRole !== roles[1].role;
  }

  targetAudience(item: any) {
    let data = [];
    if (item.nonCommunityUsers) {
      data.push(this.schedulePNModule.includeNonJoinedUsers);
    }
    if (item.usersWithDraftStory) {
      data.push(this.schedulePNModule.usersWithDraftStory);
    }
    if (item.usersWithNoRecentLogin) {
      data.push(
        `${this.schedulePNModule.usersWithNoRecentLogin} (${item.numberOfLoginDays}days)`
      );
    }
    if (item.usersWithNoStory) {
      data.push(this.schedulePNModule.usersWithNoStory);
    }
    if (item.bannedUsers) {
      data.push(this.schedulePNModule.includeBannedUsers);
    }
    if (item.allUsers) {
      data.push(this.schedulePNModule.includeAllUsers);
    }

    return data.length > 0
      ? data
      : `All ${this.getCommunitiesTitle(item?.communities)} Users`;
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.totalPNs = event.length;

    this.getPN(
      this.formControls.communities.value,
      this.formControls.pnFilters.value,
      this.paginator.pageIndex
    );
  }

  goToPage(number: any) {
    this.getPN(
      this.formControls.communities.value,
      this.formControls.pnFilters.value,
      number
    );
  }

  editPN(item: any) {
    this.editData = {
      ...item.data,
      id: item.id,
    };
    this.modalDisplay = "block";
  }

  handleEditResult(result: EditPNResult) {
    this.onCloseModal();
    if (result.isSuccess) {
      this.getPN(
        this.formControls.communities.value,
        this.formControls.pnFilters.value
      );
    }
  }

  deletePN(item: any) {
    if (confirm(viewAllPNModule.confirmPnDelete)) {
      this._viewAllPNService.deletePn(item.id).subscribe((response) => {
        if (response.data?.isSuccess) {
          this._toasterService.success(viewAllPNModule.pnDeletedMessage);
          this.getPN(
            this.formControls.communities.value,
            this.formControls.pnFilters.value
          );
        }
      });
    }
  }

  onClickViewIcon(item: any) {
    const { data } = item;
    this.selectedViewPN = [
      { key: "Title", value: data.title },
      { key: "Body", value: data.body },
      {
        key: "Author",
        value: data.author.displayName ?? data.author.firstName,
      },
      { key: "DeepLink", value: data.deepLink.label },
      { key: "Target Audience", value: this.targetAudience(data) },
      { key: "Community", value: this.getCommunitiesTitle(data?.communities) },
      { key: "Publish date", value: data.sendOn },
    ];
    this.viewPNModalDispaly = "block";
  }

  onCloseModal() {
    this.modalDisplay = "none";
    this.viewPNModalDispaly = "none";
  }
}
