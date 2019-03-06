import {Component} from '@angular/core';

@Component({
  selector: 'app-determination-helper',
  templateUrl: './determination-helper.component.html',
  styleUrls: ['./determination-helper.component.scss'],
})
export class DeterminationHelperComponent {
  public MaxStep = 0;

  public onNextStepClick(stepId: number) {
    if (this.MaxStep < stepId) {
      this.MaxStep = stepId;
    }
  }

  public showGlossaryEntry($event: MouseEvent, glossaryId: string) {
    // TODO: this method should navigate to the glossary entry
  }
}