import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateFormComponent } from './template-form.component';
import { imports } from 'src/app/tests/app.imports';

describe('TemplateFormComponent', () => {
  let component: TemplateFormComponent;
  let fixture: ComponentFixture<TemplateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [TemplateFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateFormComponent);
    component = fixture.componentInstance;
    component.editData = {
      id: 'id',
      name: 'test',
      active: true,
      title: 'test',
      body: 'desc',
      activityText: 'activity',
      deepLink: {
        label: 'deeplink',
        url: 'test',
      },
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
