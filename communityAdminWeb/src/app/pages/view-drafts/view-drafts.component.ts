import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { viewDrafts } from "src/app/core/defines";
import { ExistingPosts } from "src/app/core/models";
import { dateDifference } from "src/app/core/utils";
import { ViewDraftsService } from "./view-drafts.service";
@Component({
  selector: "app-view-drafts",
  templateUrl: "./view-drafts.component.html",
  styleUrls: ["./view-drafts.component.scss"],
})
export class ViewDraftsComponent implements OnInit {
  constructor(
    private _router: Router,
    private _viewDraftsService: ViewDraftsService,
    private _toastrService: ToastrService
  ) {}
  draftList: Array<ExistingPosts> = [];
  public drafts = viewDrafts;
  public noDraftsLine1: string = viewDrafts.noDraftsLine1;
  public noDraftsLine2: string = viewDrafts.draftsLoadingLine2;
  isEditEnable = false;

  callGetAllDraftPosts() {
    // Get Draft Posts List
    this._viewDraftsService.getAllDraftPosts().subscribe((data: any) => {
      this.draftList = data?.data?.value?.posts ?? [];
      // Converting ISO Date to Relative Time
      this.draftList?.forEach((draftItem, i) => {
        this.draftList[i].updatedDate = dateDifference(draftItem.updatedDate);
      });

      if (this.draftList.length == 0) {
        this.noDraftsLine1 = viewDrafts.noDraftsLine1;
        this.noDraftsLine2 = viewDrafts.noDraftsLine2;
      }
    });
  }

  deleteDraft(id: string) {
    if (confirm(viewDrafts.confirmDelete)) {
      this._viewDraftsService.deleteDraftById(id).subscribe((data: any) => {
        if (data?.data?.isSuccess) {
          this._toastrService.success(viewDrafts.deleteSuccess);
          this.callGetAllDraftPosts();
        }
      });
    }
  }

  editDraftPost(draftData: ExistingPosts) {
    // Pass data to Draft Content to Edit

    this._viewDraftsService.setDraftData(draftData);
    this.isEditEnable = true;
  }

  ngOnInit(): void {
    this.callGetAllDraftPosts();
  }

  onEditClose() {
    this.isEditEnable = false;
  }

  onDraftPost() {
    this.callGetAllDraftPosts();
    this.onEditClose();
  }
}
