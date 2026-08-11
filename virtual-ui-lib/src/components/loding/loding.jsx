import React, { useState, useEffect } from "react";

export const LoaderPanel = ({
  title = "System Syncing",
  subtitle = "Deploying cloud assets & establishing secure sockets",
  accent = "#6366f1",
  bg = "#0f172a",
  cardBg = "#020617",
  initialProgress = 65,
  autoProgress = true,
  onComplete = () => {},
  onCancel = () => {}
}) => {
  const [progress, setProgress] = useState(initialProgress);
  const [activeTab, setActiveTab] = useState("ring");
  const [isPaused, setIsPaused] = useState(false);

  const alpha = (hex, op) => {
    const r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
    return "rgba(" + r + "," + g + "," + b + "," + op + ")";
  };

  useEffect(() => {
    if (!autoProgress || isPaused || progress >= 100) return;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          onComplete();
          return 100;
        }
        return prev + 1;
      });
    }, 150);
    return () => clearInterval(timer);
  }, [autoProgress, isPaused, progress, onComplete]);

  const tasks = [
    { name: "Authentication Handshake", completed: progress > 20 },
    { name: "Downloading Model Weights (2.4 GB)", completed: progress > 55 },
    { name: "Optimizing Tensor Cache", completed: progress > 85 },
    { name: "Finalizing Workspace Environment", completed: progress === 100 }
  ];

  return (
    <div
      style={{
        background: bg,
        padding: "32px",
        borderRadius: "24px",
        width: "100%",
        maxWidth: "480px",
        boxSizing: "border-box",
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "#fff",
        border: "1px solid " + alpha("#ffffff", 0.08),
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
        position: "relative",
        overflow: "hidden",
        margin: "0 auto"
      }}
    >
      <style>{
        "@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }\n" +
        "@keyframes pulseGlow { 0%, 100% { opacity: 0.4; transform: scale(0.98); } 50% { opacity: 0.9; transform: scale(1.02); } }\n" +
        "@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }\n" +
        "@keyframes bounceDot { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }"
      }</style>

      {/* Background Accent Glow */}
      <div
        style={{
          position: "absolute",
          top: "-80px",
          right: "-80px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: accent,
          filter: "blur(90px)",
          opacity: 0.25,
          pointerEvents: "none"
        }}
      />

      {/* Top Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: progress === 100 ? "#10b981" : accent,
              boxShadow: "0 0 10px " + (progress === 100 ? "#10b981" : accent)
            }}
          />
          <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>
            {progress === 100 ? "Ready" : "Processing"}
          </span>
        </div>

        {/* Style selector switch */}
        <div style={{ display: "flex", background: alpha("#ffffff", 0.05), borderRadius: "10px", padding: "3px" }}>
          {["ring", "bar", "dots", "skeleton"].map((type) => (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              style={{
                border: "none",
                background: activeTab === type ? alpha(accent, 0.25) : "transparent",
                color: activeTab === type ? "#fff" : "rgba(255,255,255,0.4)",
                padding: "4px 10px",
                borderRadius: "7px",
                fontSize: "11px",
                fontWeight: "600",
                cursor: "pointer",
                textTransform: "capitalize",
                transition: "all 0.2s ease"
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Header Info */}
      <div style={{ marginBottom: "28px" }}>
        <h3 style={{ margin: "0 0 6px 0", fontSize: "20px", fontWeight: "700", color: "#ffffff" }}>{title}</h3>
        <p style={{ margin: 0, fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: "1.5" }}>{subtitle}</p>
      </div>

      {/* Main Visual Display */}
      <div
        style={{
          background: cardBg,
          borderRadius: "16px",
          padding: "28px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyInhalt: "center",
          border: "1px solid " + alpha("#ffffff", 0.05),
          marginBottom: "24px",
          position: "relative"
        }}
      >
        {/* TYPE 1: CIRCULAR RING */}
        {activeTab === "ring" && (
          <div style={{ position: "relative", width: "110px", height: "110px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="110" height="110" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="50" cy="50" r="42" stroke={alpha("#ffffff", 0.08)} strokeWidth="8" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke={accent}
                strokeWidth="8"
                strokeDasharray={264}
                strokeDashoffset={264 - (264 * progress) / 100}
                strokeLinecap="round"
                fill="transparent"
                style={{ transition: "stroke-dashoffset 0.3s ease" }}
              />
            </svg>
            <div style={{ position: "absolute", textAlign: "center" }}>
              <span style={{ fontSize: "22px", fontWeight: "800", letterSpacing: "-0.5px" }}>{progress}%</span>
            </div>
          </div>
        )}

        {/* TYPE 2: GLOW LINEAR BAR */}
        {activeTab === "bar" && (
          <div style={{ width: "100%", padding: "10px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "14px", fontWeight: "600" }}>
              <span style={{ color: "rgba(255,255,255,0.7)" }}>Overall Progress</span>
              <span style={{ color: accent, fontWeight: "700" }}>{progress}%</span>
            </div>
            <div style={{ width: "100%", height: "10px", background: alpha("#ffffff", 0.08), borderRadius: "10px", overflow: "hidden", position: "relative" }}>
              <div
                style={{
                  height: "100%",
                  width: progress + "%",
                  background: "linear-gradient(90deg, " + accent + ", #38bdf8)",
                  borderRadius: "10px",
                  transition: "width 0.3s ease",
                  boxShadow: "0 0 12px " + alpha(accent, 0.8)
                }}
              />
            </div>
          </div>
        )}

        {/* TYPE 3: WAVE DOTS */}
        {activeTab === "dots" && (
          <div style={{ padding: "20px 0", textAlign: "center" }}>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "16px" }}>
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    background: accent,
                    animation: "bounceDot 1.4s infinite ease-in-out both",
                    animationDelay: i * 0.16 + "s"
                  }}
                />
              ))}
            </div>
            <div style={{ fontSize: "14px", fontWeight: "600", color: "rgba(255,255,255,0.8)" }}>
              Synchronizing Node Data ({progress}%)
            </div>
          </div>
        )}

        {/* TYPE 4: SKELETON SHIMMER */}
        {activeTab === "skeleton" && (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px" }}>
            {[70, 100, 45].map((w, idx) => (
              <div
                key={idx}
                style={{
                  height: "16px",
                  width: w + "%",
                  borderRadius: "6px",
                  background: "linear-gradient(90deg, " + alpha("#ffffff", 0.06) + " 25%, " + alpha("#ffffff", 0.15) + " 37%, " + alpha("#ffffff", 0.06) + " 63%)",
                  backgroundSize: "400% 100%",
                  animation: "shimmer 1.8s ease-in-out infinite"
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Tasks List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
        {tasks.map((task, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "13px",
              color: task.completed ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)",
              transition: "color 0.3s ease"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  border: "1.5px solid " + (task.completed ? "#10b981" : alpha("#ffffff", 0.2)),
                  background: task.completed ? alpha("#10b981", 0.15) : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.3s ease"
                }}
              >
                {task.completed ? (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1.5,6 4.5,9 10.5,3" />
                  </svg>
                ) : (
                  <div
                    style={{
                      width: "5px",
                      height: "5px",
                      borderRadius: "50%",
                      background: alpha("#ffffff", 0.2)
                    }}
                  />
                )}
              </div>
              <span>{task.name}</span>
            </div>
            <span style={{ fontSize: "11px", fontFamily: "monospace", opacity: 0.6 }}>
              {task.completed ? "DONE" : "WAITING"}
            </span>
          </div>
        ))}
      </div>

      {/* Action Footer */}
      <div style={{ display: "flex", gap: "12px" }}>
        <button
          onClick={() => setIsPaused(!isPaused)}
          style={{
            flex: 1,
            padding: "11px",
            borderRadius: "12px",
            border: "1px solid " + alpha("#ffffff", 0.12),
            background: alpha("#ffffff", 0.04),
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "background 0.2s"
          }}
        >
          {isPaused ? "Resume" : "Pause Sync"}
        </button>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            padding: "11px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(135deg, " + accent + ", " + alpha(accent, 0.7) + ")",
            color: "#ffffff",
            fontSize: "13px",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 4px 15px " + alpha(accent, 0.35)
          }}
        >
          {progress === 100 ? "Complete" : "Cancel"}
        </button>
      </div>
    </div>
  );
};
