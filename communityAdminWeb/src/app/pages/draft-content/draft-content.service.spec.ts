import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { DraftContentService } from "./draft-content.service";

describe("DraftContentService", () => {
  let service: DraftContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DraftContentService]
    });
    service = TestBed.inject(DraftContentService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
