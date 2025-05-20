import { ComponentFixture, TestBed } from '@angular/core/testing';

import { imports } from 'src/app/tests/app.imports';
import { HealthwiseArticleComponent } from './healthwise-article.component';

describe('HealthwiseArticleComponent', () => {
  let component: HealthwiseArticleComponent;
  let fixture: ComponentFixture<HealthwiseArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [HealthwiseArticleComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthwiseArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
