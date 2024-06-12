//config.ts

enum LayoutType {
  MIX = 'mix',
  TOP = 'top',
  SIDE = 'side',
}

const CONFIG = {
  appName: 'Todo',
  helpLink: 'https://github.com/arifszn/reforge',
  enablePWA: true,
  theme: {
    accentColor: '#818cf8',
    sidebarLayout: LayoutType.MIX,
    showBreadcrumb: true,
  },
  metaTags: {
    title: 'Todo',
    description:
      'An out-of-box UI solution for enterprise applications as a React boilerplate.',
    imageURL: 'logo.svg',
  },
};

export default CONFIG;
