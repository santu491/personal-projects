import { ComponentFixture, TestBed } from '@angular/core/testing';

import { imports } from 'src/app/tests/app.imports';
import { MeredithArticleComponent } from './meredith-article.component';

describe('MeredithArticleComponent', () => {
  let component: MeredithArticleComponent;
  let fixture: ComponentFixture<MeredithArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [MeredithArticleComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeredithArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
