import React, { useEffect, useState } from "react";

/* ============================================================
   Overlay — the scrollable narrative skin. It supplies the
   document height that drives the camera and prints the
   pipeline as sparse, lab-grade captions over the geometry.
   ============================================================ */

interface Project {
  name: string;
  url: string;
}

interface Section {
  index: string;
  id: string;
  label: string;
  title: string;
  body: string;
  align: "left" | "right";
  projects?: Project[];
}

const SECTIONS: Section[] = [
  {
    index: "00",
    id: "top",
    label: "boot / hero",
    title: "DOYEON.LAB",
    body: "An Aquarius, a Rabbit, an INTP, and a web developer obsessed with interactive design. I turn ideas into systems, systems into interactions, and interactions into experiences.",
    align: "left",
  },
  {
    index: "01",
    id: "project",
    label: "project",
    title: "review\nticket",
    body: "AI가 리뷰 사진을 분석해 주문한 음식과 일치하는지 검증한다.\nReact, TypeScript, Vite, Spring Boot, MySQL, DINOv2 를 사용했다.",
    align: "left",
    projects: [
      {
        name: "tasted sample",
        url: "https://github.com/ReviewTicketFullstack/ReviewTicketFullstack",
      },
    ],
  },
  {
    index: "02",
    id: "project",
    label: "project",
    title: "smart\nhousing filter",
    body: "복잡하고 찾기 어려운 청약공고를 지역, 금액 등 조건별로 필터링하여 쉽게 찾을 수 있다.\nReact, TypeScript 를 사용했다.",
    align: "right",
    projects: [
      {
        name: "tasted sample",
        url: "https://github.com/byu-rin/smart-housing-filter",
      },
    ],
  },
  {
    index: "03",
    id: "project",
    label: "project",
    title: "ai extension\ncurator",
    body: "졸업전시회 방문객의 원활한 관람을 위해 QR 기반 TTS·다국어·작가 및 작품 설명 서비스를 제공한다.\nHTML · JavaScript 를 사용했다. Android 서비스를 지원한다.",
    align: "left",
    projects: [
      {
        name: "tasted sample",
        url: "https://github.com/byu-rin/art_movement_detail.git",
      },
    ],
  },
  {
    index: "04",
    id: "project",
    label: "project",
    title: "auto\nscraping menu",
    body: "네이버지도 기준 음식점의 메뉴명, 가격, 정보를 스크랩한다. python 을 사용했다.",
    align: "right",
    projects: [
      {
        name: "tasted sample",
        url: "https://github.com/byu-rin/menu_scraping.git",
      },
    ],
  },
  {
    index: "05",
    id: "project",
    label: "project",
    title: "mystery of\nnext phase",
    body: "the CLI is a physical object in this space. tilt it with your mouse. type into the geometry.",
    align: "left",
  },
];

const Meter: React.FC = () => {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? window.scrollY / max : 0);
    };
    window.addEventListener("scroll", on, { passive: true });
    on();
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-3 pointer-events-none">
      <span className="lab-readout writing-vertical rotate-180 tracking-[0.4em]">
        DEPTH
      </span>
      <div className="relative w-px h-48 bg-lab-ash">
        <div
          className="absolute left-0 top-0 w-px bg-lab-glow"
          style={{ height: `${p * 100}%` }}
        />
        <div
          className="absolute -left-[3px] w-[7px] h-[7px] border border-lab-glow bg-lab-ink"
          style={{ top: `calc(${p * 100}% - 3px)` }}
        />
      </div>
      <span className="lab-readout tabular-nums">
        {(p * 100).toFixed(0).padStart(3, "0")}
      </span>
    </div>
  );
};

export const Overlay: React.FC = () => {
  return (
    <main className="relative z-10">
      <Meter />
      {SECTIONS.map((s) => (
        <section
          key={s.index}
          id={s.id}
          className="min-h-screen flex items-center px-6 md:px-20 scroll-mt-16"
          style={{
            justifyContent: s.align === "right" ? "flex-end" : "flex-start",
          }}
        >
          <div
            className={`max-w-md ${s.align === "right" ? "text-right" : "text-left"}`}
          >
            <div
              className={`flex items-center gap-3 mb-6 ${
                s.align === "right" ? "justify-end" : "justify-start"
              }`}
            >
              <span className="lab-label text-lab-mist">{s.index}</span>
              <span className="w-8 lab-hair inline-block" />
              <span className="lab-label">{s.label}</span>
            </div>
            <h2
              className={`font-display font-bold text-lab-glow text-shadow-glow whitespace-pre-line leading-[0.95] mb-6 ${
                s.index === "00"
                  ? "text-5xl md:text-7xl tracking-tight"
                  : "text-3xl md:text-5xl"
              }`}
            >
              {s.title}
            </h2>
            <p className="font-mono text-[13px] leading-relaxed text-lab-mist max-w-sm inline-block">
              {s.body}
            </p>
            {s.index === "00" && (
              <div className="mt-10 flex items-center gap-3 lab-readout">
                <span className="w-1.5 h-1.5 rounded-full bg-lab-glow animate-pulse" />
                React · TypeScript · Vite
              </div>
            )}
            {s.projects && s.projects.length > 0 && (
              <div className="mt-8 space-y-2">
                {s.projects.map((proj) => (
                  <a
                    key={proj.url}
                    href={proj.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-lab-glow hover:text-lab-chalk transition-colors lab-label underline decoration-lab-glow decoration-1 underline-offset-2"
                  >
                    → {proj.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}
      {/* tail room so the last object fully assembles before the floor */}
      <div className="h-[60vh]" />
      <footer className="relative flex items-center justify-between px-6 md:px-20 py-8 border-t border-lab-ash">
        <span className="lab-readout">
          doyeon.lab · generative geometry runtime
        </span>
        <span className="lab-readout">
          © {new Date().getFullYear()} — end of buffer
        </span>
      </footer>
    </main>
  );
};
