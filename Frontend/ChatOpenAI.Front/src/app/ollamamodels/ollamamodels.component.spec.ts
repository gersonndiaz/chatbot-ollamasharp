import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OllamamodelsComponent } from './ollamamodels.component';

describe('OllamamodelsComponent', () => {
  let component: OllamamodelsComponent;
  let fixture: ComponentFixture<OllamamodelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OllamamodelsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OllamamodelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
