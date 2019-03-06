import {createSelector} from '@ngrx/store';
import {oc} from 'ts-optchain';
import {AppState} from './app.model';

export const selectRouterUrl = createSelector(
  (state: AppState) => oc(state).router.state.url('/'),
);

export const selectGlossaryEntries = createSelector(
  (state: AppState) => oc(state).glossary({}),
);