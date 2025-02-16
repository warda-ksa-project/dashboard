import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelReasonDetailsComponent } from './cancel-reason-details.component';

describe('CancelReasonDetailsComponent', () => {
  let component: CancelReasonDetailsComponent;
  let fixture: ComponentFixture<CancelReasonDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelReasonDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelReasonDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
