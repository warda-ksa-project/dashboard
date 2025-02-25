import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieceProductsTableComponent } from './piece-products-table.component';

describe('PieceProductsTableComponent', () => {
  let component: PieceProductsTableComponent;
  let fixture: ComponentFixture<PieceProductsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieceProductsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PieceProductsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
