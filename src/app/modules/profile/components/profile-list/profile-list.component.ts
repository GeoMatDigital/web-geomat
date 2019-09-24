import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MineralProfile} from "../../state/profile.model";

@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.scss']
})
export class ProfileListComponent {
  @Input() profiles!: MineralProfile[];
  @Output() onProfileSelect = new EventEmitter<number>();

  public trackByFn(index: number, profile: MineralProfile) {
    return profile.id;
  }
}
