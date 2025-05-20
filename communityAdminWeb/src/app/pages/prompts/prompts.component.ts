import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { generic, Language, messages } from "src/app/core/constants";
import { DBPrompt, Prompt } from "src/app/core/models/prompts";
import { PromptsService } from "./prompts.service";

@Component({
  selector: "app-prompts",
  templateUrl: "./prompts.component.html",
  styleUrls: ["./prompts.component.scss"],
})
export class PromptsComponent implements OnInit {
  promptData: Prompt[] = [];
  editData: Prompt | undefined;
  showAddForm = false;
  communityId: string | null = null;
  title: string | null = null;
  allDeleted = false;
  constructor(
    private _activeRoute: ActivatedRoute,
    private _router: Router,
    private _toastr: ToastrService,
    private _promptSvc: PromptsService
  ) {}

  ngOnInit(): void {
    this.communityId = this._activeRoute.snapshot.paramMap.get("communityId");
    this.title = this._activeRoute.snapshot.paramMap.get("title");
    if (this.communityId === null) {
      this.backToCommunity(generic.selectCommunity);
    } else {
      this.title = this.title == null ? "" : this.title;
      this.loadPrompts(this.communityId);
    }
  }

  backToCommunity(message: string) {
    this._router.navigate(["/ui/pages/admin/community"]);
    this._toastr.error(message);
  }

  loadPrompts(communityId: string) {
    this._promptSvc.getCommunityPrompts(communityId).subscribe(
      (result: any) => {
        if (result.data.isSuccess) {
          if (result.data.value.length < 1) {
            this._toastr.info(messages.noPrompts);
            return;
          }
          const prompts = result.data.value;
          const enPrompts = prompts.filter((data: any) => {
            return data.language === Language.ENGLISH;
          });
          const esPrompts = prompts.filter((data: any) => {
            return data.language === Language.SPANISH;
          });
          this.setPromptData(
            enPrompts[0].data[0].prompts,
            esPrompts[0].data[0].prompts
          );
        }
      },
      (error: any) => {
        console.error(error);
        this.backToCommunity(generic.pleaseTryAgain);
      }
    );
  }

  setPromptData(enPrompts: DBPrompt[], esPrompts: DBPrompt[]) {
    enPrompts.forEach((enPrompt: DBPrompt) => {
      const prompt: Prompt = {
        promptId: enPrompt.promptId,
        en: {
          question: enPrompt.question,
          helpText: enPrompt.helpText,
          sectionTitle: enPrompt.sectionTitle,
          sensitiveContentText: enPrompt.sensitiveContentText,
        },
        es: {
          question: "",
          helpText: "",
          sectionTitle: "",
          sensitiveContentText: "",
        },
      };
      if (enPrompt?.options) {
        prompt.en.options = enPrompt.options;
      }
      const index = esPrompts.findIndex((esPrompt: DBPrompt) => {
        return esPrompt.promptId === enPrompt.promptId;
      });
      if (index > -1) {
        prompt.es.question = esPrompts[index].question;
        prompt.es.helpText = esPrompts[index].helpText;
        prompt.es.sectionTitle = esPrompts[index].sectionTitle;
        prompt.es.sensitiveContentText = esPrompts[index].sensitiveContentText;

        if (esPrompts[index]?.options) {
          prompt.es.options = esPrompts[index].options;
        }
      }
      this.promptData.push(prompt);
    });
  }

  onPromptAdd(prompt: Prompt) {
    const selectedPrompt = this.promptData.findIndex(
      (p: Prompt) => p?.promptId == prompt?.promptId
    );
    if (selectedPrompt < 0) {
      this.promptData.push(prompt);
      this._toastr.success(messages.addedToPrompts);
    } else {
      this.promptData[selectedPrompt] = prompt;
    }

    this.showAddForm = false;
  }

  removePromptForm() {
    this.showAddForm = false;
  }

  addNewForm() {
    this.editData = undefined;
    this.showAddForm = true;
  }

  onDeletePrompt(id: string) {
    const index = this.promptData.findIndex((p) => p.promptId == id);
    this.editData = undefined;
    this.promptData.splice(index, 1);
    if (this.promptData.length == 0) {
      this.allDeleted = true;
    }
    this._toastr.success(messages.removedFromPrompts);
  }

  onEditClick(prompt: Prompt) {
    this.editData = prompt;
    this.showAddForm = true;
  }

  createPrompts() {
    this._promptSvc
      .setCommunityPrompts(this.promptData, this.communityId)
      ?.subscribe((result: any) => {
        if (result.data.isSuccess) {
          this._toastr.success(messages.promptsPublished);
          this._router.navigate(['/ui/pages/admin/community']);
        }
      });
  }

  drop(event: CdkDragDrop<Prompt[]>) {
    moveItemInArray(this.promptData, event.previousIndex, event.currentIndex);
  }
}
