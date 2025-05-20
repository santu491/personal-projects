import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { postsModule } from 'src/app/core/defines';
import { EditorConfig } from 'src/app/core/rich-text-editor';
import { emojiFilter } from 'src/app/core/utils';

@Component({
  selector: 'app-post-content',
  templateUrl: './post-content.component.html',
  styleUrls: ['./post-content.component.scss']
})
export class PostContentComponent implements OnInit {
  @Input() postContent!: UntypedFormGroup;
  @Input() invalidField!: {
    title: boolean;
    body: boolean;
  };
  editorConfig: AngularEditorConfig = new EditorConfig().getConfig();
  postsModule = postsModule;
  emoji = false;

  constructor() {}

  ngOnInit(): void {}

  get title() {
    return this.postContent.get('title');
  }
  get body() {
    return this.postContent.get('body');
  }

  onToggleEmoji() {
    this.emoji = !this.emoji;
  }

  onSelectEmoji($event: any, maxLength: number) {
    if (
      (this.postContent.controls['title']?.value + $event.emoji.native)
        ?.length <= maxLength
    ) {
      this.postContent.controls['title'].setValue(
        this.postContent.controls['title']?.value + $event.emoji.native
      );
    }
  }

  getEmojis(e: any) {
    return emojiFilter(e);
  }
}
