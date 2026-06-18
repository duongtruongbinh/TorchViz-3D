import { ReactThreeFiber } from '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      instancedMesh: any;
      meshPhysicalMaterial: any;
      meshBasicMaterial: any;
      lineBasicMaterial: any;
      boxGeometry: any;
      planeGeometry: any;
      ringGeometry: any;
      sphereGeometry: any;
      ambientLight: any;
      directionalLight: any;
      gridHelper: any;
      circleGeometry: any;
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      instancedMesh: any;
      meshPhysicalMaterial: any;
      meshBasicMaterial: any;
      lineBasicMaterial: any;
      boxGeometry: any;
      planeGeometry: any;
      ringGeometry: any;
      sphereGeometry: any;
      ambientLight: any;
      directionalLight: any;
      gridHelper: any;
      circleGeometry: any;
    }
  }
}
