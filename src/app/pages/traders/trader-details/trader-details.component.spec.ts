import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraderDetailsComponent } from './trader-details.component';

describe('TraderDetailsComponent', () => {
  let component: TraderDetailsComponent;
  let fixture: ComponentFixture<TraderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TraderDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
