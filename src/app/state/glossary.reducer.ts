import {Action, createReducer, Store} from 'ngrx-actions/dist';
import {GlossaryEntriesOrdered, glossaryInitialState} from './glossary-entry.model';
import {GlossarySetAction} from './glossary.actions';

@Store(glossaryInitialState)
export class GlossaryStore {
  @Action(GlossarySetAction)
  set(state: GlossaryEntriesOrdered, action: GlossarySetAction) {
    Object.assign(state, action.entries);
  }
}

export const glossaryReducer = createReducer(GlossaryStore);