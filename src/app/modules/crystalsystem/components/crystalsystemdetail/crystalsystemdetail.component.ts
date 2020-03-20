import {Component, ElementRef, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {environment} from "../../../../../environments/environment";
import {configurations} from "./crystalsystemdetail-configuration";

type Models = 'cubic' | 'hexagonal' | 'monoclinic' | 'orthorhombic' | 'trigonal' | 'tetragonal' | 'triclinic';

interface CrystalsystemIFrameWindowProxy {
  toggleFaces?: () => void;
  togglePoints?: () => void;
  togglePerspective?: () => void;
  toggleAxis?: () => void;
  toggleHighlight?: (layerNumber: number) => void;
  switchModel?: (modelName: string) => void;
}

@Component({
  selector: 'app-crystalsystemdetail',
  templateUrl: './crystalsystemdetail.component.html',
  styleUrls: ['./crystalsystemdetail.component.scss']
})
export class CrystalsystemdetailComponent {
  @ViewChild('iframe') public iFrame: ElementRef<HTMLIFrameElement> | null = null;
  public Configs = configurations;
  public SelectedConfig = configurations[0];
  public Layer = configurations[0].layers.length > 0 ? configurations[0].layers[0].name : 0;
  public ShowInPreview = environment.preview;
  public Model = this.SelectedConfig.name;

  public get contentWindow(): CrystalsystemIFrameWindowProxy | null {
    if (this.iFrame && this.iFrame.nativeElement.contentWindow) {
      this.iFrame.nativeElement.contentWindow;
    }
    return null;
  }

  constructor(private _dialog: MatDialog) {
  }

  public onToggleSolidClick() {
    const cw = this.contentWindow;
    if (cw && cw.toggleFaces) {
      cw.toggleFaces();
    }
  }

  public onTogglePointsClick() {
    const cw = this.contentWindow;
    if (cw && cw.togglePoints) {
      cw.togglePoints();
    }
  }

  public onTogglePerspectiveClick() {
    const cw = this.contentWindow;
    if (cw && cw.togglePerspective) {
      cw.togglePerspective();
    }
  }

  public onToggleAxisClick() {
    const cw = this.contentWindow;
    if (cw && cw.toggleAxis) {
      cw.toggleAxis();
    }
  }

  public onLayerSelectChange(newLayer: number) {
    const cw = this.contentWindow;
    if (cw && cw.toggleHighlight) {
      this.Layer = newLayer;
      cw.toggleHighlight(newLayer);
    }
  }

  public onModelSelectChange(newModel: Models) {
    const cw = this.contentWindow;
    if (cw && cw.switchModel && cw.toggleHighlight) {
      this.SelectedConfig = this.Configs.find(c => c.name === newModel)!;
      this.Model = this.SelectedConfig.name;
      this.Layer = this.SelectedConfig.layers.length > 0 ? this.SelectedConfig.layers[0].name : 0;
      cw.switchModel(newModel);
      cw.toggleHighlight(this.Layer);
    }
  }

  onInfoClick() {
    // this._dialog.open(InfoOverlayComponent, {
    //   data: {
    //     title: this.ModelNames[this.Model],
    //     text: this.Descriptions[this.Model]
    //   }
    // });
  }
}
