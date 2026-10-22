"use client";

import { useEffect, useRef, useState } from "react";

export default function ConnectomeFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const idleLoopStart = 58.2;
  const filmVersion = "20260924-4";

  useEffect(() => {
    const root = document.documentElement;
    const updateTheme = () =>
      setTheme(root.dataset.theme === "dark" ? "dark" : "light");
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !theme) return;
    setVideoReady(false);
    video.load();
    if (!paused) void video.play();
  }, [theme]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setPaused(false);
    } else {
      video.pause();
      setPaused(true);
    }
  };

  const replayFromStart = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    void video.play();
    setPaused(false);
  };

  const loopIdleSequence = () => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    if (video.currentTime >= video.duration - 0.12) {
      video.currentTime = Math.min(idleLoopStart, video.duration - 0.5);
      if (!paused) void video.play();
    }
  };

  return (
    <div className="connectome-film-frame">
      {theme ? (
        <video
          key={theme}
          ref={videoRef}
          className={`connectome-film${videoReady ? " is-ready" : ""}`}
          src={`/projects/connectome/connectome-explainer-${theme}.mp4?v=${filmVersion}`}
          poster={`/projects/connectome/connectome-poster-${theme}.png?v=${filmVersion}`}
          autoPlay
          muted
          playsInline
          preload="metadata"
          onLoadedData={() => setVideoReady(true)}
          onTimeUpdate={loopIdleSequence}
          onEnded={loopIdleSequence}
          aria-label="Animated explanation of the Connectome stateful market-prediction pipeline"
        />
      ) : (
        <div className="connectome-film connectome-film-placeholder" aria-hidden="true" />
      )}
      <div className="connectome-film-meta">
        <div className="connectome-film-actions">
          <button type="button" onClick={replayFromStart} disabled={!theme}>
            Replay from start
          </button>
          <button type="button" onClick={togglePlayback} disabled={!theme}>
            {paused ? "Play" : "Pause"}
          </button>
        </div>
      </div>
    </div>
  );
}
