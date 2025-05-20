import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { api, secureApi } from "src/app/core/apiUtils";
import { Templates } from "src/app/core/models/notification";
import { baseURL } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})

export class NotificationComponetService {
  constructor(private httpClient: HttpClient) {}
  
  getAllPNTemplates(): Observable<Templates[]> {
    return this.httpClient.get<Templates[]>(
      baseURL +
        secureApi +
        api.pushNotification +
        api.template,
    );
  } 

  updatePNTemplate(templateData: Templates, templateId: string): Observable<any> {
    return this.httpClient.put(baseURL + 
        secureApi + 
        api.pushNotification +
        api.template, 
        { en: templateData },
        {
            params: {
                templateId: templateId
            }
        });
  }
}
