import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { Profile, TreeNode } from '../../state/profile.model';
import { ProfileState } from '../../state/profile.state';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import {
  ProfileProperty,
  ProfilePropertyType,
} from '../../state/profile-definition.model';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'solid-profile-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent {
  @ViewChild('expansion', { static: false, read: MatAccordion })
  expansion?: MatAccordion;
  @ViewChild('thumbnails') thumbnails: ElementRef | undefined;
  public PropertyTypes = ProfilePropertyType;
  @Select(ProfileState.selectDefinition) $ProfileDefinition!: Observable<
    ProfileProperty[]
  >;
  @Input() public node!: TreeNode;
  public ImageLoaded = [false];
  public ImageSelected = 0;
  public ImageStartIndex = 0;
  public ImageEndIndex = 0;
  SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };

  private _profile!: Profile;

  public get profile() {
    return this._profile;
  }

  @Input()
  public set profile(profile: Profile) {
    this._profile = profile;
    this.ImageLoaded = profile.images.map((_) => false);
    this.onImageSelect(0);
    this.expansion?._headers.forEach((panel) => panel?.panel.close());
  }

  public onImageLoaded(index: number) {
    this.ImageLoaded[index] = true;
  }

  public onImageSelect(index: number) {
    this.ImageSelected = index;
    if (index < 3) {
      this.ImageStartIndex = 0;
      this.ImageEndIndex = index + 3 + (3 - index);
    } else if (index > this.profile.images.length - 4) {
      this.ImageEndIndex = this.profile.images.length - 1;
      this.ImageStartIndex =
        index - 3 - (3 - (this.profile.images.length - index - 1));
    } else {
      this.ImageStartIndex = index - 3;
      this.ImageEndIndex = index + 3;
    }
  }

  public shouldDisplayProperty(property: ProfileProperty, profile_obj: any) {
    if (property.required) {
      return true;
    }
    const val =
      profile_obj !== null &&
      profile_obj !== undefined &&
      property.key in profile_obj
        ? profile_obj[property.key]
        : undefined;
    switch (property.type) {
      case ProfilePropertyType.List:
        return Array.isArray(val) && val.length > 0;
      case ProfilePropertyType.Group:
      case ProfilePropertyType.String:
      case ProfilePropertyType.Integer:
      case ProfilePropertyType.Boolean:
        return val !== undefined && val !== '';
    }
  }

  public swipe(currentIndex: number, action: string = this.SWIPE_ACTION.RIGHT) {
    if (currentIndex > this.profile.images.length || currentIndex < 0) {
      return;
    }
    if (action === this.SWIPE_ACTION.LEFT) {
      const isLast = currentIndex === this.profile.images.length - 1;
      this.ImageSelected = isLast ? 0 : currentIndex + 1;
    }
    if (action === this.SWIPE_ACTION.RIGHT) {
      const isFirst = currentIndex === 0;
      this.ImageSelected = isFirst
        ? this.profile.images.length - 1
        : currentIndex - 1;
    }
    this.thumbnails?.nativeElement.children[this.ImageSelected].scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }
}
