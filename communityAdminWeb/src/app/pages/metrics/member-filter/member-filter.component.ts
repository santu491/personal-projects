import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { EnvType } from 'src/app/core/constants';
import { Filter } from 'src/app/core/models';
import { baseURL, env } from 'src/environments/environment';
import { MetricsHelperService } from '../metrics-helper.service';

@Component({
  selector: 'app-member-filter',
  templateUrl: './member-filter.component.html',
  styleUrls: ['./member-filter.component.scss']
})
export class MemberFilterComponent implements OnInit {
  marketBrandOptions: Filter[] = [];
  commercialBrand: Filter[] = [];
  selectedMemberTypeValue: string = '';
  showFilter: boolean = false;
  public isProd: boolean = baseURL === env.prod ? true : false;

  @Input('envName') envName: EnvType = this.isProd ? 'prod' : 'sit';
  @Input('resetRequired') resetRequired: boolean = false;
  @Output() selectedMemberType = new EventEmitter<string>();

  constructor(
    private _metricsHelperService: MetricsHelperService
    ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['resetRequired'] && changes['resetRequired'].currentValue) {
      this.selectedMemberTypeValue = '';
    }
    if (
      changes['envName'] &&
      changes['envName'].currentValue !== changes['envName'].previousValue
    ) {
      this.selectedMemberTypeValue = '';
      this.marketBrandOptions = [];
      this.commercialBrand = [];
      this.showFilter = false;
      this.getMemberTypes(this.envName);
    }
  }

  getMemberTypes(type: EnvType) {
    this._metricsHelperService.getMemberTypes(type , () => {
      this.commercialBrand = this._metricsHelperService.commercialBrand;
      this.marketBrandOptions = this._metricsHelperService.marketBrandOptions;
    });
    this.showFilter = true;
  }

  selectMemberType(memberType: string) {
    this.selectedMemberTypeValue = memberType;
    this.selectedMemberType.emit(memberType);
  }
}
