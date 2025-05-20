import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { roles } from 'src/app/core/constants';
import { viewAllPostsModule } from 'src/app/core/defines';
import { Community, PostStatus } from 'src/app/core/models';
import { DraftContentService } from '../draft-content/draft-content.service';
import { ViewDraftsService } from '../view-drafts/view-drafts.service';

@Component({
  selector: 'app-view-all-posts',
  templateUrl: './view-all-posts.component.html',
  styleUrls: ['./view-all-posts.component.scss']
})
export class ViewAllPostsComponent implements OnInit {
  @ViewChild('allSelected') allSelected!: MatOption;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  form!: UntypedFormGroup;
  communityList: Community[] = [];
  viewAllPostsModule = viewAllPostsModule;
  communityIds: string[] = [];
  postsList: any[] = [];
  dataSource!: MatTableDataSource<any>;
  tableColumns = viewAllPostsModule.tableColumns;
  postFilters: Array<any> = viewAllPostsModule.postFilters;
  pollFilter: boolean = false;
  totalPosts = 0;
  pageSize = 10;
  totalPages = 0;
  allPages: number[] = [];
  selectedCommunity = '';
  pageIndex = 0;
  authorId = '';
  isEdited = false;
  isPostDetailedShown = false;
  selectedPostID = '';
  userRole = localStorage.getItem('role');
  myCommunities = localStorage.getItem('communities');
  shouldReloadPostData = false;
  public isAdmin =
    this.userRole === roles[0].role || this.userRole === roles[2].role;

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _draftContentService: DraftContentService,
    private _viewDraftsService: ViewDraftsService,
    private _toasterService: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.authorId = localStorage.getItem('id') ?? '';

