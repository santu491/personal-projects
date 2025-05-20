import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DownloadPrintService } from 'src/app/core/services/download-print.service';
import { imports } from 'src/app/tests/app.imports';
import { MetricsPnComponent } from './metrics-pn.component';

describe('MetricsPnComponent', () => {
  let component: MetricsPnComponent;
  let fixture: ComponentFixture<MetricsPnComponent>;

  beforeEach(async () => {
    const downloadService = jasmine.createSpyObj('DownloadPrintService', [
      'downloadPdf'
    ]);
    await TestBed.configureTestingModule({
      imports: imports,
      declarations: [MetricsPnComponent],
      providers: [
        {
          provide: DownloadPrintService,
          useValue: downloadService
        }
      ]
    }).compileComponents();
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(MetricsPnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
