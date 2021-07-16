import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from './components/base/base.component';

const routes: Routes = [
  { path: ':view', redirectTo: ':view/' },
  {
    path: ':view/:id',
    component: BaseComponent,
  },
  { path: '', pathMatch: 'full', redirectTo: 'tree/' },
];

export const SolidProfileRoutingModule = RouterModule.forChild(routes);
