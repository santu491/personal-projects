import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { generic, roles } from 'src/app/core/constants';
import { viewStoryModule } from 'src/app/core/defines';
import { Community, PersonaDetails } from 'src/app/core/models';
import { FlagStory } from 'src/app/core/models/story';
import { DraftContentService } from '../draft-content/draft-content.service';
import { ViewDraftsService } from '../view-drafts/view-drafts.service';
import { ViewStoriesService } from './view-stories.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-view-stories',
  templateUrl: './view-stories.component.html',
  styleUrls: ['./view-stories.component.scss'],
})
export class ViewStoriesComponent implements OnInit {
  @ViewChild('allSelected') private allSelected!: MatOption;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  displayedColumns = viewStoryModule.columns;
  public dataSource!: MatTableDataSource<any>;
  public totalRows = 0;
  public pageSize = 10;
  public totalStories = 0;
  public pageSizeOptions: number[] = [10];
  public display: string = 'none';
  public currentSelectedRow: any;
  public communityList: Array<Community> = [];
  public allCommunitiesId: any = [];
  public filterForm!: UntypedFormGroup;
  public selectedCommunityName: string = '';
  private selectedCommunitiesId: Array<any> = [];
  public selectedStoryId: string = '';
  private storiesList: Array<any> = [];
  public filters: Array<any> = viewStoryModule.storyFilters;
  public viewStoryModule = viewStoryModule;
  public communityName = '';
  public modalTitle = 'Story Details';
  public pageJumpNumber: number = 0;
  public allPages: number[] = [];
  public totalPages: number = 0;
  public story: any = null;
  public isAdvocate: boolean = localStorage.getItem('role') === roles[1].role;
  private myCommunities: any = localStorage.getItem('communities');
  public selectedPersona: string | null = localStorage.getItem('id');
  public personaDetails: any = [];
  public allowComment: boolean = false;

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _route: ActivatedRoute,
    private _draftContentService: DraftContentService,
    private _viewStoriesService: ViewStoriesService,
    private _toastrService: ToastrService,
    private _toastService: ToastrService
  ) {
  }

  ngOnInit(): void {
    this.callGetPersonaDetails();
    this.filterForm = this._formBuilder.group({
      communities: [''],
      storyFilters: ['all'],
    });
    this.dataSource = new MatTableDataSource(this.storiesList);
    this.getStory();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property.includes('.'))
        return property.split('.').reduce((o, i) => o[i], item);
      return item[property];
    };
    this.dataSource.sort = this.matSort;
  }

  get communities(): UntypedFormControl {
    return this.filterForm.get('communities') as UntypedFormControl;
  }

  callGetAllCommunities() {
    this._draftContentService.getAllCommunities(true, false).subscribe((data: any) => {
      this.communityList = data?.data?.value ?? [];
      if (data?.data?.value) {
        if (this.isAdvocate) {
          this.communityList = this.communityList.filter((community) =>
            this.myCommunities?.includes(community?.id)
          );
        }
        this.communityList.forEach((item: any) => {
          this.allCommunitiesId.push(item.id);
        });
        if (!localStorage?.getItem('subCommunities')) {
          this.saveCancerCommunities();
        }
        this.toggleAllSelection(true);
      }
    });
  }

  toggleAllSelection(selectAll?: boolean) {
    if (this.allSelected?.selected || selectAll) {
      this.filterForm.controls.communities.patchValue([
        ...this.allCommunitiesId,
        0,
      ]);
      this.selectedCommunityName = viewStoryModule.allCommunities;
      let tempArray: Array<any> = this.filterForm.controls.communities?.value;
      this.selectedCommunitiesId = tempArray.filter((item: any) => item !== 0);
      this.getStories(
        this.selectedCommunitiesId,
        this.filterForm.controls.storyFilters.value
      );
    } else {
      this.selectedCommunitiesId = [];
      this.dataSource = new MatTableDataSource(this.selectedCommunitiesId);
      this._toastrService.error(viewStoryModule.selectCommunity);
      this.filterForm.controls.communities.patchValue([]);
    }
  }

  singleSelectAssignedCommunity() {
    this.paginator.pageIndex = 0;
    if (this.allSelected?.selected) {
      this.allSelected?.deselect();
    }
    if (
      this.filterForm.controls.communities.value?.length ==
      this.communityList?.length
    ) {
      this.allSelected?.select();
    }
    if (this.filterForm.controls.communities?.value) {
      let checkValue = this.filterForm.controls.communities?.value[0];
      const selectedCommunity = this.communityList?.filter(
        (item: any) => item.id == checkValue
      );
      this.selectedCommunityName =
        selectedCommunity[0]?.title || viewStoryModule.allCommunities;
      const tempArray: Array<any> = this.filterForm.controls.communities?.value;
      this.selectedCommunitiesId = tempArray.filter((item: any) => item !== 0);
    }
    if (this.selectedCommunitiesId.length === 0) {
      this.dataSource = new MatTableDataSource(this.selectedCommunitiesId);
      this._toastrService.error(viewStoryModule.selectCommunity);
    } else {
      this.getStories(
        this.selectedCommunitiesId,
        this.filterForm.controls.storyFilters.value
      );
    }
  }

  applyFilters() {
    this.getStories(
      this.selectedCommunitiesId,
      this.filterForm.controls.storyFilters.value
    );
  }

  getStories(communities: any[], type: string, pageNumber = -1) {
    const payload = {
      communities,
      type,
    };
    let sort = -1;
    pageNumber = pageNumber > -1 ? pageNumber + 1 : 1;
    this._viewStoriesService
      .getAllStories(pageNumber, this.pageSize, sort, payload)
      .subscribe((res) => {
        if (res.data.isSuccess) {
          this.storiesList = res.data.value.stories;
          this.paginator.pageIndex = pageNumber - 1;
          this.dataSource = new MatTableDataSource(this.storiesList);
          this.totalStories = res.data.value.totalCount;
          this.totalPages = Math.ceil(this.totalStories / this.pageSize);
          this.allPages = [
            ...Array(this.totalPages).keys()
          ];
          this.paginator._intl.getRangeLabel = this.getRangeLabel;
        } else {
          this._toastrService.error(res.data.errors.detail);
        }
      });
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.totalStories = event.length;
    this.getStories(
      this.selectedCommunitiesId,
      this.filterForm.controls.storyFilters.value,
      this.paginator.pageIndex
    );
  }

  getCommunityName(id: string) {
    return this.communityList.filter((community) => community.id === id)[0].title;
  }

  reportStory(data: FlagStory) {
    if (data.flagged ? confirm(viewStoryModule.reportStoryConfirm) : true) {
      if (data.story) {
        this._viewStoriesService
          .flagUnflagStory(data.story.id, data.flagged)
          .subscribe((res) => {
            if (res.data.isSuccess) {
              this._toastrService.success(
                data.flagged
                  ? viewStoryModule.storyFlag
                  : viewStoryModule.storyUnflagged
              );
              this.getStories(
                this.selectedCommunitiesId,
                this.filterForm.controls.storyFilters.value,
                this.paginator.pageIndex
              );
            } else {
              this._toastrService.error(res.data.errors.detail);
            }
          });
      }
    }
  }

  banUser(story: any) {
    if (confirm(viewStoryModule.banUserConfirm)) {
      this._viewStoriesService.banUser(story.authorId).subscribe((res) => {
        if (res.data.isSuccess) {
          this._toastrService.success(viewStoryModule.bannedUser);
          this.getStories(
            this.selectedCommunitiesId,
            this.filterForm.controls.storyFilters.value,
            this.paginator.pageIndex
          );
        } else {
          this._toastrService.error(res.data.errors.detail);
        }
      });
    }
  }

  removeStory(story: any) {
    if (confirm(viewStoryModule.removeStoryConfirm)) {
      this._viewStoriesService.removeStory(story.id).subscribe((res) => {
        if (res.data.isSuccess) {
          this._toastrService.success(viewStoryModule.storyRemoved);
          this.getStories(
            this.selectedCommunitiesId,
            this.filterForm.controls.storyFilters.value,
            this.paginator.pageIndex
          );
        } else {
          this._toastrService.error(res.data.errors.detail);
        }
      });
    }
  }

  openModal(story: any) {
    this.allowComment = story.allowComments;
    this.currentSelectedRow = story;
    this.selectedStoryId = story.id;
    this.modalTitle = story.featuredQuote;
    this.communityName = this.getCommunityName(story.communityId);
    this.display = 'block';
  }

  onCloseModal() {
    this.selectedStoryId = "";
    this.display = 'none';
  }

  getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return '0 of ' + length;
    }

    const startIndex = (page) * pageSize;
    const endIndex = (startIndex + pageSize) > length ?
      length :
      startIndex + pageSize;
    return startIndex + 1 + ' - ' + endIndex + ' of ' + length;
  }

  goToPage(number: any) {
    this.getStories(
      this.selectedCommunitiesId,
      this.filterForm.controls.storyFilters.value,
      number
    );
  }

  saveCancerCommunities() {
    const cancerCommunity = this.communityList.filter((community) => community.category == "Cancer");
    if (cancerCommunity.length != 0) {
      this._viewStoriesService.getSubCommunities(cancerCommunity[0].id)
        .subscribe(
          (res: any) => {
            if (res.data?.isSuccess) {
              let subCommunities: { [x: string]: string; } = {};
              res.data.value.forEach(
                (subCommunity: { id: string, title: string }) => {
                  if (subCommunity.id != '')
                    subCommunities[subCommunity.id] = subCommunity.title
                }
              )
              localStorage.setItem('subCommunities', JSON.stringify(subCommunities));
            }
          }
        )
    }
  }

  getStory() {
    try {
      const storyId = this._route.snapshot.paramMap.get('storyId');
      if (storyId !== null) {
        this._viewStoriesService.getStory(storyId).subscribe(
          (res: any) => {
            if (res?.data?.isSuccess) {
              this.story = res.data.value;
              if (this.communityList.length == 0) {
                this._draftContentService.getAllCommunities().subscribe((data: any) => {
                  this.communityList = data?.data?.value ?? [];
                  this.openModal(this.story);
                });
              } else {
                this.openModal(this.story);
              }
            }
          }, 
          (_error: any): void => {
            console.log('Here I am....');
            this.showNotFoundError(viewStoryModule.storyNotFound, viewStoryModule.storyNotAvilable, 'info');
          }
        );
      }
    } catch (error) {
      this._toastService.error(generic.errorMessage);
    }
  }

  callGetPersonaDetails = async () => {
    this._draftContentService.getPersonaDetails().subscribe((response) => {
      this.callGetAllCommunities();
      if (response?.data?.value) {
        this.personaDetails = response?.data?.value;
      }
    });
  };

  isPersonaEnabled = () => {
    return (
      localStorage.getItem('role') === roles[0].role ||
      localStorage.getItem('role') === roles[2].role
    );
  };

  onSelectPersona(data: PersonaDetails | null) {
    this.selectedPersona = (data) ? data.id : localStorage.getItem('id');
  }

  getUserRoleTitle = () => {
    return localStorage.getItem('role') === roles[0].role
      ? roles[0].name
      : roles[2].name;
  };

  showNotFoundError(
    title: string,
    message: string,
    icon: SweetAlertIcon,
  ) {
    return Swal.fire({
      title: title,
      text: message,
      icon: icon
    });
  }
}
