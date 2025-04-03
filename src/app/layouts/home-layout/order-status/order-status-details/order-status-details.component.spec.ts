import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStatusDetailsComponent } from './order-status-details.component';

describe('OrderStatusDetailsComponent', () => {
  let component: OrderStatusDetailsComponent;
  let fixture: ComponentFixture<OrderStatusDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderStatusDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderStatusDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
