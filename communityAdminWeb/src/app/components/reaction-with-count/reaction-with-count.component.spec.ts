import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactionWithCountComponent } from './reaction-with-count.component';

describe('ReactionWithCountComponent', () => {
  let component: ReactionWithCountComponent;
  let fixture: ComponentFixture<ReactionWithCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReactionWithCountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReactionWithCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
