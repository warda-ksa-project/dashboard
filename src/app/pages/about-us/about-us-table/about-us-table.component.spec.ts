import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUsTableComponent } from './about-us-table.component';

describe('AboutUsTableComponent', () => {
  let component: AboutUsTableComponent;
  let fixture: ComponentFixture<AboutUsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutUsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutUsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
