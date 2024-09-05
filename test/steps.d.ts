/// <reference types='codeceptjs' />
type steps_file = typeof import('./steps_file');
type ArgosCIHelper = import('../src/index');

declare namespace CodeceptJS {
  interface SupportObject { I: I, current: any }
  interface Methods extends Playwright, ArgosCIHelper {}
  interface I extends ReturnType<steps_file>, WithTranslation<Methods> {}
  namespace Translation {
    interface Actions {}
  }
}
