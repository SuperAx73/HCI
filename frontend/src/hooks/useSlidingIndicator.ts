import { useLayoutEffect, useRef, type RefObject } from 'react';

/**
 * Measures the active element (matched by `activeSelector`) inside `containerRef` and writes its
 * position/size as CSS custom properties, so a sibling `.pill-indicator` can slide/resize to match
 * it with a CSS transition instead of jumping between options.
 */
export function useSlidingIndicator(containerRef: RefObject<HTMLElement | null>, activeSelector: string, deps: unknown[]) {
  const hasPositioned = useRef(false);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const active = container.querySelector<HTMLElement>(activeSelector);
    if (!active) {
      container.style.setProperty('--indicator-opacity', '0');
      return;
    }
    container.style.setProperty('--indicator-opacity', '1');
    container.style.setProperty('--indicator-x', `${active.offsetLeft}px`);
    container.style.setProperty('--indicator-w', `${active.offsetWidth}px`);

    if (!hasPositioned.current) {
      // First time this bar gets an active item (e.g. extra nav links appearing once auth/role
      // data resolves): snap straight there instead of sliding in from a stale 0-width position,
      // which otherwise reads as the whole bar "shaking" while nav items are still reflowing in.
      container.setAttribute('data-indicator-instant', 'true');
      void container.offsetHeight;
      requestAnimationFrame(() => container.removeAttribute('data-indicator-instant'));
      hasPositioned.current = true;
    }

    function onResize() {
      if (!active) return;
      container!.style.setProperty('--indicator-x', `${active.offsetLeft}px`);
      container!.style.setProperty('--indicator-w', `${active.offsetWidth}px`);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
