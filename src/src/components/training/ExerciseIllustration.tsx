"use client";

type Pose =
  | "press"
  | "row"
  | "pulldown"
  | "squat"
  | "hinge"
  | "curl"
  | "raise"
  | "triceps"
  | "lunge"
  | "calves"
  | "core"
  | "carry"
  | "generic";

function inferPose(name: string): Pose {
  const n = name.toLowerCase();
  if (/pulldown|pull.?up|chin.?up/.test(n)) return "pulldown";
  if (/row|face pull/.test(n)) return "row";
  if (/bench|press|push.?up|dip/.test(n)) return "press";
  if (/deadlift|romanian|rdl|good morning|hip hinge|hip thrust|glute bridge|swing/.test(n)) return "hinge";
  if (/squat|leg press|hack squat/.test(n)) return "squat";
  if (/lunge|split squat|step.?up/.test(n)) return "lunge";
  if (/curl/.test(n)) return "curl";
  if (/triceps|pushdown|extension/.test(n)) return "triceps";
  if (/lateral raise|front raise|rear delt|reverse fly|upright row|shrug/.test(n)) return "raise";
  if (/calf|tibialis/.test(n)) return "calves";
  if (/crunch|plank|leg raise|ab wheel|russian twist|mountain climber/.test(n)) return "core";
  if (/farmer|carry|walk/.test(n)) return "carry";
  return "generic";
}

