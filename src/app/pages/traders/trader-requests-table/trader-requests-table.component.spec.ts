import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraderRequestsTableComponent } from './trader-requests-table.component';

describe('TraderRequestsTableComponent', () => {
  let component: TraderRequestsTableComponent;
  let fixture: ComponentFixture<TraderRequestsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TraderRequestsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraderRequestsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
