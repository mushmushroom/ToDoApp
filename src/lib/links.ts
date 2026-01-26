export enum AppPath {
  Home = '/',
  SignIn = '/auth/sign-in',
  Register = '/auth/register',
  VerifyEmail = '/auth/verify-email',
  MyTasks = '/my-tasks',
  MyCategories = '/categories',
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
