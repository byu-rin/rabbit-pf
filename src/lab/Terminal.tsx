import React, { useEffect, useRef, useState } from "react";

/* ============================================================
   Terminal — the CLI as a physical object inside the world.
   It is not a static rectangle: it tilts with the mouse
   (parallax), rises out of the depth on scroll, and prints
   live telemetry from the camera flying through the field.
   ============================================================ */

interface Line {
  id: number;
  kind: "in" | "out" | "sys";
  text: string;
}

const BOOT: Line[] = [
  { id: -6, kind: "sys", text: "doyeon.lab kernel 4.0.1 — geometry runtime" },
  { id: -5, kind: "sys", text: "mounting dot-field .............. ok" },
  { id: -4, kind: "sys", text: "seeding binary lattice .......... ok" },
  { id: -3, kind: "sys", text: "compiling procedural objects .... ok" },
  {
    id: -2,
    kind: "out",
    text: "geometry → data → structure → objects → interface",
  },
  { id: -1, kind: "out", text: "type 'help' to interrogate the system." },
];

let uid = 0;

const RABBIT_ASCII = ["  (\\(\\ ", "  ( -.-) ", '  o_(")(")'];

export const Terminal: React.FC = () => {
  const [lines, setLines] = useState<Line[]>(BOOT);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIndex, setHIndex] = useState(-1);
  const [depth, setDepth] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // physical behaviour: tilt with mouse, emerge with scroll
  useEffect(() => {
    let raf = 0;
    const smooth = { mx: 0, my: 0, s: 0 };
    const target = { mx: 0, my: 0, s: 0 };
    const onMove = (e: PointerEvent) => {
      target.mx = (e.clientX / window.innerWidth) * 2 - 1;
      target.my = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target.s = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      smooth.mx += (target.mx - smooth.mx) * 0.06;
      smooth.my += (target.my - smooth.my) * 0.06;
      smooth.s += (target.s - smooth.s) * 0.08;
      const el = wrapRef.current;
      if (el) {
        const rise = (1 - smooth.s) * 26;
        const settle = 0.35 + smooth.s * 0.65; // fades/opacity as you descend
        el.style.transform =
          `perspective(1200px) rotateX(${(-smooth.my * 6).toFixed(2)}deg) ` +
          `rotateY(${(smooth.mx * 9).toFixed(2)}deg) translateY(${rise.toFixed(1)}px)`;
        el.style.opacity = settle.toFixed(3);
      }
      setDepth(55 - smooth.s * 615); // mirror world camera depth (z)
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const b = bodyRef.current;
    if (b) b.scrollTop = b.scrollHeight;
  }, [lines]);

  const push = (newLines: Line[]) => setLines((prev) => [...prev, ...newLines]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    const [name] = cmd.toLowerCase().split(/\s+/);
    push([{ id: uid++, kind: "in", text: cmd }]);
    setHistory((h) => [...h, cmd]);
    setHIndex(-1);

    const out = (arr: string[]) =>
      push(arr.map((text) => ({ id: uid++, kind: "out" as const, text })));

    switch (name) {
      case "help":
        out([
          "commands:",
          "  ls            list generated entities",
          "  geometry      how the world is built",
          "  bottle        inspect water-bottle cloud",
          "  rabbit        inspect rabbit cloud",
          "  tree          inspect binary-tree structure",
          "  lattice       inspect the data spine",
          "  render        re-run the generator",
          "  scroll        how to move the camera",
          "  whoami        current observer",
          "  ascii         draw the rabbit",
          "  clear         wipe the buffer",
        ]);
        break;
      case "ls":
        out([
          "dot-field/          2600 pts   4D drift",
          "binary-lattice/     depth 5    edges + nodes",
          "objects/bottle      point-cloud   z -150",
          "objects/tree        recursive     z -250",
          "objects/rabbit      point-cloud   z -345",
          "interface/terminal  this object",
        ]);
        break;
      case "geometry":
        out([
          "pipeline:",
          "  1. geometry  — parametric surfaces sampled as dots",
          "  2. data      — dots carry position, seed, 4th coord (w)",
          "  3. structure — dots wired into a binary lattice",
          "  4. objects   — clouds assemble into bottle / rabbit / tree",
          "  5. interface — you are inside it",
        ]);
        break;
      case "bottle":
        out([
          "water-bottle :: revolution surface",
          "radius profile r(y), rings of dots",
          "a faint disc marks the water level.",
        ]);
        break;
      case "rabbit":
        out([
          "rabbit :: fibonacci sphere shells",
          "body + head + two branching ears + tail",
          "eyes = 3 dense marker dots each.",
        ]);
        break;
      case "tree":
        out([
          "tree :: recursive binary branching",
          "each node splits into two, len ×0.68",
          "leaves bloom into canopy dot clusters.",
        ]);
        break;
      case "lattice":
        out([
          "binary-lattice :: the data spine",
          "root at z 0, children march down -Z",
          "spread ×0.62 per level of depth.",
        ]);
        break;
      case "render":
        out([
          "re-seeding generator ...",
          "geometry recompiled. scroll to observe.",
        ]);
        break;
      case "scroll":
        out([
          "scroll = camera depth along -Z.",
          "move the mouse to parallax the field.",
          "objects assemble as you approach them.",
        ]);
        break;
      case "whoami":
        out([
          "observer @ doyeon.lab",
          `camera depth: z ${depth.toFixed(0)}`,
          "status: flying through the geometry.",
        ]);
        break;
      case "ascii":
        out(RABBIT_ASCII);
        break;
      case "clear":
        setLines([]);
        break;
      default:
        out([`${name}: not found — try 'help'`]);
    }
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      run(value);
      setValue("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const i = hIndex < 0 ? history.length - 1 : Math.max(0, hIndex - 1);
      setHIndex(i);
      setValue(history[i]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (hIndex < 0) return;
      const i = hIndex + 1;
      if (i >= history.length) {
        setHIndex(-1);
        setValue("");
      } else {
        setHIndex(i);
        setValue(history[i]);
      }
    }
  };

  return (
    <div
      ref={wrapRef}
      className="fixed z-40 bottom-6 right-6 w-[min(92vw,420px)] will-change-transform"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* corner brackets — the object's physical frame */}
      <div className="pointer-events-none absolute -inset-2 border border-lab-ash/40" />
      <span className="pointer-events-none absolute -top-2 -left-2 w-3 h-3 border-t border-l border-lab-mist" />
      <span className="pointer-events-none absolute -top-2 -right-2 w-3 h-3 border-t border-r border-lab-mist" />
      <span className="pointer-events-none absolute -bottom-2 -left-2 w-3 h-3 border-b border-l border-lab-mist" />
      <span className="pointer-events-none absolute -bottom-2 -right-2 w-3 h-3 border-b border-r border-lab-mist" />

      <div className="bg-lab-carbon/85 backdrop-blur-md border border-lab-ash shadow-[0_0_40px_rgba(0,0,0,0.6)]">
        {/* header / live telemetry */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-lab-ash">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-lab-mist" />
            <span className="lab-label !text-[9px] !tracking-[0.3em] text-lab-mist">
              rabbit.cli
            </span>
          </div>
          <span className="lab-readout">
            z:{depth.toFixed(0).padStart(4, " ")} · online
          </span>
        </div>

        {/* buffer */}
        <div
          ref={bodyRef}
          className="px-3 py-2 h-[230px] overflow-y-auto text-[11px] leading-[1.5] font-mono"
        >
          {lines.map((l) => (
            <div
              key={l.id}
              className={
                l.kind === "in"
                  ? "text-lab-glow"
                  : l.kind === "sys"
                    ? "text-lab-fog"
                    : "text-lab-mist whitespace-pre"
              }
            >
              {l.kind === "in" ? (
                <span className="text-lab-steel">rabbit@lab:~$ </span>
              ) : null}
              {l.text}
            </div>
          ))}
        </div>

        {/* input */}
        <div className="flex items-center gap-2 px-3 py-2 border-t border-lab-ash">
          <span className="text-lab-steel text-[11px] font-mono">
            rabbit@lab:~$
          </span>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKey}
            spellCheck={false}
            autoComplete="off"
            placeholder="help"
            className="flex-1 bg-transparent outline-none text-[11px] font-mono text-lab-glow placeholder:text-lab-steel caret-transparent"
          />
          <span className="lab-caret text-lab-glow text-[11px] font-mono">
            ▌
          </span>
        </div>
      </div>
    </div>
  );
};
