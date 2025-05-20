import { AngularEditorConfig } from '@kolkov/angular-editor';

export class EditorConfig {
  richTextEditor: AngularEditorConfig;

  constructor() {
    this.richTextEditor = {
      editable: true,
      spellcheck: true,
      height: '15rem',
      minHeight: '5rem',
      maxHeight: 'auto',
      translate: 'no',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: 'p',
      defaultFontName: 'Arial',
      defaultFontSize: '',
      sanitize: true,
      outline: true,
      toolbarPosition: 'top',
      toolbarHiddenButtons: [
        ['subscript', 'strikeThrough', 'fontName'],
        [
          'insertImage',
          'insertVideo',
          'toggleEditorMode',
          'fontSize',
          'removeFormat',
          'textColor',
          'backgroundColor'
        ]
      ]
    };
  }

  getConfig() {
    return this.richTextEditor;
  }
}
