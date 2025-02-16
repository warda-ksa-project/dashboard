import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUsDetailsComponent } from './contact-us-details.component';

describe('ContactUsDetailsComponent', () => {
  let component: ContactUsDetailsComponent;
  let fixture: ComponentFixture<ContactUsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactUsDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactUsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
