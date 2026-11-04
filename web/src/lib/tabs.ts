/** Tiny cross-component bus so nav items and hero chips can switch the talent tabs. */
export const TAB_EVENT = 'eafrica:select-tab';
export function selectTab(id: string) {
  window.dispatchEvent(new CustomEvent(TAB_EVENT, { detail: id }));
}
