import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderTableComponent } from './slider-table.component';

describe('SliderTableComponent', () => {
  let component: SliderTableComponent;
  let fixture: ComponentFixture<SliderTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SliderTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
