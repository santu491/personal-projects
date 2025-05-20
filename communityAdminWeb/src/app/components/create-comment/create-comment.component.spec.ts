import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCommentComponent } from './create-comment.component';
import { imports } from 'src/app/tests/app.imports';

describe('CreateCommentComponent', () => {
  let component: CreateCommentComponent;
  let fixture: ComponentFixture<CreateCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCommentComponent ],
      imports: imports
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal', async () => {
    component.closeModal();
  });
});
