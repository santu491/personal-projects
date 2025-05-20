import { Injectable } from '@angular/core';
import { communityApis, communityPublicApi } from 'src/app/core/apiUtils';
import { EnvType, commercialMember, v2Env } from 'src/app/core/constants';
import { Filter } from 'src/app/core/models';
import { MetricsService } from './metrics.service';

@Injectable({ providedIn: 'root' })
export class MetricsHelperService {
  marketBrandOptions: Filter[] = [];
  commercialBrand: Filter[] = [];

  constructor(private _metricsService: MetricsService) {}

  getMemberTypes(type: EnvType, callbackFn?: () => void) {
    this._metricsService
      .getPublicContent(
        v2Env[type] + communityPublicApi + communityApis.content + '/en'
      )
      .subscribe((res: any) => {
        if (res.data?.isSuccess) {
          this.marketBrandOptions = [];
          this.commercialBrand = [];
          const data = res.data.value;
          const publicContent = data.filter((content: any) => {
            return content.contentType === 'public';
          })[0];
          const options: any[] =
            publicContent?.data?.preLoginModule.medicaid.content.initialScreen
              .dropDownOptionsList.stateList;
          for (const option of options) {
            const marketPrefix = option.memberType.split('=')[1];
            if (marketPrefix === commercialMember.memberCode) {
              const commercialIndex = this.commercialBrand.findIndex(
                (marketBrand) =>
                  marketBrand.value === commercialMember.memberCode
              );
              if (commercialIndex < 0) {
                this.commercialBrand.push({
                  value: marketPrefix,
                  title: commercialMember.title
                });
              }
              continue;
            } else {
              for (const market of option.market) {
                this.marketBrandOptions.push({
                  value: `${marketPrefix}-${option.marketingBrand}-${market}`,
                  title: `${market} Medicaid ${option.name}`
                });
              }
            }
          }
          this.sortMarketBrand(this.marketBrandOptions);
        }
        if (callbackFn) {
          callbackFn();
        }
      });
  }

  sortMarketBrand(marketBrands: any[]) {
    marketBrands.sort((a, b) => {
      if (a.title > b.title) {
        return 1;
      }
      if (a.title < b.title) {
        return -1;
      }
      return 0;
    });
  }
}
