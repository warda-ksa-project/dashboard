import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraderRequestsDetailsComponent } from './trader-requests-details.component';

describe('TraderRequestsDetailsComponent', () => {
  let component: TraderRequestsDetailsComponent;
  let fixture: ComponentFixture<TraderRequestsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TraderRequestsDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraderRequestsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
