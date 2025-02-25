import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraderTableComponent } from './trader-table.component';

describe('TraderTableComponent', () => {
  let component: TraderTableComponent;
  let fixture: ComponentFixture<TraderTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TraderTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraderTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
