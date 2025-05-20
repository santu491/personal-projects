import { Component, Input, OnInit } from "@angular/core";
import { UntypedFormGroup, FormGroupDirective } from "@angular/forms";
import { schedulePNModule } from "src/app/core/defines";
import { emojiFilter } from "src/app/core/utils";

@Component({
  selector: "app-pn-title-body",
  templateUrl: "./pn-title-body.component.html",
  styleUrls: ["./pn-title-body.component.scss"],
})
export class PnTitleBodyComponent implements OnInit {
  @Input() titleLabel: string = schedulePNModule.title;
  @Input() bodyLabel: string = schedulePNModule.body;
  @Input() titleControlName: string = "title";
  @Input() bodyControlName: string = "body";
  @Input() formGroupName!: string;
  @Input() isInputReadOnly?: boolean = false;
  public schedulePNModule = schedulePNModule;

  pnTitleEmoji = false;
  pnBodyEmoji = false;

  form!: UntypedFormGroup;

  constructor(private rootFormGroup: FormGroupDirective) {}

  ngOnInit(): void {
    if (this.formGroupName) {
      this.form = this.rootFormGroup.control.get(
        this.formGroupName
      ) as UntypedFormGroup;
    } else {
      this.form = this.rootFormGroup.control;
    }
  }

  get pnTitle() {
    return this.form.get(this.titleControlName);
  }

  get pnBody() {
    return this.form.get(this.bodyControlName);
  }

  onSelectEmoji($event: any, type: "pnTitle" | "pnBody", maxLength: number) {
    if ((this[type]?.value + $event.emoji.native)?.length <= maxLength) {
      this[type]?.patchValue(this[type]?.value + $event.emoji.native);
    }
  }

  onToggleEmoji(type: "pnTitleEmoji" | "pnBodyEmoji") {
    this[type] = !this[type];
  }
  getEmojis(e: any) {
    return emojiFilter(e);
  }
}
