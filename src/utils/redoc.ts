import { RedocOptions } from 'redoc';

export const redocOptions: RedocOptions = {
  title: 'Mahayojana API Documentation',
  theme: {
    colors: {
      primary: {
        main: '#32329f',
        light: '#4b4bc4',
        dark: '#1e1e5f',
      },
      success: {
        main: '#1eb952',
        light: '#4cd97b',
        dark: '#158a3c',
      },
      warning: {
        main: '#f49b20',
        light: '#f7b04d',
        dark: '#b87417',
      },
      error: {
        main: '#e53935',
        light: '#eb6a67',
        dark: '#ab2a27',
      },
      gray: {
        50: '#fafafa',
        100: '#f5f5f5',
      },
    },
    typography: {
      fontSize: '16px',
      fontFamily:
        'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif',
      headings: {
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif',
        fontWeight: '600',
      },
      code: {
        fontSize: '14px',
        fontFamily: 'Source Code Pro, monospace',
        lineHeight: '1.4em',
        fontWeight: '400',
      },
    },
    sidebar: {
      width: '300px',
      backgroundColor: '#fafafa',
      textColor: '#333333',
    },
    rightPanel: {
      backgroundColor: '#263238',
      textColor: '#ffffff',
    },
    schema: {
      nestedBackground: '#fafafa',
      typeNameColor: '#32329f',
      typeTitleColor: '#333333',
    },
  },
  expandDefaultServerVariables: true,
  expandResponses: '200,201',
  jsonSampleExpandLevel: 3,
  hideDownloadButton: false,
  hideHostname: true,
  hideLoading: false,
  hideSchemaPattern: false,
  hideSingleRequestSampleTab: false,
  menuToggle: true,
  minCharacterLength: 3,
  nativeScrollbars: false,
  noAutoAuth: false,
  onlyRequiredInSamples: false,
  pathInMiddlePanel: false,
  requiredPropsFirst: true,
  scrollYOffset: 0,
  showExtensions: false,
  sortEnumValuesAlphabetically: false,
  sortOperationsAlphabetically: false,
  sortPropsAlphabetically: false,
  suppressWarnings: false,
  simpleOneOfTypeLabel: false,
  payloadSampleIdx: 0,
  untrustedSpec: false,
  disableSearch: false,
};
