import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStatusTableComponent } from './order-status-table.component';

describe('OrderStatusTableComponent', () => {
  let component: OrderStatusTableComponent;
  let fixture: ComponentFixture<OrderStatusTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderStatusTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderStatusTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
