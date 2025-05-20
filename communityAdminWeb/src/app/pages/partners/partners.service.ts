import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { api, secureApi } from 'src/app/core/apiUtils';
import { AppImageData } from 'src/app/core/models';
import { PartnerRequest, Partners } from 'src/app/core/models/partners';
import { baseURL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PartnersService {
  activePartners: Partners[] = [];

  constructor(private _httpClient: HttpClient) {}

  getAllPartners(getActive: boolean): Observable<Partners[]> {
    return this._httpClient.get<Partners[]>(
      baseURL + secureApi + api.partners,
      {
        params: {
          active: getActive
        }
      }
    );
  }

  addPartner(data: PartnerRequest) {
    return this._httpClient.post(baseURL + secureApi + api.partners, data);
  }

  editPartner(id: string, data: PartnerRequest) {
    return this._httpClient.put(
      baseURL + secureApi + api.partners + '/' + id,
      data
    );
  }

  getPartner(id: string) {
    return this._httpClient.get(baseURL + secureApi + api.partners + '/' + id);
  }

  getPartnerArticleImages(partners: Partners[]): AppImageData[] {
    const imageData: AppImageData[] = partners.map((partner) => {
      const image: AppImageData = {
        id: partner.id,
        title: partner.title,
        image: partner.articleImage ?? partner.logoImage,
        type: partner?.type ?? ''
      };
      return image;
    });
    return imageData;
  }
}
