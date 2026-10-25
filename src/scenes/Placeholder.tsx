import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useScene} from '../SceneContext';
import {C, FONT} from '../theme';

// Penanda sementara untuk adegan yang belum dibuat.
export const Placeholder: React.FC = () => {
  const {scene} = useScene();
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', color: C.muted, fontFamily: FONT.sans, fontSize: 48}}>
      {scene.title}
    </AbsoluteFill>
  );
};
