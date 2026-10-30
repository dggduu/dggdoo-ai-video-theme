import type { CSSProperties } from "react";
import type { ChapterDef } from "../registry/types";
import "./ChapterProgress.css";

interface Props {
  chapters: ChapterDef[];
  cursor: { chapter: number; step: number };
}

/**
 * 章节进度条 —— 常显在舞台底部，跟着录屏一起进画面。
 *
 * 每章一段，宽度 = 该章口播步数（内容长度）；章名标在段落上方。
 * 已过的章填满，当前章按步内进度填充并高亮章名，未到的章留空。
 * 不显示页码 / 百分比 —— 进度本身就是「讲到哪一章的哪一步」。
 */
export function ChapterProgress({ chapters, cursor }: Props) {
  return (
    <div className="cp" data-no-advance>
      <div className="cp-labels">
        {chapters.map((c, i) => (
          <span
            key={c.id}
            className={`cp-lab${i < cursor.chapter ? " is-done" : ""}${
              i === cursor.chapter ? " is-now" : ""
            }`}
            style={{ flexGrow: Math.max(1, c.narrations.length), flexBasis: 0 }}
          >
            {c.title}
          </span>
        ))}
      </div>
      <div className="cp-bar">
        {chapters.map((c, i) => {
          const w = Math.max(1, c.narrations.length);
          const pct =
            i < cursor.chapter ? 100 : i === cursor.chapter ? ((cursor.step + 1) / w) * 100 : 0;
          return (
            <span
              key={c.id}
              className={`cp-seg${i < cursor.chapter ? " is-done" : ""}${
                i === cursor.chapter ? " is-now" : ""
              }`}
              style={{ flexGrow: w, flexBasis: 0, "--p": `${pct}%` } as CSSProperties}
            >
              <i />
            </span>
          );
        })}
        <i className="cp-stop" />
      </div>
    </div>
  );
}
