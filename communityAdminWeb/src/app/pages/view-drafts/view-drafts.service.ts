import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ExistingPosts } from "src/app/core/models/posts";
import { baseURL } from "src/environments/environment";
import { api, secureApi } from "src/app/core/apiUtils";

@Injectable({
  providedIn: "root",
})
export class ViewDraftsService {
  constructor(private httpClient: HttpClient) {}

  editDraftData: ExistingPosts | undefined;

  // Get All Draft Post from Server
  getAllDraftPosts(): Observable<ExistingPosts[]> {
    return this.httpClient.get<ExistingPosts[]>(
      baseURL +
        secureApi +
        api.getAllPosts +
        "?pageNumber=1&pageSize=50&sort=-1&published=false"
    );
  }

  // Delete Draft by ID
  deleteDraftById(id: string) {
    return this.httpClient.delete(
      baseURL + secureApi + api.deletePost + `/${id}`
    );
  }

  setDraftData(data: ExistingPosts | any) {
    this.editDraftData = data;
  }
  getDraftData() {
    return this.editDraftData;
  }
}