function Figure({ pose, end = false }: { pose: Pose; end?: boolean }) {
  const stroke = "currentColor";
  const accent = "#10b981";
  const muted = "#94a3b8";
  const sw = 4;

  if (pose === "press") {
    return (
      <g transform={end ? "translate(80 0)" : "translate(0 0)"}>
        <line x1="12" y1="96" x2="70" y2="96" stroke={muted} strokeWidth="4" strokeLinecap="round" />
        <line x1="18" y1="87" x2="57" y2="87" stroke={muted} strokeWidth="5" strokeLinecap="round" />
        <circle cx="27" cy="68" r="7" fill="none" stroke={stroke} strokeWidth={sw} />
        <line x1="34" y1="72" x2="52" y2="82" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="52" y1="82" x2="65" y2="88" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="41" y1="76" x2={end ? "40" : "34"} y2={end ? "39" : "55"} stroke={accent} strokeWidth={sw} strokeLinecap="round" />
        <line x1={end ? "40" : "34"} y1={end ? "39" : "55"} x2={end ? "40" : "31"} y2={end ? "25" : "39"} stroke={accent} strokeWidth={sw} strokeLinecap="round" />
        <line x1={end ? "27" : "18"} y1={end ? "25" : "38"} x2={end ? "54" : "44"} y2={end ? "25" : "38"} stroke={stroke} strokeWidth="3" />
        <circle cx={end ? "25" : "16"} cy={end ? "25" : "38"} r="4" fill={accent} />
        <circle cx={end ? "56" : "46"} cy={end ? "25" : "38"} r="4" fill={accent} />
      </g>
    );
  }

  if (pose === "row") {
    return (
      <g transform={end ? "translate(80 0)" : "translate(0 0)"}>
        <circle cx="29" cy="35" r="7" fill="none" stroke={stroke} strokeWidth={sw} />
        <line x1="35" y1="42" x2="48" y2="61" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="48" y1="61" x2="60" y2="83" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="48" y1="61" x2="38" y2="86" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="39" y1="49" x2={end ? "55" : "66"} y2={end ? "55" : "68"} stroke={accent} strokeWidth={sw} strokeLinecap="round" />
        <line x1={end ? "55" : "66"} y1={end ? "55" : "68"} x2={end ? "67" : "72"} y2={end ? "49" : "72"} stroke={accent} strokeWidth={sw} strokeLinecap="round" />
        <line x1="10" y1="91" x2="72" y2="91" stroke={muted} strokeWidth="3" />
        <rect x={end ? "65" : "70"} y={end ? "44" : "66"} width="8" height="8" rx="2" fill={accent} />
      </g>
    );
  }

  if (pose === "pulldown") {
    return (
      <g transform={end ? "translate(80 0)" : "translate(0 0)"}>
        <line x1="12" y1="18" x2="69" y2="18" stroke={muted} strokeWidth="3" />
        <circle cx="40" cy="39" r="7" fill="none" stroke={stroke} strokeWidth={sw} />
        <line x1="40" y1="46" x2="40" y2="72" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="40" y1="72" x2="31" y2="91" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="40" y1="72" x2="50" y2="91" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="39" y1="51" x2={end ? "25" : "18"} y2={end ? "34" : "21"} stroke={accent} strokeWidth={sw} strokeLinecap="round" />
        <line x1="41" y1="51" x2={end ? "56" : "63"} y2={end ? "34" : "21"} stroke={accent} strokeWidth={sw} strokeLinecap="round" />
        <line x1={end ? "20" : "13"} y1={end ? "30" : "18"} x2={end ? "61" : "68"} y2={end ? "30" : "18"} stroke={stroke} strokeWidth="3" />
      </g>
    );
  }

  if (pose === "squat") {
    return (
      <g transform={end ? "translate(80 0)" : "translate(0 0)"}>
        <circle cx="40" cy={end ? "31" : "24"} r="7" fill="none" stroke={stroke} strokeWidth={sw} />
        <line x1="40" y1={end ? "38" : "31"} x2={end ? "42" : "40"} y2={end ? "61" : "59"} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1={end ? "42" : "40"} y1={end ? "61" : "59"} x2={end ? "57" : "52"} y2={end ? "76" : "82"} stroke={accent} strokeWidth={sw} strokeLinecap="round" />
        <line x1={end ? "57" : "52"} y1={end ? "76" : "82"} x2="67" y2="93" stroke={accent} strokeWidth={sw} strokeLinecap="round" />
        <line x1={end ? "42" : "40"} y1={end ? "61" : "59"} x2={end ? "25" : "29"} y2={end ? "76" : "82"} stroke={accent} strokeWidth={sw} strokeLinecap="round" />
        <line x1={end ? "25" : "29"} y1={end ? "76" : "82"} x2="16" y2="93" stroke={accent} strokeWidth={sw} strokeLinecap="round" />
        <line x1="21" y1={end ? "42" : "39"} x2="60" y2={end ? "42" : "39"} stroke={stroke} strokeWidth="3" />
        <circle cx="18" cy={end ? "42" : "39"} r="4" fill={muted} />
        <circle cx="63" cy={end ? "42" : "39"} r="4" fill={muted} />
      </g>
    );
  }

  if (pose === "hinge") {
    return (
      <g transform={end ? "translate(80 0)" : "translate(0 0)"}>
        <circle cx={end ? "38" : "27"} cy={end ? "24" : "39"} r="7" fill="none" stroke={stroke} strokeWidth={sw} />
        <line x1={end ? "39" : "33"} y1={end ? "31" : "44"} x2={end ? "40" : "52"} y2={end ? "59" : "60"} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1={end ? "40" : "52"} y1={end ? "59" : "60"} x2="55" y2="89" stroke={accent} strokeWidth={sw} strokeLinecap="round" />
        <line x1={end ? "40" : "52"} y1={end ? "59" : "60"} x2="27" y2="90" stroke={accent} strokeWidth={sw} strokeLinecap="round" />
        <line x1={end ? "39" : "40"} y1={end ? "44" : "50"} x2={end ? "39" : "55"} y2={end ? "69" : "72"} stroke={accent} strokeWidth={sw} strokeLinecap="round" />
        <line x1="18" y1={end ? "72" : "76"} x2="66" y2={end ? "72" : "76"} stroke={stroke} strokeWidth="3" />
        <circle cx="16" cy={end ? "72" : "76"} r="4" fill={muted} />
        <circle cx="68" cy={end ? "72" : "76"} r="4" fill={muted} />
      </g>
    );
  }

  if (pose === "curl" || pose === "triceps" || pose === "raise") {
    const curl = pose === "curl";
    const tri = pose === "triceps";
    return (
      <g transform={end ? "translate(80 0)" : "translate(0 0)"}>
        <circle cx="40" cy="24" r="7" fill="none" stroke={stroke} strokeWidth={sw} />
        <line x1="40" y1="31" x2="40" y2="64" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="40" y1="64" x2="30" y2="92" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="40" y1="64" x2="51" y2="92" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        {curl ? (
          <>
            <line x1="38" y1="43" x2="24" y2="58" stroke={accent} strokeWidth={sw} strokeLinecap="round" />
            <line x1="24" y1="58" x2={end ? "28" : "21"} y2={end ? "42" : "76"} stroke={accent} strokeWidth={sw} strokeLinecap="round" />
            <rect x={end ? "24" : "17"} y={end ? "37" : "73"} width="8" height="6" rx="2" fill={accent} />
          </>
        ) : tri ? (
          <>
            <line x1="40" y1="40" x2="53" y2="29" stroke={accent} strokeWidth={sw} strokeLinecap="round" />
            <line x1="53" y1="29" x2={end ? "59" : "50"} y2={end ? "55" : "16"} stroke={accent} strokeWidth={sw} strokeLinecap="round" />
            <rect x={end ? "56" : "47"} y={end ? "54" : "11"} width="7" height="7" rx="2" fill={accent} />
          </>
        ) : (
          <>
            <line x1="39" y1="42" x2={end ? "16" : "27"} y2={end ? "42" : "62"} stroke={accent} strokeWidth={sw} strokeLinecap="round" />
            <line x1="41" y1="42" x2={end ? "64" : "54"} y2={end ? "42" : "62"} stroke={accent} strokeWidth={sw} strokeLinecap="round" />
            <circle cx={end ? "13" : "25"} cy={end ? "42" : "65"} r="4" fill={accent} />
            <circle cx={end ? "67" : "56"} cy={end ? "42" : "65"} r="4" fill={accent} />
          </>
        )}
      </g>
    );
  }

  if (pose === "lunge") {
    return (
      <g transform={end ? "translate(80 0)" : "translate(0 0)"}>
        <circle cx="40" cy="24" r="7" fill="none" stroke={stroke} strokeWidth={sw} />
        <line x1="40" y1="31" x2="40" y2="61" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="40" y1="61" x2={end ? "61" : "52"} y2={end ? "78" : "86"} stroke={accent} strokeWidth={sw} strokeLinecap="round" />
        <line x1={end ? "61" : "52"} y1={end ? "78" : "86"} x2="69" y2="94" stroke={accent} strokeWidth={sw} strokeLinecap="round" />
        <line x1="40" y1="61" x2={end ? "26" : "31"} y2={end ? "78" : "86"} stroke={accent} strokeWidth={sw} strokeLinecap="round" />
        <line x1={end ? "26" : "31"} y1={end ? "78" : "86"} x2="17" y2="94" stroke={accent} strokeWidth={sw} strokeLinecap="round" />
      </g>
    );
  }

  if (pose === "calves") {
    return (
      <g transform={end ? "translate(80 0)" : "translate(0 0)"}>
        <circle cx="40" cy={end ? "19" : "25"} r="7" fill="none" stroke={stroke} strokeWidth={sw} />
        <line x1="40" y1={end ? "26" : "32"} x2="40" y2={end ? "58" : "64"} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="40" y1={end ? "58" : "64"} x2="31" y2={end ? "87" : "92"} stroke={accent} strokeWidth={sw} strokeLinecap="round" />
        <line x1="40" y1={end ? "58" : "64"} x2="51" y2={end ? "87" : "92"} stroke={accent} strokeWidth={sw} strokeLinecap="round" />
        <line x1="17" y1="96" x2="65" y2="96" stroke={muted} strokeWidth="3" />
      </g>
    );
  }

  if (pose === "core") {
    return (
      <g transform={end ? "translate(80 0)" : "translate(0 0)"}>
        <circle cx={end ? "29" : "21"} cy={end ? "49" : "59"} r="7" fill="none" stroke={stroke} strokeWidth={sw} />
        <line x1={end ? "35" : "27"} y1={end ? "53" : "62"} x2="51" y2={end ? "63" : "69"} stroke={accent} strokeWidth={sw} strokeLinecap="round" />
        <line x1="51" y1={end ? "63" : "69"} x2="66" y2="83" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="51" y1={end ? "63" : "69"} x2="38" y2="86" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="12" y1="91" x2="72" y2="91" stroke={muted} strokeWidth="3" />
      </g>
    );
  }

  if (pose === "carry") {
    return (
      <g transform={end ? "translate(80 0)" : "translate(0 0)"}>
        <circle cx="40" cy="23" r="7" fill="none" stroke={stroke} strokeWidth={sw} />
        <line x1="40" y1="30" x2="40" y2="62" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="40" y1="62" x2={end ? "28" : "32"} y2="91" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="40" y1="62" x2={end ? "55" : "50"} y2="91" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="38" y1="42" x2="24" y2="63" stroke={accent} strokeWidth={sw} strokeLinecap="round" />
        <line x1="42" y1="42" x2="57" y2="63" stroke={accent} strokeWidth={sw} strokeLinecap="round" />
        <rect x="17" y="62" width="13" height="16" rx="3" fill="none" stroke={accent} strokeWidth="3" />
        <rect x="52" y="62" width="13" height="16" rx="3" fill="none" stroke={accent} strokeWidth="3" />
      </g>
    );
  }

  return (
    <g transform={end ? "translate(80 0)" : "translate(0 0)"}>
      <circle cx="40" cy="23" r="8" fill="none" stroke={stroke} strokeWidth={sw} />
      <line x1="40" y1="31" x2="40" y2="64" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <line x1="40" y1="43" x2="22" y2="62" stroke={accent} strokeWidth={sw} strokeLinecap="round" />
      <line x1="40" y1="43" x2="59" y2="62" stroke={accent} strokeWidth={sw} strokeLinecap="round" />
      <line x1="40" y1="64" x2="29" y2="92" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <line x1="40" y1="64" x2="52" y2="92" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
    </g>
  );
}

export default function ExerciseIllustration({
  name,
  compact = false,
}: {
  name: string;
  compact?: boolean;
}) {
  const pose = inferPose(name);
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/70 ${
        compact ? "h-12 w-12 shrink-0" : "w-full"
      }`}
      title={`${name} movement illustration`}
    >
      <svg
        viewBox="0 0 160 120"
        role="img"
        aria-label={`${name} movement illustration`}
        className={`w-full text-slate-800 ${compact ? "h-full" : "h-auto min-h-[210px]"}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <rect width="160" height="120" rx="18" fill="transparent" />
        <Figure pose={pose} />
        {!compact && <Figure pose={pose} end />}
        {!compact && (
          <>
            <path d="M73 58h14" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
            <path d="m83 53 5 5-5 5" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <text x="80" y="111" textAnchor="middle" fontSize="8" fontWeight="700" fill="#64748b">
              START → FINISH
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
