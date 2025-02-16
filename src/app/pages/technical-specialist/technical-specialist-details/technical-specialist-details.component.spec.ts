import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalSpecialistDetailsComponent } from './technical-specialist-details.component';

describe('TechnicalSpecialistDetailsComponent', () => {
  let component: TechnicalSpecialistDetailsComponent;
  let fixture: ComponentFixture<TechnicalSpecialistDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnicalSpecialistDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicalSpecialistDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
