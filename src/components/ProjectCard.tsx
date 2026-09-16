"use client";

import { useRef, useState, type PointerEvent } from "react";

type Project = {
  slug: string;
  title: string;
  period: string;
  type: string;
  github: string;
  preview: string;
  summary: string;
  methods: string[];
  note: string;
};

export default function ProjectCard({ project }: { project: Project }) {
  const previewRef = useRef<HTMLSpanElement>(null);
  const [previewVisible, setPreviewVisible] = useState(false);

  const movePreview = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== "mouse" || !previewRef.current) return;
    const width = previewRef.current.offsetWidth || 360;
    const height = previewRef.current.offsetHeight || 225;
    const edge = 14;
    const gap = 16;
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const card = event.currentTarget.getBoundingClientRect();
    const roomOnRight = window.innerWidth - card.right;
    const roomOnLeft = card.left;
    const roomBelow = window.innerHeight - card.bottom;
    const roomAbove = card.top;
    const clampX = (value: number) =>
      Math.max(
        halfWidth + edge,
        Math.min(value, window.innerWidth - halfWidth - edge),
      );
    const clampY = (value: number) =>
      Math.max(
        halfHeight + edge,
        Math.min(value, window.innerHeight - halfHeight - edge),
      );

    let left: number;
    let top: number;

    if (Math.max(roomOnRight, roomOnLeft) >= width + gap + edge) {
      left =
        roomOnRight >= roomOnLeft
          ? card.right + gap + halfWidth
          : card.left - gap - halfWidth;
      top = clampY(event.clientY);
    } else if (Math.max(roomBelow, roomAbove) >= height + gap + edge) {
      left = clampX(event.clientX);
      top =
        roomBelow >= roomAbove
          ? card.bottom + gap + halfHeight
          : card.top - gap - halfHeight;
    } else {
      left =
        roomOnRight >= roomOnLeft
          ? window.innerWidth - halfWidth - edge
          : halfWidth + edge;
      top =
        roomBelow >= roomAbove
          ? window.innerHeight - halfHeight - edge
          : halfHeight + edge;
    }

    previewRef.current.style.left = `${left}px`;
    previewRef.current.style.top = `${top}px`;
  };

  return (
    <div className="project-card-wrap">
      <a
        className="project-card"
        id={project.slug}
        href={project.github}
        target="_blank"
        rel="noreferrer"
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") setPreviewVisible(true);
          movePreview(event);
        }}
        onPointerMove={movePreview}
        onPointerLeave={() => setPreviewVisible(false)}
      >
        <div className="project-topline">
          <span>{project.type}</span>
          <span>{project.period}</span>
        </div>
        <div className="project-title-row">
          <h2>{project.title}</h2>
          <span aria-hidden="true">↗</span>
        </div>
        <p>{project.summary}</p>
        <div className="tag-list">
          {project.methods.map((method) => (
            <span key={method}>{method}</span>
          ))}
        </div>
        <p className="project-note">{project.note}</p>
      </a>
      <span
        ref={previewRef}
        className="project-cursor-preview"
        data-visible={previewVisible}
        aria-hidden="true"
      >
        <img className="project-preview-dark" src={project.preview} alt="" />
        <img
          className="project-preview-light"
          src="/projects/figure-placeholder-light.svg"
          alt=""
        />
      </span>
    </div>
  );
}
