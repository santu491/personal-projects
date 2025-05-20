import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { generic, PARTNER_FILTER } from 'src/app/core/constants';
import { Partners } from 'src/app/core/models/partners';
import { PartnersService } from './partners.service';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.scss']
})
export class PartnersComponent implements OnInit {
  partners: Partners[] = [];
  filterPartners: Partners[] = [];
  displayAddPartner = false;
  selectedPartnerData!: Partners | null;

  filterBy = PARTNER_FILTER.all;

  constructor(
    private partnersService: PartnersService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getPartnerData();
  }

  getPartnerData() {
    this.partnersService.getAllPartners(false).subscribe((result: any) => {
      if (result.data?.isSuccess) {
        this.partners = result.data?.value;
        this.partners.sort((a, b) => {
          return a.title.toUpperCase() > b.title.toUpperCase()
            ? 1
            : b.title.toUpperCase() > a.title.toUpperCase()
            ? -1
            : 0;
        });
        this.setPartners();

        if (this.partners?.length === 0) {
          this.toastrService.info('No Partner Data found');
        }
      } else {
        this.toastrService.error(generic.errorMessage);
      }
    });
  }

  addNewPartner() {
    this.selectedPartnerData = null;
    this.displayAddPartner = true;
  }

  onAddPartner() {
    this.showCloseModal();
    this.getPartnerData();
  }

  showCloseModal() {
    this.displayAddPartner = !this.displayAddPartner;
  }

  editData(data: any) {
    this.selectedPartnerData = data;
    this.showCloseModal();
  }

  setPartners() {
    switch (this.filterBy) {
      case PARTNER_FILTER.active:
        this.filterPartners = this.partners.filter((p) => p.active);
        break;
      case PARTNER_FILTER.inactive:
        this.filterPartners = this.partners.filter((p) => !p.active);
        break;
      case PARTNER_FILTER.meredith:
        this.filterPartners = this.partners.filter(
          (p) => p.type === PARTNER_FILTER.meredith
        );
        break;
      case PARTNER_FILTER.OtherPartner:
        this.filterPartners = this.partners.filter(
          (p) =>
            p.type === PARTNER_FILTER.OtherPartner ||
            p.type != PARTNER_FILTER.meredith
        );
        break;
      case PARTNER_FILTER.all:
      default:
        this.filterPartners = this.partners;
        break;
    }
  }
}
