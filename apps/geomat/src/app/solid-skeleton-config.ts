import { SolidSkeletonConfig } from '@zentrumnawi/solid-skeleton';
import { LandingBannerContentComponent } from './landing-banner-content/landing-banner-content.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { InfoPageContentComponent } from './info-page-content/info-page-content.component';
import { environment } from '../environments/environment';

export const skeletonConfig: SolidSkeletonConfig = {
  landingBannerContent: LandingBannerContentComponent,
  infoPageContent: InfoPageContentComponent,
  routingConfig: {
    landing: {
      svgIcon: 'icon',
    },
    profile: {
      svgIcon: 'profile',
      url: 'steckbriefe',
    },
    quiz: {
      svgIcon: 'quiz',
      url: 'selbsttest',
    },
    slideshow: {
      svgIcon: 'assistant',
      url: 'bestimmungshelfer',
    },
    info: {
      svgIcon: 'info',
    },
    privacy: {
      component: PrivacyComponent,
      svgIcon: 'privacy',
      url: 'datenschutz',
    },
    custom: [
      {
        enabled: false,
        showOnLandingPage: true,
        showInMenu: true,
        url: 'crystalsystem',
        title: 'Kristallsysteme',
        order: 3,
        svgIcon: 'crystalsystem',
        moduleImport: () =>
          import('./crystalsystem/crystalsystem.module').then(
            (m) => m.CrystalsystemModule
          ),
      },
    ],
  },
  sentry: environment.sentry,
};
