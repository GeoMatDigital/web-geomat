import { LandingComponent } from './components/landing/landing.component';
import {
  RouteConfigFromModule,
  RouteConfigWithComponent,
  RoutingConfig,
} from './solid-skeleton-config';
import { Route } from '@angular/router';
import { InfoComponent } from './components/info/info.component';

export function generateRoutes(config: RoutingConfig) {
  const routes: Route[] = [];
  const addRoute = (cfg: RouteConfigWithComponent) => {
    routes.push({
      path: cfg.url,
      component: cfg.component,
      data: {
        title: cfg.title,
        showInMenu: cfg.showInMenu,
        showOnLandingPage: cfg.showOnLandingPage,
        icon: cfg.matIcon,
        svgIcon: cfg.svgIcon,
        order: cfg.order,
      },
    });
  };
  const addModuleRoute = (cfg: RouteConfigFromModule) => {
    routes.push({
      path: cfg.url,
      loadChildren: cfg.moduleImport,
      data: {
        title: cfg.title,
        showInMenu: cfg.showInMenu,
        showOnLandingPage: cfg.showOnLandingPage,
        icon: cfg.matIcon,
        svgIcon: cfg.svgIcon,
        order: cfg.order,
      },
    });
  };
  // landing page
  if (config.landing.enabled) {
    addRoute({ ...config.landing, component: LandingComponent });
  }
  if (config.profile.enabled) {
    addModuleRoute(config.profile);
  }
  if (config.quiz.enabled) {
    addModuleRoute(config.quiz);
  }
  if (config.drag.enabled) {
    addModuleRoute(config.drag);
  }
  if (config.slideshow.enabled) {
    addModuleRoute(config.slideshow);
  }
  if (config.info.enabled) {
    addRoute({ ...config.info, component: InfoComponent });
  }
  if (config.privacy.enabled) {
    addRoute(config.privacy);
  }
  // config.custom?.forEach(custom => {
  //   if ((custom as RouteConfigWithComponent).component) {
  //     addRoute(custom as RouteConfigWithComponent, '', '', order++);
  //   } else {
  //     addModuleRoute(custom as RouteConfigFromModule, '', '', order++);
  //   }
  // });
  routes.push({ path: '**', redirectTo: '' });
  return routes.sort((a, b) => a.data?.order - b.data?.order);
}
