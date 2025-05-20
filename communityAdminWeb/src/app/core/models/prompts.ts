export interface OptionData {
  id: string;
  title: string;
  type: string;
}

export interface PromptData {
  question: string;
  helpText?: string;
  sectionTitle?: string;
  sensitiveContentText?: string;
  options?: OptionData[];
}

export interface Prompt {
  promptId: string | undefined;
  en: PromptData;
  es: PromptData;
}

export interface DBPrompt extends PromptData {
  promptId: string;
}

export class OptionFormData {
  en!: string;
  es!: string;
  isEdit!: boolean;
  id?: string;

  constructor() {
    this.isEdit = false;
  }
}
