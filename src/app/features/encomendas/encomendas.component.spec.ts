import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncomendaComponent } from './encomendas.component';

describe('EncomendaComponent', () => {
  let component: EncomendaComponent;
  let fixture: ComponentFixture<EncomendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncomendaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EncomendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
