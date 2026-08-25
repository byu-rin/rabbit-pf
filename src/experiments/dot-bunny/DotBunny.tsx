// ============================================================================
//  DOT-BUNNY — standalone binary-pixel-generation animation
// ============================================================================
//  Renders exactly 1,000 discrete 1x1 bitmap pixels, one every 100ms, that
//  progressively encode a Playboy-style bunny-head silhouette.
//
//  This file is fully isolated: it imports only its own data module and mounts
//  from its own HTML entry (dot-bunny.html). It touches nothing in the site.
// ============================================================================

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BUNNY,
  BACKGROUND,
  BLACK,
  WHITE,
  INTERVAL_MS,
  TOTAL_DOTS,
} from './bunnyData';

// Display magnification. Each logical 1x1 dot is painted as a crisp
// PIXEL_SCALE x PIXEL_SCALE square at integer coordinates (no CSS scaling,
// no transforms, no anti-aliasing) so it stays a hard-edged binary pixel while
// remaining comfortably visible. Set to 1 for a literal 1px-per-dot bitmap.
const PIXEL_SCALE = 8;

type RunState = 'idle' | 'running' | 'paused' | 'done';

export default function DotBunny() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [runState, setRunState] = useState<RunState>('idle');
  const [shown, setShown] = useState(0);

  // animation bookkeeping (refs so the rAF loop never goes stale)
  const rafRef = useRef<number | null>(null);
  const startTsRef = useRef<number>(0);   // performance.now() at (re)start
  const elapsedRef = useRef<number>(0);   // ms accumulated across pauses
  const drawnRef = useRef<number>(0);     // how many dots are painted on canvas

  const cw = BUNNY.width * PIXEL_SCALE;
  const ch = BUNNY.height * PIXEL_SCALE;

  // --- painting -------------------------------------------------------------
  const clearCanvas = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, 0, cw, ch);
    drawnRef.current = 0;
  }, [cw, ch]);

  // Paint dots so that exactly `count` are visible. Incremental when growing;
  // full repaint when shrinking (reset).
  const paintTo = useCallback((count: number) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    if (count < drawnRef.current) {
      ctx.fillStyle = BACKGROUND;
      ctx.fillRect(0, 0, cw, ch);
      drawnRef.current = 0;
    }

    for (let i = drawnRef.current; i < count; i++) {
      const d = BUNNY.dots[i];
      ctx.fillStyle = d.state === 1 ? WHITE : BLACK;
      ctx.fillRect(d.x * PIXEL_SCALE, d.y * PIXEL_SCALE, PIXEL_SCALE, PIXEL_SCALE);
    }
    drawnRef.current = count;
  }, [cw, ch]);

  // --- animation loop -------------------------------------------------------
  const tick = useCallback(() => {
    const elapsed = elapsedRef.current + (performance.now() - startTsRef.current);
    const count = Math.min(TOTAL_DOTS, Math.floor(elapsed / INTERVAL_MS));

    paintTo(count);
    setShown(count);

    if (count >= TOTAL_DOTS) {
      elapsedRef.current = TOTAL_DOTS * INTERVAL_MS;
      setRunState('done');
      rafRef.current = null;
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [paintTo]);

  const stopLoop = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  // --- controls -------------------------------------------------------------
  const start = () => {
    if (runState === 'running') return;
    if (runState === 'done') return restart();
    startTsRef.current = performance.now();
    setRunState('running');
    rafRef.current = requestAnimationFrame(tick);
  };

  const pause = () => {
    if (runState !== 'running') return;
    stopLoop();
    elapsedRef.current += performance.now() - startTsRef.current;
    setRunState('paused');
  };

  const resume = () => {
    if (runState !== 'paused') return;
    startTsRef.current = performance.now();
    setRunState('running');
    rafRef.current = requestAnimationFrame(tick);
  };

  const reset = () => {
    stopLoop();
    elapsedRef.current = 0;
    clearCanvas();
    setShown(0);
    setRunState('idle');
  };

  const restart = () => {
    stopLoop();
    elapsedRef.current = 0;
    clearCanvas();
    setShown(0);
    startTsRef.current = performance.now();
    setRunState('running');
    rafRef.current = requestAnimationFrame(tick);
  };

  // initial blank white canvas + cleanup
  useEffect(() => {
    clearCanvas();
    return stopLoop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const seconds = (shown * INTERVAL_MS) / 1000;
  const pct = Math.round((shown / TOTAL_DOTS) * 100);

  const btn: React.CSSProperties = {
    font: '13px ui-monospace, SFMono-Regular, Menlo, monospace',
    padding: '8px 16px',
    border: '1px solid #000',
    background: '#fff',
    color: '#000',
    cursor: 'pointer',
    borderRadius: 0,
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: BACKGROUND,
        color: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      }}
    >
      <canvas
        ref={canvasRef}
        width={cw}
        height={ch}
        style={{
          width: cw,
          height: ch,
          imageRendering: 'pixelated',
          background: BACKGROUND,
        }}
      />

      <div style={{ fontSize: 13, letterSpacing: 1 }}>
        {shown.toString().padStart(4, '0')} / {TOTAL_DOTS} dots &nbsp;·&nbsp;
        {seconds.toFixed(1)}s &nbsp;·&nbsp; {pct}%
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        {runState === 'running' ? (
          <button style={btn} onClick={pause}>Pause</button>
        ) : runState === 'paused' ? (
          <button style={btn} onClick={resume}>Resume</button>
        ) : (
          <button style={btn} onClick={start}>Start</button>
        )}
        <button style={btn} onClick={restart}>Restart</button>
        <button style={btn} onClick={reset}>Reset</button>
      </div>

      <div style={{ fontSize: 11, color: '#000', opacity: 1, maxWidth: 420, textAlign: 'center' }}>
        nothing → information → pattern → structure → recognition
      </div>
    </div>
  );
}
