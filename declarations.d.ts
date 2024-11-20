declare module 'react-qr-reader' {
    import * as React from 'react';
  
    interface ReactQRReaderProps {
      delay?: number;
      onScan: (data: any) => void;
      onError: (error: any) => void;
    }
  
    const ReactQRReader: React.FC<ReactQRReaderProps>;
    export default ReactQRReader;
  }
  