import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveUserBoardComponent } from './active-user-board.component';

describe('ActiveUserBoardComponent', () => {
  let component: ActiveUserBoardComponent;
  let fixture: ComponentFixture<ActiveUserBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveUserBoardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveUserBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
