import {ImageFiles} from '../../../shared/models';
import {AppState} from '../../../state/app.model';

export type ProfileAppState = AppState & { profile: ProfileState };

export interface ProfileState {
  profile: Profile[];
  nonTreeProfiles: MineralProfile[];
}

export const profileInitialState = {
  profile: [] as Profile[],
  nonTreeProfiles: [] as MineralProfile[],
};

export type Profile = ProfileCategory | MineralProfile;

export interface ProfileCategory {
  type: 'category';
  title: string;
  description: string | null;
  children: Profile[];
}

export interface MineralProfile {
  type: 'mineral';
  id: number;
  variety: string;
  name: string;
  imageFiles: ImageFiles;
  chemicalFormula: string;
  mohsScale: string;
  cleavage: { cleavage: string, coordinates: string }[]
  density: string;
  streak: string;
  color: string;
  crystalSystems: CrystalSystem[];
  fractures: string[];
  lustres: string[];
}

export interface NodeApi {
  node_name: string;
  leaf_nodes: NodeApi[];
  info_text: string;
  image: ImageFiles | null;
  mineraltypes: MineralProfileApi[];
}

export interface MineralProfileApi {
  id: number;
  trivial_name: string;
  image_file: ImageFiles | null;
  chemical_formula: string;
  variety: string;
  mohs_scale: string;
  cleavage: { cleavage: string, coordinates: string }[]
  density: string;
  streak: string;
  crystal_system: CrystalSystemApi[];
  normal_color: string;
  fracture: string[];
  lustre: string[];
}

export interface CrystalSystem {
  name: string;
}

export interface CrystalSystemApi {
  id: number;
  crystal_system: string;
  mineral_type: number;
  temperature: number | null;
  pressure: number | null;
}
