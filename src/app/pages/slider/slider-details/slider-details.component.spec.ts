import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderDetailsComponent } from './slider-details.component';

describe('SliderDetailsComponent', () => {
  let component: SliderDetailsComponent;
  let fixture: ComponentFixture<SliderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SliderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
