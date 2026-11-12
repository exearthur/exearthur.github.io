import { Fragment, type ReactNode } from 'react';

/** Inline items joined by a middle dot: "Live · September 2026". Skips empty items. */
export function Separated({ items }: { items: ReactNode[] }) {
  const shown = items.filter((item) => item !== null && item !== undefined && item !== false);
  return shown.map((item, index) => (
    <Fragment key={index}>
      {index > 0 && (
        <>
          {' '}
          <span className="meta-sep" aria-hidden="true">
            ·
          </span>{' '}
        </>
      )}
      {item}
    </Fragment>
  ));
}
