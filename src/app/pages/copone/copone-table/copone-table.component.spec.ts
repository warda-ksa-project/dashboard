import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoponeTableComponent } from './copone-table.component';

describe('CoponeTableComponent', () => {
  let component: CoponeTableComponent;
  let fixture: ComponentFixture<CoponeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoponeTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoponeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
