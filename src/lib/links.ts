export enum AppPath {
  Home = '/',
  SignIn = '/auth/sign-in',
  Register = '/auth/register',
  MyTasks = '/my-tasks',
  Settings = '/settings',
  Demo = '/demo',
}

export const headerLinks = {
  rightLinks: [
    {
      text: 'My tasks',
      href: AppPath.MyTasks,
    },
  ],
  leftLinks: [
    {
      text: 'Settings',
      href: AppPath.Settings,
    },
  ],
};
