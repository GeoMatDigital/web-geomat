import { InjectionToken, Type } from '@angular/core';
import { LoadChildren } from '@angular/router';
import { ErrorHandlerOptions } from '@sentry/angular';

export interface RouteConfig {
  enabled: boolean;
  showOnLandingPage: boolean;
  showInMenu: boolean;
  url: string;
  title: string;
  order: number;
  matIcon?: string;
  svgIcon?: string;
}

export type RouteConfigWithComponent = RouteConfig & { component: Type<any> };

export type RouteConfigFromModule = RouteConfig & {
  moduleImport: LoadChildren;
};

export interface RoutingConfig {
  landing: RouteConfig;
  info: RouteConfig;
  privacy: RouteConfigWithComponent;
  profile: RouteConfigFromModule;
  quiz: RouteConfigFromModule;
  drag: RouteConfigFromModule;
  slideshow: RouteConfigFromModule;
  // custom?: (RouteConfigWithComponent | RouteConfigFromModule)[];
}

export interface SentryConfig {
  errorHandlerOptions?: ErrorHandlerOptions;
  dsn: string;
  environment: string;
  version: { default: { semver: { version: string } } };
}

export interface InternalSolidSkeletonConfig {
  feedbackEnabled: boolean;
  landingBannerContent: Type<any>;
  infoPageContent: Type<any>;
  glossary: {
    enabled: boolean;
    svgIcon?: string;
    matIcon?: string;
  };
  routingConfig: RoutingConfig;
  sentry?: SentryConfig;
}

export interface RequiredExternalConfig {
  landingBannerContent: Type<any>;
  infoPageContent: Type<any>;
  routingConfig: {
    privacy: {
      component: Type<any>;
    };
  };
  sentry?: SentryConfig;
}

type componentPropertyKeys =
  | 'landingBannerContent'
  | 'component'
  | 'infoPageContent';

export type PartialDeep<T> = {
  [P in Exclude<keyof T, componentPropertyKeys>]?: PartialDeep<T[P]>;
};

type Pick<T, K extends keyof T> = {
  [P in K]: Omit<T[P], componentPropertyKeys>;
};
type Exclude<T, U> = T extends U ? never : T;
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

export const defaultSkeletonConfig: Omit<
  InternalSolidSkeletonConfig,
  componentPropertyKeys
> = {
  feedbackEnabled: true,
  glossary: {
    enabled: true,
    matIcon: 'help',
  },
  routingConfig: {
    landing: {
      enabled: true,
      showOnLandingPage: false,
      showInMenu: true,
      url: '',
      title: 'Startseite',
      order: 0,
      matIcon: 'home',
    },
    profile: {
      enabled: true,
      showOnLandingPage: true,
      showInMenu: true,
      url: 'profile',
      title: 'Steckbriefe',
      order: 1,
      matIcon: 'list',
      moduleImport: () =>
        import('@zentrumnawi/solid-profile').then((m) => m.SolidProfileModule),
    },
    quiz: {
      enabled: true,
      showOnLandingPage: true,
      showInMenu: true,
      url: 'quiz',
      title: 'Selbsttest',
      order: 2,
      matIcon: 'question_answer',
      moduleImport: () =>
        import('@zentrumnawi/solid-quiz').then((m) => m.SolidQuizModule),
    },
    drag: {
      enabled: false,
      showOnLandingPage: true,
      showInMenu: true,
      url: 'bac',
      title: 'Drag and drop',
      order: 2,
      matIcon: 'question_answer',
       moduleImport: () =>
         import('@zentrumnawi/solid-quiz').then((m) => m.SolidQuizModule),
    },
    slideshow: {
      enabled: true,
      showOnLandingPage: true,
      showInMenu: true,
      url: 'slideshow',
      title: 'Bestimmungshelfer',
      order: 3,
      matIcon: 'help',
      moduleImport: () =>
        import('@zentrumnawi/solid-slideshow').then(
          (m) => m.SolidSlideshowModule
        ),
    },
    info: {
      enabled: true,
      showOnLandingPage: true,
      showInMenu: true,
      url: 'info',
      title: 'Info',
      order: 4,
      matIcon: 'info',
    },
    privacy: {
      enabled: true,
      showOnLandingPage: true,
      showInMenu: true,
      url: 'privacy',
      title: 'Datenschutzerklärung',
      order: 5,
      matIcon: 'info',
    },
  },
};

export type SolidSkeletonConfig = PartialDeep<InternalSolidSkeletonConfig> &
  RequiredExternalConfig;

export const SOLID_SKELETON_CONFIG = new InjectionToken<
  InternalSolidSkeletonConfig
>('solid-skeleton-config');
