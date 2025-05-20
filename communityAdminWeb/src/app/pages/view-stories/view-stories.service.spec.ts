import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ViewStoriesService } from './view-stories.service';

describe('ViewStoriesService', () => {
  let service: ViewStoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ViewStoriesService]
    });
    service = TestBed.inject(ViewStoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});