import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentWayDetailsComponent } from './payment-way-details.component';

describe('PaymentWayDetailsComponent', () => {
  let component: PaymentWayDetailsComponent;
  let fixture: ComponentFixture<PaymentWayDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentWayDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentWayDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
