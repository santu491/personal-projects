import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommentDeepLinkData } from 'src/app/core/models/comment';
import { DeepLinkData } from 'src/app/core/models/deepLinks';
import { emojiFilter } from 'src/app/core/utils';

@Component({
  selector: 'app-create-comment',
  templateUrl: './create-comment.component.html',
  styleUrls: ['./create-comment.component.scss']
})
export class CreateCommentComponent implements OnInit {
  @Input() deeplinkLabel!: DeepLinkData;
  @Input() communityList: any = [];
  @Input() existingValue: any;
  @Input() isCommentModalVisible: boolean = false;
  @Input() commentDeepLink!: CommentDeepLinkData;
  @Input() commentTitle: string = 'Add Comment';

  @Output() addComment = new EventEmitter<{ comment: string; deepLink: any }>();
  @Output() toggleCommentModal = new EventEmitter<boolean>();

  commentForm!: FormGroup;
  isEmojiShown = false;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.updateCommentForm();
  }

  updateCommentForm() {
    this.setComment(this.existingValue);
    this.commentForm?.controls?.enableDeepLink.setValue(
      !!this.deeplinkLabel?.en
    );
    if (!!this.deeplinkLabel?.en && this.commentDeepLink) {
      this.commentForm?.controls?.deepLink?.setValue(this.commentDeepLink);
    }
  }

  ngOnChanges() {
    this.updateCommentForm();
  }

  initForm() {
    this.commentForm = this._formBuilder.group({
      comment: ['', Validators.required],
      enableDeepLink: [false],
      deepLink: this._formBuilder.group({
        label: this._formBuilder.group({
          en: [''],
          es: ['']
        }),
        url: [''],
        copyright: [''],
        iconType: [''],
        articleType: ['']
      })
    });
  }

  setComment(value: string) {
    this.commentForm?.controls?.comment?.setValue(value);
  }

  get getComment() {
    return this.commentForm.controls.comment.value;
  }

  onDeepLinkItemSelect(event: any) {
    if (event?.url) {
      this.commentForm.controls.deepLink.setValue({
        label: {
          en: event.label,
          es: event?.label_es || event.label
        },
        url: event.url,
        copyright: event?.copyright ?? '',
        iconType: event?.iconType ?? '',
        articleType: event?.articleType ?? ''
      });
    } else {
      this.commentForm.controls.deepLink.patchValue({
        label: {
          en: event.label,
          es: event?.label_es || event.label
        }
      });
    }
  }

  closeModal() {
    this.isEmojiShown=false
    this.toggleCommentModal.emit(false);
    this.commentForm.controls.deepLink.reset();
    this.commentForm.reset();
  }

  onPressSubmit() {
    this.onAddComment(this.getComment);
  }

  onToggleEmoji() {
    this.isEmojiShown = !this.isEmojiShown;
  }

  onAddComment(value: any) {
    const getDeepLinkData = this.commentForm?.controls?.enableDeepLink?.value
      ? this.commentForm.controls.deepLink.value
      : null;
    this.addComment.emit({
      comment: value,
      deepLink: getDeepLinkData
    });
    this.closeModal();
  }

  onSelectEmoji($event: any) {
    this.setComment(this.getComment + $event.emoji.native);
  }

  getEmojis(e: any) {
    return emojiFilter(e);
  }

  onPressLink() {
    this.commentForm.controls.enableDeepLink.setValue(
      !this.commentForm.controls.enableDeepLink.value
    );
  }

  get getDeepLink() {
    return this.commentForm.controls.deepLink.value;
  }

  get isSubmitButtonDisable() {
    if (!this.getComment) {
      return true;
    }
    if (this.commentForm.controls.enableDeepLink.value) {
      if (!this.getDeepLink?.label?.en) {
        return true;
      }
      return false;
    }
    return false;
  }
}
