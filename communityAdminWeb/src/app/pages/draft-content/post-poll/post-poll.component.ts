import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { Language } from 'src/app/core/constants';
import { postsModule } from 'src/app/core/defines';
import { PollData, PollOption } from 'src/app/core/models';
import { generateHexId } from 'src/app/core/utils';

@Component({
  selector: 'app-post-poll',
  templateUrl: './post-poll.component.html',
  styleUrls: ['./post-poll.component.scss']
})
export class PostPollComponent implements OnInit {
  @Input() pollData!: PollData | null;
  @Input() isSpanishEnabled = false;
  @Output() onAddPoll = new EventEmitter<PollData | null>();

  postsModule = postsModule;

  // Data
  enQuestion = '';
  esQuestion = '';
  pollEndDate = 1;
  days = this.getDayOptions();

  //Flags
  optionError = false;
  spanishError = false;
  created = false;

  constructor() {}

  ngOnInit(): void {
    if (!this.pollData) {
      this.pollData = this.initPollData();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.pollData && changes.pollData.currentValue?.isEdit) {
      this.enQuestion = changes.pollData.currentValue.en.question;
      this.esQuestion = changes.pollData.currentValue.es.question;
      this.pollEndDate = changes.pollData.currentValue.en.endsOn;
    }
  }

  initOption() {
    const id = generateHexId();
    return {
      en: {
        id: id,
        text: ''
      },
      es: {
        id: id,
        text: ''
      }
    };
  }

  initPollData() {
    // Option length is between 2 and 6
    const options = [this.initOption(), this.initOption()];
    return {
      en: {
        question: '',
        endsOn: 0,
        options: [options[0].en, options[1].en]
      },
      es: {
        question: '',
        endsOn: 0,
        options: [options[0].es, options[1].es]
      },
      isEdit: false,
      isEditAllowed: true
    };
  }

  setOption(index: number, language: string, event: any) {
    if (this.pollData) {
      if (language === Language.ENGLISH) {
        this.pollData.en.options[index].text = event.target.value;
      } else {
        this.pollData.es.options[index].text = event.target.value;
      }
      this.submitPoll();
    }
  }

  addOption() {
    const newPollOption = this.initOption();
    this.pollData?.en.options.push(newPollOption.en);
    this.pollData?.es.options.push(newPollOption.es);
  }

  submitPoll() {
    if (this.enQuestion.trim() === '') {
      this.enQuestion = '';
      return;
    }

    if (this.isSpanishEnabled && this.esQuestion.trim() === '') {
      this.esQuestion = '';
      this.spanishError = true;
      return;
    }
    this.spanishError = false;

    if (this.pollData) {
      this.pollData.en.question = this.enQuestion;
      this.pollData.es.question = this.esQuestion.trim() || this.enQuestion;

      if (
        !this.validatePollOptions(this.pollData?.en.options) ||
        (this.isSpanishEnabled &&
          !this.validatePollOptions(this.pollData?.es.options))
      ) {
        this.optionError = true;
        return;
      } else {
        this.optionError = false;
      }
      this.pollData.en.endsOn = this.pollData.es.endsOn = this.pollEndDate;
      this.pollData.isEdit = true;
      this.pollData.isEditAllowed = this.pollData.isEditAllowed ?? true;
      this.onAddPoll.emit(this.pollData);
    }
  }

  validatePollOptions(options: PollOption[]) {
    const emptyOption = options.filter((option) => option.text.trim() === '');
    if (emptyOption && emptyOption?.length > 0) {
      return false;
    }

    return true;
  }

  isAddOptionDisabled() {
    return this.pollData && this.pollData.en.options.length >= 6;
  }

  getDayOptions() {
    const days = Array(6)
      .fill(0)
      .map((_, index) => {
        return {
          value: index + 1,
          key: index + 1 + ' Day' + (index > 0 ? 's' : '')
        };
      });
    const weeks = Array(6)
      .fill(0)
      .map((_, index) => {
        return {
          value: (index + 1) * 7,
          key: index + 1 + ' Week' + (index > 0 ? 's' : '')
        };
      });
    return [...days, ...weeks];
  }

  getSpanishOptionText(index: number) {
    return this.pollData ? this.pollData?.es?.options[index].text : '';
  }

  selectEndDate(value: any) {
    this.pollEndDate = value;
    this.submitPoll();
  }
}