    this.getCommunities();
    this.form = this._formBuilder.group({
      communities: [''],
      postFilters: [this.postFilters[0].value]
    });
    this.dataSource = new MatTableDataSource(this.postsList);
    this.dataSource.sort = this.matSort;
    this.spinner.show();
    this.getAllPosts();
  }

  getCommunities() {
    this._draftContentService
      .getAllCommunities(true, false)
      .subscribe((response: any) => {
        if (response.data.isSuccess) {
          this.communityList = response?.data?.value ?? [];
          if (!this.isAdmin) {
            this.communityList = this.communityList?.filter((community) =>
              this.myCommunities?.includes(community?.id)
            );
          }
          this.communityIds = this.communityList.map(
            (item: Community) => item.id
          );
          this.toggleAllSelect(true);
        }
      });
  }

  getStatus(data: any) {
    if (data?.darft || data.status === 'Draft') {
      return PostStatus.darft;
    }
    return data?.published ? PostStatus.published : PostStatus.scheduled;
  }

  getColorCode(item: any) {
    const status = this.getStatus(item);
    switch (status) {
      case PostStatus.darft:
        return '#adb5bd';
      case PostStatus.published:
        return 'green';
      case PostStatus.scheduled:
        return 'orange';
    }
  }

  handlePostFilter() {
    this.getAllPosts();
  }

  toggleAllSelect(isSelected?: boolean) {
    if (this.allSelected.selected || isSelected) {
      this.form.controls.communities.setValue([...this.communityIds, 0]);
      this.selectedCommunity = viewAllPostsModule.allCommunities;
      this.getAllPosts();
    } else {
      this.form.controls.communities.setValue([]);
      const data: any = [];
      this.dataSource = new MatTableDataSource(data);
      this.totalPosts = 0;
      this._toasterService.error(viewAllPostsModule.errorMessage);
    }
  }

  get formControls() {
    return this.form.controls;
  }

  onSigleSelectOption(data: Community) {
    this.paginator.pageIndex = 0;
    if (this.allSelected?.selected) {
      this.allSelected.deselect();
    }
    if (
      this.form.controls.communities.value.length === this.communityIds.length
    ) {
      this.allSelected.select();
      this.selectedCommunity = viewAllPostsModule.allCommunities;
    }

    if (this.form.controls.communities.value.length > 0) {
      this.selectedCommunity =
        this.communityList.find(
          (item) => item.id === this.form.controls.communities.value[0]
        )?.title ?? viewAllPostsModule.allCommunities;
    }
    if (this.form.controls.communities.value.length === 0) {
      const data: any = [];
      this.dataSource = new MatTableDataSource(data);
      this.totalPosts = 0;
      this._toasterService.error(viewAllPostsModule.errorMessage);
    } else {
      this.getAllPosts();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getAllPosts(pageNumber = -1) {
    pageNumber = pageNumber > -1 ? pageNumber + 1 : 1;
    if (this.formControls.communities.value === '') {
      return;
    }
    const communityIds = this.formControls.communities.value.filter(
      (item: any) => item !== 0
    );

    let status = [];
    if (
      viewAllPostsModule.postFilters[0].value ===
      this.formControls.postFilters.value
    ) {
      status = viewAllPostsModule?.postFilters
        ?.slice(1)
        .map((item) => item.name);
    } else {
      status = [this.formControls.postFilters.value];
    }

    this._draftContentService
      .getAllPosts(communityIds, status, pageNumber, this.pageSize, -1, true)
      .subscribe((response: any) => {
        if (response.data.isSuccess) {
          this.postsList = response.data.value.posts;
          this.sortdata();
          this.totalPosts = response.data.value.totalPosts;
          this.totalPages = Math.ceil(this.totalPosts / this.pageSize);
          this.allPages = [...Array(this.totalPages).keys()];
          this.setPostData();
        }
      });
  }

  sortdata() {
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'title':
          return item?.content?.en?.title?.toLowerCase();
        case 'author':
          return !!item.author.displayName?.toLowerCase()
            ? item.author.displayName?.toLowerCase()
            : item.author.firstName?.toLowerCase();
        case 'date':
          return item.updatedDate;
        case 'community':
          return this.getCommunity(item.communities[0].id);
      }

      return '';
    };
  }

  onSelectStatus() {
    this.getAllPosts();
  }

  goToPage(pageNo: number) {
    this.pageIndex = pageNo;
    this.getAllPosts(pageNo);
  }

  pageChanged(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getAllPosts(event.pageIndex);
  }

  getCommunity(id: string) {
    return this.communityList.find((item) => item.id === id)?.title;
  }

  deletPost(post: any) {
    const deleteMessage =
      post?.numberOfVotes >= 0
        ? viewAllPostsModule.confirmDeletePoll
        : viewAllPostsModule.confirmDelete;
    if (confirm(deleteMessage)) {
      this._viewDraftsService
        .deleteDraftById(post.id)
        .subscribe((response: any) => {
          if (response.data.isSuccess) {
            this._toasterService.success(viewAllPostsModule.deleteSuccess);
            this.getAllPosts(this.pageIndex);
          }
        });
    }
  }

  editPost(post: any) {
    this.isPostDetailedShown = false;
    this._viewDraftsService.setDraftData(post);
    this.isEdited = true;
  }

  onEditClose(shouldRefetch?: boolean) {
    this.isEdited = false;
    if (shouldRefetch) {
      this.spinner.show();
      this.getAllPosts(this.pageIndex);
    }
  }

  closeDetailedView() {
    if (this.shouldReloadPostData) {
      this.getAllPosts(this.pageIndex);
    }
    this.shouldReloadPostData = false;
    this.isPostDetailedShown = false;
  }

  openDetailedView(item: any) {
    this.selectedPostID = item;
    this.isPostDetailedShown = true;
  }

  reloadData() {
    this.shouldReloadPostData = true;
  }

  onPollFilter(event: MatSlideToggleChange) {
    this.pollFilter = event.checked;
    this.setPostData();
  }

  setPostData() {
    if (this.pollFilter) {
      const filterList = this.postsList.filter(
        (post) => post?.numberOfVotes >= 0
      );
      this.dataSource = new MatTableDataSource(filterList);
    } else {
      this.dataSource = new MatTableDataSource(this.postsList);
    }
  }
}
