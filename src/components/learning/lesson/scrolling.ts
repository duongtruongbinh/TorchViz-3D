export function scrollLearningLabElementIntoView(element: HTMLElement | null) {
  if (!element) return;
  const scrollContainer = element.closest('.learning-lab-scrollbar') as HTMLElement | null;
  if (!scrollContainer) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  const elementBounds = element.getBoundingClientRect();
  const containerBounds = scrollContainer.getBoundingClientRect();
  const targetScrollTop = scrollContainer.scrollTop
    + elementBounds.top
    - containerBounds.top
    - (scrollContainer.clientHeight - elementBounds.height) / 2;

  scrollContainer.scrollTo({
    top: Math.max(targetScrollTop, 0),
    behavior: 'smooth',
  });
}
