import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TvDetailsPage } from './tv-details.page';

describe('TvDetailsPage', () => {
  let component: TvDetailsPage;
  let fixture: ComponentFixture<TvDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TvDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
