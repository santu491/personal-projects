import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { api, secureApi } from 'src/app/core/apiUtils';
import { Prompt } from 'src/app/core/models/prompts';
import { baseURL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PromptsService {

  constructor(private _httpClient: HttpClient) {}

  getCommunityPrompts(communityId: string) {
    return this._httpClient.get(
      `${baseURL}${secureApi}${api.prompts}/${communityId}`
    );
  }

  setCommunityPrompts(promptData: Prompt[], communityId: string | null) {
    if(communityId == null) {
      return;
    }
    return this._httpClient.post(
      `${baseURL}${secureApi}${api.prompts}`,
      {
        communityId: communityId,
        prompts: promptData
      }
    );
  }
}
