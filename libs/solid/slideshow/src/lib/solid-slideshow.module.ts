import { NgModule } from '@angular/core';
import { SolidCoreModule } from '@zentrumnawi/solid/core';
import { SlideshowComponent } from './components/slideshow/slideshow.component';
import { SolidSlideshowRoutingModule } from './solid-slideshow-routing.module';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NgxsModule } from '@ngxs/store';
import { SlideshowState } from './state/slideshow.state';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

@NgModule({
  declarations: [
    SlideshowComponent
  ],
  imports: [
    SolidCoreModule,
    SolidSlideshowRoutingModule,
    NgxsModule.forFeature([SlideshowState]),
    MatStepperModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    }
  ]
})
export class SolidSlideshowModule {
}
