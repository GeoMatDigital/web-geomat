import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingBannerContentComponent } from './landing-banner-content.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SOLID_SKELETON_HACKY_INJECTION } from '@zentrumnawi/solid-skeleton';

describe('LandingBannerContentComponent', () => {
  let component: LandingBannerContentComponent;
  let fixture: ComponentFixture<LandingBannerContentComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LandingBannerContentComponent],
      imports: [MatCardModule, MatButtonModule, MatIconModule],
      providers: [
        {
          provide: SOLID_SKELETON_HACKY_INJECTION,
          useValue: () => {},
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingBannerContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
