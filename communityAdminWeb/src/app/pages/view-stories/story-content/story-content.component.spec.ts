import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrModule } from 'ngx-toastr';

import { StoryContentComponent } from './story-content.component';

describe('StoryContentComponent', () => {
  let component: StoryContentComponent;
  let fixture: ComponentFixture<StoryContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ToastrModule.forRoot()],
      declarations: [ StoryContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
