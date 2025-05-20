import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrModule } from 'ngx-toastr';

import { ExternalLinkComponent } from './external-link.component';

describe('ExternalLinkComponent', () => {
  let component: ExternalLinkComponent;
  let fixture: ComponentFixture<ExternalLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ToastrModule.forRoot()],
      declarations: [ ExternalLinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
