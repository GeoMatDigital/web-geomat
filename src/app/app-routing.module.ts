import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InfoComponent} from './components/info/info.component';
import {PrivacyComponent} from './components/privacy/privacy.component';

const routes: Routes = [
  {path: 'info', component: InfoComponent, data: {title: 'Informationen'}},
  {path: 'privacy', component: PrivacyComponent, data: {title: 'Datenschutzerklärung'}},
  {
    path: 'determination',
    loadChildren: './modules/determinationhelper/determinationhelper.module#DeterminationHelperModule',
  }, {
    path: 'profile',
    loadChildren: './modules/profile/profile.module#ProfileModule',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
