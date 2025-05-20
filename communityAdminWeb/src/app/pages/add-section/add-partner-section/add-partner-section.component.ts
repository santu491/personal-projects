import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { generic } from 'src/app/core/constants';
import { ImageType } from 'src/app/core/models';
import { PartnerSection, Partners } from 'src/app/core/models/partners';
import { PartnersService } from '../../partners/partners.service';

@Component({
  selector: 'add-partner-section',
  templateUrl: './add-partner-section.component.html',
  styleUrls: ['./add-partner-section.component.scss']
})
export class AddPartnerSectionComponent implements OnInit {
  @Input() displayModal = false;
  @Input() partnerData!: PartnerSection;
  @Output() onClose = new EventEmitter();
  @Output() onAdd = new EventEmitter<PartnerSection>();

  partners: Partners[] = [];
  selectedPartner!: PartnerSection;
  partnerError = false;
  errorMessage = '';
  title = '';
  enDescription = '';
  esDescription = '';
  imageLink = '';
  iconType = ImageType.ICON;

  constructor(
    private partnerSvc: PartnersService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.partnerSvc.getAllPartners(true).subscribe(
      (result: any) => {
        this.partnerSvc.activePartners = this.partners = result.data.value;
      },
      () => {
        this.toastr.error(generic.pleaseTryAgain);
        this.onClose.emit();
      }
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.partnerData?.currentValue?.isEdit) {
      this.selectedPartner = this.partnerData;
      const image = this.partnerSvc.activePartners.filter(
        (partner: Partners) => partner.id === this.partnerData.id
      );
      this.imageLink = image[0].logoImage;

      this.enDescription = this.partnerData.description.en;
      this.esDescription = this.partnerData.description.es;
      this.title = this.partnerData.title;
    } else {
      this.initSelectedPartner();
    }
  }

  initSelectedPartner() {
    this.selectedPartner = {
      title: '',
      description: {
        en: '',
        es: ''
      },
      id: '',
      logoImage: ''
    };
  }

  closeModal() {
    this.initSelectedPartner();
    this.onClose.emit();
  }

  selectImage(partner: Partners) {
    this.selectedPartner.title = this.title = partner.title;
    this.selectedPartner.id = partner.id;
    this.enDescription = this.esDescription = '';
  }

  addPartner() {
    this.partnerError = this.selectedPartner?.id === '';
    this.errorMessage = this.partnerError ? 'Select a Partner Logo' : '';

    if (!this.partnerError) {
      this.selectedPartner.description.en = this.enDescription.trim();
      this.selectedPartner.description.es = this.esDescription.trim();
      this.onAdd.emit(this.selectedPartner);
    }
  }
}
