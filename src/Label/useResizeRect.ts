import { useLayoutEffect, useState, useMemo, useRef } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
// https://developer.mozilla.org/zh-CN/docs/Web/API/ResizeObserver

declare const RectAttrTypes: [
  'x',
  'y',
  'left',
  'right',
  'top',
  'bottom',
  'width',
  'height',
];
export type RectAttrType = typeof RectAttrTypes[number];
export type EleRect = Pick<DOMRectReadOnly, RectAttrType>;

const initialState: EleRect = {
  x: 0,
  y: 0,
  top: 0,
  left: 0,
  right: 0,
  width: 0,
  bottom: 0,
  height: 0,
};

const useResizeRect = <T extends HTMLElement>() => {
  const domRef = useRef<T | null>(null);
  const [rect, setRect] = useState<EleRect>(initialState);

  const observer = useMemo(() => {
    return new ResizeObserver((entries: any) => {
      if (entries[0]) {
        setRect(entries[0].contentRect as EleRect);
      }
    });
  }, [domRef]);

  useLayoutEffect(() => {
    if (domRef.current instanceof HTMLElement) {
      observer?.observe?.(domRef.current);
    }

    return () => {
      observer?.disconnect?.();
    };
  }, [domRef, observer]);

  return [domRef, rect] as const;
};

export default useResizeRect;
