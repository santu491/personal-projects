import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { baseURL } from "src/environments/environment";
import { api, secureApi } from "../apiUtils";

@Injectable({ providedIn: "root" })
export class LibraryContentService {
    constructor(private _httpClient: HttpClient) {}

    getDeeplinkData(language: string){
        return this._httpClient.get(
            baseURL + secureApi + api.linksData,
            {
                params: {
                    language: language
                }
            }
        );
    }

    getLibraryDeeplinkData(communityId: string, language: string){
        return this._httpClient.get(
            baseURL + secureApi + api.linksData,
            {
                params: {
                    communityId: communityId,
                    language: language
                }
            }
        );
    }

    getContent(communityId: string, libraryId: string, language: string) {
        return this._httpClient.get(
            baseURL + secureApi + api.contentLink,
            {
                params: {
                    communityId: communityId,
                    libraryId: libraryId,
                    language: language
                }
            }
        );
    }
}