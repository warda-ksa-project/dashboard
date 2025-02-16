import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictTableComponent } from './district-table.component';

describe('DistrictTableComponent', () => {
  let component: DistrictTableComponent;
  let fixture: ComponentFixture<DistrictTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistrictTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistrictTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
