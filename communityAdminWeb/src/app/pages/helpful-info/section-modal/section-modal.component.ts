import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoadSectionData } from 'src/app/core/models/helpfulInfo';

@Component({
  selector: 'app-section-modal',
  templateUrl: './section-modal.component.html',
  styleUrls: ['./section-modal.component.scss']
})
export class SectionModalComponent implements OnInit {
  @Input() displayModal: boolean = false;
  @Input() sectionMode = '';
  @Input() sectionData!: LoadSectionData;
  @Output() onDataSubmit = new EventEmitter();
  @Output() onClose = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  closeModal() {
    this.onClose.emit();
  }

  onSubmit(data: any) {
    this.onDataSubmit.emit(data);
  }
}
