import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DateRange } from 'src/app/core/models/common';
import { CustomMaterialModule } from 'src/app/custom-material.module';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CustomMaterialModule, CommonModule]
})
export class DateRangePickerComponent implements OnInit {
  range = new FormGroup({
    start: new FormControl<string | null>(''),
    end: new FormControl<string | null>('')
  });

  @ViewChild('picker') picker!: any;
  @Output() onDateRangeSelect = new EventEmitter<DateRange>();
  @Output() onDateReset = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  get start() {
    return this.range.get('start');
  }

  get end() {
    return this.range.get('end');
  }

  selectDate() {
    if (
      this.range.controls.start.hasError('matStartDateInvalid') ||
      this.range.controls.end.hasError('matEndDateInvalid')
    ) {
      return;
    }

    if (!!this.range.value.start && !!this.range.value.end) {
      const startDate = new Date(this.range.value.start);
      const endDate = new Date(this.range.value.end);
      endDate.setDate(endDate.getDate() + 1)
      this.onDateRangeSelect.emit({
        start: `${startDate.getUTCFullYear()}-${startDate.getUTCMonth() + 1}-${
          startDate.getUTCDate()
        }`,
        end: `${endDate.getUTCFullYear()}-${endDate.getUTCMonth() + 1}-${
          endDate.getUTCDate()
        }`
      });
    } else {
      this.picker.open();
    }
  }

  clearStartDate() {
    this.range.reset();
    this.onDateReset.emit();
  }
}
