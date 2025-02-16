import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractTypeTableComponent } from './contract-type-table.component';

describe('ContractTypeTableComponent', () => {
  let component: ContractTypeTableComponent;
  let fixture: ComponentFixture<ContractTypeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractTypeTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractTypeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
