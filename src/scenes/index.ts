import type React from 'react';
import {Eigen} from './Eigen';
import {Expect} from './Expect';
import {Hook} from './Hook';
import {Measure} from './Measure';
import {Norm} from './Norm';
import {Operator} from './Operator';
import {Roadmap} from './Roadmap';
import {State} from './State';
import {Superpos} from './Superpos';
import {Title} from './Title';
import {Placeholder} from './Placeholder';

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
  commute: Placeholder,
  tdse: Placeholder,
  stationary: Placeholder,
  pauli: Placeholder,
  config: Placeholder,
  bond: Placeholder,
  spectra: Placeholder,
  mri: Placeholder,
  compchem: Placeholder,
  qcomp: Placeholder,
  recap: Placeholder,
  outro: Placeholder,
};
