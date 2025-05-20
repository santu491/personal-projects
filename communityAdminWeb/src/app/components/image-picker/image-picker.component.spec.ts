import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ImageType } from 'src/app/core/models';
import { ImagePickerComponent } from './image-picker.component';

describe('ImagePickerComponent', () => {
  let component: ImagePickerComponent;
  let fixture: ComponentFixture<ImagePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImagePickerComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagePickerComponent);
    component = fixture.componentInstance;
    component.imageList = [
      {
        title: 'Partner 1',
        image: 'image-logo'
      },
      {
        title: 'Partner 2',
        image: 'image-logo-2'
      }
    ];
    component.imageType = ImageType.ICON;
    fixture.detectChanges();
  });

  it('should trigger radio change', () => {
    let options: DebugElement[] = fixture.debugElement.queryAll(
      By.css('input[type="radio"]')
    );
    options[1].triggerEventHandler('change', {
      target: options[1].nativeElement
    });
    expect(component.imagePicked).toBe('image-logo-2');
  });

  it('should create image picker with regualar image type', () => {
    component.imageType = ImageType.REGULAR;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
