import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostContentComponent } from './post-content.component';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

describe('PostContentComponent', () => {
  let component: PostContentComponent;
  let fixture: ComponentFixture<PostContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostContentComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostContentComponent);
    component = fixture.componentInstance;
    component.postContent = new UntypedFormGroup({
      title: new UntypedFormControl('TEST'),
      body: new UntypedFormControl('BODY TEXT')
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
