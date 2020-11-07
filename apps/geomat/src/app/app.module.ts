import {
  BrowserModule,
  DomSanitizer,
  HAMMER_GESTURE_CONFIG,
  HammerGestureConfig,
} from '@angular/platform-browser';
import { ErrorHandler, Injectable, NgModule } from '@angular/core';

import { SolidSkeletonModule } from '@zentrumnawi/solid-skeleton';
import { environment } from '../environments/environment';
import { SolidCoreModule } from '@zentrumnawi/solid-core';
import { AppComponent } from './app.component';
import { NgxsModule } from '@ngxs/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PrivacyComponent } from './privacy/privacy.component';
import { RouterModule } from '@angular/router';
import { NgxsDispatchPluginModule } from '@ngxs-labs/dispatch-decorator';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { LandingComponent } from './landing/landing.component';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { ServiceWorkerModule } from '@angular/service-worker';
import { coreConfig } from './solid-core-config';
import { skeletonConfig } from './solid-skeleton-config';
import { LandingBannerContentComponent } from './landing-banner-content/landing-banner-content.component';
import { InfoPageContentComponent } from './info-page-content/info-page-content.component';
import { CdkDragDropSortingExampleComponent } from './components/cdk-drag-drop-sorting-example/cdk-drag-drop-sorting-example.component';

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  overrides = {
    pan: {
      direction: 6,
    },
    pinch: { enable: false },
    rotate: { enable: false },
  };
}

@NgModule({
  declarations: [
    AppComponent,
    PrivacyComponent,
    LandingComponent,
    LandingBannerContentComponent,
    InfoPageContentComponent,
    CdkDragDropSortingExampleComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgxsModule.forRoot([], {
      developmentMode: !environment.production,
    }),
    NgxsDispatchPluginModule.forRoot(),
    NgxsRouterPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: environment.production,
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    SolidCoreModule.forRoot(coreConfig),
    SolidSkeletonModule.forRoot(skeletonConfig),
    RouterModule.forRoot([], { onSameUrlNavigation: 'reload' }),
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatListModule,
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(registry: MatIconRegistry, url: DomSanitizer) {
    const addIcon = (name: string) =>
      registry.addSvgIcon(
        name,
        url.bypassSecurityTrustResourceUrl(`assets/svg/${name}.svg`)
      );
    addIcon('icon');
    addIcon('assistant');
    addIcon('privacy');
    addIcon('crystalsystem');
    addIcon('profile');
    addIcon('quiz');
    addIcon('info');
    addIcon('info2');
  }
}
