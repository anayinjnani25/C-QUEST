import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, Code2, CornerDownLeft, Play } from "lucide-react";
import { highlightC } from "@/lib/c/highlight";
import { cn } from "@/lib/utils";

export default function CodeEditor({ value, onChange, onRun }) {
  const taRef = useRef(null);
  const preRef = useRef(null);
  const gutterRef = useRef(null);
  const [focused, setFocused] = useState(false);

  const html = useMemo(() => highlightC(value), [value]);
  const lineCount = useMemo(() => Math.max(1, value.split("\n").length), [value]);

  const syncScroll = () => {
    const ta = taRef.current;
    if (!ta) return;
    if (preRef.current) {
      preRef.current.scrollTop = ta.scrollTop;
      preRef.current.scrollLeft = ta.scrollLeft;
    }
    if (gutterRef.current) gutterRef.current.scrollTop = ta.scrollTop;
  };

  useEffect(() => {
    syncScroll();
  }, [value]);

  const commit = (next, caret) => {
    onChange(next);
    requestAnimationFrame(() => {
      const ta = taRef.current;
      if (!ta) return;
      ta.selectionStart = caret;
      ta.selectionEnd = caret;
      syncScroll();
    });
  };

  const handleKeyDown = (e) => {
    const ta = e.currentTarget;
    const { selectionStart: start, selectionEnd: end } = ta;

    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      onRun();
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      commit(value.slice(0, start) + "  " + value.slice(end), start + 2);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const line = value.slice(lineStart, start);
      const indent = (line.match(/^[ \t]*/) || [""])[0];
      const extra = line.trimEnd().endsWith("{") ? "  " : "";
      const insert = "\n" + indent + extra;
      commit(value.slice(0, start) + insert + value.slice(end), start + insert.length);
    }
  };

  return (
    <div
      className={cn(
        "quest-card overflow-hidden transition-colors duration-200",
        focused && "!border-[#8cc63f]/70"
      )}
    >
      <div className="flex items-center gap-2 border-b-2 border-frame px-3.5 py-2.5">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#58CC02]/15 text-[#58CC02]">
          <Code2 className="h-4 w-4" strokeWidth={2.8} />
        </span>
        <span className="text-[14px] font-extrabold text-ink">main.c</span>
        <span className="ml-auto flex items-center gap-1.5 rounded-full border-2 border-frame bg-tile px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-ink-soft">
          <BookOpen className="h-3.5 w-3.5" strokeWidth={2.5} />
          Spellbook
        </span>
      </div>

      <div className="flex max-h-[440px] min-h-[300px]">
        <div
          ref={gutterRef}
          aria-hidden
          className="no-scrollbar shrink-0 select-none overflow-hidden border-r-2 border-frame bg-tile py-3 pl-3 pr-2.5 text-right font-mono text-[12.5px] leading-6 text-ink-faint"
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        <div className="relative min-w-0 flex-1 bg-card">
          <pre
            ref={preRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre px-3 py-3 font-mono text-[13px] leading-6 text-ink"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <textarea
            ref={taRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onScroll={syncScroll}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            wrap="off"
            aria-label="C source code"
            className="thin-scroll relative h-[440px] w-full resize-none overflow-auto whitespace-pre bg-transparent px-3 py-3 font-mono text-[13px] leading-6 text-transparent caret-[#8cc63f] outline-none selection:bg-[#C6E9A8] selection:text-transparent"
          />
        </div>
      </div>

      <div className="flex items-center justify-between border-t-2 border-frame bg-tile px-3.5 py-2">
        <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-ink-faint">
          <CornerDownLeft className="h-3 w-3" strokeWidth={3} />
          Tab · 2 spaces
        </span>
        <button
          type="button"
          onClick={onRun}
          className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-ink-faint transition-colors hover:text-gold-ink"
        >
          Ctrl + Enter to run
          <Play className="h-3.5 w-3.5 text-gold" fill="currentColor" strokeWidth={0} />
        </button>
      </div>
    </div>
  );
}