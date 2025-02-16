import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalSpecialistTableComponent } from './technical-specialist-table.component';

describe('TechnicalSpecialistTableComponent', () => {
  let component: TechnicalSpecialistTableComponent;
  let fixture: ComponentFixture<TechnicalSpecialistTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnicalSpecialistTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicalSpecialistTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
