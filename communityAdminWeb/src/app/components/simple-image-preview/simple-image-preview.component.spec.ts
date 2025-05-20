import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleImagePreviewComponent } from './simple-image-preview.component';

describe('SimpleImagePreviewComponent', () => {
  let component: SimpleImagePreviewComponent;
  let fixture: ComponentFixture<SimpleImagePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleImagePreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleImagePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
