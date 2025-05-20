import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgControl } from '@angular/forms';
import { imports } from 'src/app/tests/app.imports';

import { AddArticleComponent } from './add-article.component';

describe('AddArticleComponent', () => {
  let component: AddArticleComponent;
  let fixture: ComponentFixture<AddArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [ AddArticleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
