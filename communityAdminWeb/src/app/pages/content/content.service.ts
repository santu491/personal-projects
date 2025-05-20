import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { api, secureApi } from 'src/app/core/apiUtils';
import { CONTENT_TYPE } from 'src/app/core/constants';
import { TrainingLink } from 'src/app/core/models';
import { baseURL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  constructor(private httpClient: HttpClient) {}

  getContent(lang: string, version: string, type: string): Observable<any> {
    return this.httpClient.get<any>(`${baseURL}${secureApi}${api.content}`, {
      params: {
        language: lang,
        version: version,
        contentType: type
      }
    });
  }

  getContentByType(lang: string, type: CONTENT_TYPE): Observable<any> {
    return this.httpClient.get<any>(
      `${baseURL}${secureApi}${api.content}/${type}`,
      {
        params: {
          language: lang
        }
      }
    );
  }

  getTouContent(lang: string): Observable<any> {
    return this.httpClient.get<any>(
      `${baseURL}${secureApi}${api.content}${api.tou}`,
      {
        params: {
          language: lang
        }
      }
    );
  }

  getContentOptions(key: string): Observable<any> {
    return this.httpClient.get<any>(
      `${baseURL}${secureApi}${api.contentOptions}?key=${key}`
    );
  }

  getContentVesrions(contentType: string, language: string): Observable<any> {
    return this.httpClient.get<any>(
      `${baseURL}${secureApi}${api.contentVersions}?contentType=${contentType}&&language=${language}`
    );
  }
  uploadContent(lang: string, type: string, file: FormData): Observable<any> {
    return this.httpClient.post<any>(
      `${baseURL}${secureApi}${api.content}?language=${lang}&contentType=${type}`,
      file
    );
  }

  updateTrainingLink(helpSection: TrainingLink): Observable<any> {
    return this.httpClient.put<any>(
      `${baseURL}${secureApi}${api.content}${api.trainingLink}`,
      helpSection
    );
  }
}
