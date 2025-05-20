import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { api, secureApi } from 'src/app/core/apiUtils';
import { baseURL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContentInfoService {
  constructor(private httpClient: HttpClient) {}

  getLatestContent(
    contentType: string,
    langauage: string = 'en'
  ): Observable<any> {
    return this.httpClient.get(
      `${baseURL}${secureApi}${api.content}/${contentType}?language=${langauage}`
    );
  }
}
