import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSmallScreenComponent } from './table-small-screen.component';

describe('TableSmallScreenComponent', () => {
  let component: TableSmallScreenComponent;
  let fixture: ComponentFixture<TableSmallScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableSmallScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableSmallScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
