import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieceProductsDetailsComponent } from './piece-products-details.component';

describe('PieceProductsDetailsComponent', () => {
  let component: PieceProductsDetailsComponent;
  let fixture: ComponentFixture<PieceProductsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PieceProductsDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PieceProductsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
