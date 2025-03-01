declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module '*.png' {
  const value: any; // or import { ImageSourcePropType } from 'react-native'; const value: ImageSourcePropType;
  export default value;
}

declare module '*.jpg' {
  const value: any;
  export default value;
}

// Add declarations for other asset types if needed (e.g., *.jpeg, *.gif) 