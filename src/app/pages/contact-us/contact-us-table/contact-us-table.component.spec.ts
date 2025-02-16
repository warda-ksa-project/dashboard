import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUsTableComponent } from './contact-us-table.component';

describe('ContactUsTableComponent', () => {
  let component: ContactUsTableComponent;
  let fixture: ComponentFixture<ContactUsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactUsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactUsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
