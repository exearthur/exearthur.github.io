import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { features } from '../config/site';
import { useInView } from '../hooks/useInView';
import { cx } from '../lib/cx';

type RevealProps<T extends ElementType> = {
  /** Element to render. Defaults to a div. */
  as?: T;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className'>;

/**
 * Fades its element in and up the first time it scrolls into view. The
 * motion itself is CSS (`.reveal` / `.is-in` in style.css); this only decides
 * when. Put `stagger` on a parent to cascade several of these in order.
 */
export function Reveal<T extends ElementType = 'div'>({
  as,
  className,
  ...rest
}: RevealProps<T>) {
  const Tag: ElementType = as ?? 'div';
  const [ref, inView] = useInView<Element>({
    once: true,
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.05,
  });
  const shown = inView || !features.scrollReveal;

  return <Tag ref={ref} className={cx('reveal', className, shown && 'is-in')} {...rest} />;
}
