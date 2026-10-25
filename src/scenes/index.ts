import type React from 'react';
import {Bond} from './Bond';
import {Commute} from './Commute';
import {CompChem} from './CompChem';
import {Config} from './Config';
import {Eigen} from './Eigen';
import {Expect} from './Expect';
import {Hook} from './Hook';
import {MRI} from './MRI';
import {Measure} from './Measure';
import {Norm} from './Norm';
import {Operator} from './Operator';
import {Outro} from './Outro';
import {Pauli} from './Pauli';
import {QComp} from './QComp';
import {Recap} from './Recap';
import {Roadmap} from './Roadmap';
import {Spectra} from './Spectra';
import {State} from './State';
import {Stationary} from './Stationary';
import {Superpos} from './Superpos';
import {TDSE} from './TDSE';
import {Title} from './Title';

// Pemetaan id scene di naskah → komponen visual.
export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  title: Title,
  roadmap: Roadmap,
  state: State,
  norm: Norm,
  superpos: Superpos,
  operator: Operator,
  eigen: Eigen,
  measure: Measure,
  expect: Expect,
  commute: Commute,
  tdse: TDSE,
  stationary: Stationary,
  pauli: Pauli,
  config: Config,
  bond: Bond,
  spectra: Spectra,
  mri: MRI,
  compchem: CompChem,
  qcomp: QComp,
  recap: Recap,
  outro: Outro,
};
