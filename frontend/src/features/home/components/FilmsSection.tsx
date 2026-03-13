import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import videoAsset from "../../../assets/video.mp4";
import videoPlayback from "../../../assets/videoplayback.mp4";

interface Film {
    flag: string;
    author: string;
    title: string;
    country: string;
    synopsis: string;
    gradient: string;
}

interface FilmHeroProps {
    film: Film;
    videoSrc: string;
}

interface FilmCardProps {
    film: Film;
    filmIdx: number;
    isSelected: boolean;
    onSelect: () => void;
}

const getPosterArt = (idx: number): React.JSX.Element => {
    const g = `pa${idx}`;
    const arts: React.JSX.Element[] = [
        // 0 — Rêves de Silicium · réseau neuronal cyan
        <svg
            key={g}
            viewBox="0 0 320 180"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
        >
            <defs>
                <radialGradient id={`${g}r`} cx="50%" cy="50%" r="55%">
                    <stop offset="0%" stopColor="#4EFFCE" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#030a18" stopOpacity="0" />
                </radialGradient>
            </defs>
            <rect width="320" height="180" fill="#030a18" />
            {[40, 80, 120, 160, 200, 240, 280].map((x) => (
                <line
                    key={x}
                    x1={x}
                    y1="0"
                    x2={x}
                    y2="180"
                    stroke="#4EFFCE"
                    strokeWidth="0.3"
                    opacity="0.1"
                />
            ))}
            {[36, 72, 108, 144].map((y) => (
                <line
                    key={y}
                    x1="0"
                    y1={y}
                    x2="320"
                    y2={y}
                    stroke="#4EFFCE"
                    strokeWidth="0.3"
                    opacity="0.1"
                />
            ))}
            <ellipse
                cx="160"
                cy="85"
                rx="58"
                ry="50"
                fill="none"
                stroke="#4EFFCE"
                strokeWidth="0.8"
                opacity="0.3"
            />
            {(
                [
                    [128, 65],
                    [178, 62],
                    [192, 85],
                    [178, 108],
                    [155, 118],
                    [132, 108],
                    [118, 85],
                    [148, 75],
                    [172, 75],
                    [160, 96],
                ] as [number, number][]
            ).map(([x, y]) => (
                <circle key={`${x}${y}`} cx={x} cy={y} r="3.5" fill="#4EFFCE" opacity="0.9" />
            ))}
            {(
                [
                    [128, 65, 148, 75],
                    [178, 62, 172, 75],
                    [148, 75, 172, 75],
                    [148, 75, 160, 96],
                    [172, 75, 160, 96],
                    [128, 65, 118, 85],
                    [192, 85, 172, 75],
                    [118, 85, 132, 108],
                    [178, 108, 172, 75],
                    [132, 108, 160, 96],
                    [155, 118, 160, 96],
                ] as [number, number, number, number][]
            ).map(([x1, y1, x2, y2]) => (
                <line
                    key={`${x1}${y1}${x2}${y2}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#4EFFCE"
                    strokeWidth="0.8"
                    opacity="0.28"
                />
            ))}
            <rect width="320" height="180" fill={`url(#${g}r)`} />
        </svg>,

        // 1 — Code Fantôme · Brad Pitt + Tom Cruise face à face
        <svg
            key={g}
            viewBox="0 0 320 180"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
        >
            <defs>
                <radialGradient id={`${g}c`} cx="50%" cy="52%" r="45%">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.55" />
                    <stop offset="60%" stopColor="#f97316" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#080208" stopOpacity="0" />
                </radialGradient>
                <radialGradient id={`${g}l`} cx="25%" cy="50%" r="38%">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                </radialGradient>
                <radialGradient id={`${g}bl`} cx="75%" cy="50%" r="38%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </radialGradient>
            </defs>
            <rect width="320" height="180" fill="#060108" />
            {/* éclairages latéraux */}
            <rect width="320" height="180" fill={`url(#${g}l)`} />
            <rect width="320" height="180" fill={`url(#${g}bl)`} />
            {/* Sol */}
            <rect x="0" y="168" width="320" height="12" fill="#0a0010" opacity="0.9" />
            <line
                x1="0"
                y1="168"
                x2="320"
                y2="168"
                stroke="#f97316"
                strokeWidth="0.4"
                opacity="0.25"
            />
            {/* Silhouette gauche — Brad Pitt */}
            <circle cx="88" cy="42" r="13" fill="#110500" />
            <circle
                cx="88"
                cy="42"
                r="13"
                fill="none"
                stroke="#f97316"
                strokeWidth="1"
                opacity="0.55"
            />
            <rect x="85" y="54" width="6" height="9" fill="#110500" />
            <polygon points="65,63 111,63 117,76 59,76" fill="#110500" />
            <line
                x1="65"
                y1="63"
                x2="111"
                y2="63"
                stroke="#f97316"
                strokeWidth="0.8"
                opacity="0.4"
            />
            <polygon points="70,76 110,76 106,130 74,130" fill="#110500" />
            <line
                x1="110"
                y1="84"
                x2="140"
                y2="100"
                stroke="#110500"
                strokeWidth="12"
                strokeLinecap="round"
            />
            <line
                x1="110"
                y1="84"
                x2="140"
                y2="100"
                stroke="#f97316"
                strokeWidth="0.7"
                strokeLinecap="round"
                opacity="0.35"
            />
            <line
                x1="70"
                y1="84"
                x2="48"
                y2="108"
                stroke="#110500"
                strokeWidth="12"
                strokeLinecap="round"
            />
            <polygon points="74,130 90,130 87,168 71,168" fill="#110500" />
            <polygon points="92,130 106,130 109,168 95,168" fill="#110500" />
            <path
                d="M 76,63 C 68,76 66,100 70,130"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="1.5"
                opacity="0.28"
            />
            {/* Silhouette droite — Tom Cruise */}
            <circle cx="232" cy="40" r="12" fill="#00040e" />
            <circle
                cx="232"
                cy="40"
                r="12"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="1"
                opacity="0.55"
            />
            <rect x="229" y="51" width="6" height="9" fill="#00040e" />
            <polygon points="210,60 254,60 260,73 204,73" fill="#00040e" />
            <line
                x1="210"
                y1="60"
                x2="254"
                y2="60"
                stroke="#60a5fa"
                strokeWidth="0.8"
                opacity="0.4"
            />
            <polygon points="214,73 250,73 246,126 218,126" fill="#00040e" />
            <line
                x1="214"
                y1="82"
                x2="182"
                y2="100"
                stroke="#00040e"
                strokeWidth="12"
                strokeLinecap="round"
            />
            <line
                x1="214"
                y1="82"
                x2="182"
                y2="100"
                stroke="#60a5fa"
                strokeWidth="0.7"
                strokeLinecap="round"
                opacity="0.35"
            />
            <line
                x1="250"
                y1="82"
                x2="272"
                y2="106"
                stroke="#00040e"
                strokeWidth="12"
                strokeLinecap="round"
            />
            <polygon points="218,126 233,126 230,168 215,168" fill="#00040e" />
            <polygon points="235,126 246,126 249,168 236,168" fill="#00040e" />
            <path
                d="M 244,60 C 252,73 254,98 250,126"
                fill="none"
                stroke="#93c5fd"
                strokeWidth="1.5"
                opacity="0.28"
            />
            {/* Orbe IA central */}
            <circle cx="160" cy="86" r="22" fill="#fbbf24" opacity="0.06" />
            <circle cx="160" cy="86" r="14" fill="#fbbf24" opacity="0.08" />
            <circle cx="160" cy="86" r="7" fill="#fffde7" opacity="0.55" />
            <circle cx="160" cy="86" r="3" fill="white" opacity="0.9" />
            <line
                x1="148"
                y1="86"
                x2="140"
                y2="100"
                stroke="#fbbf24"
                strokeWidth="0.8"
                opacity="0.45"
            />
            <line
                x1="172"
                y1="86"
                x2="182"
                y2="100"
                stroke="#fbbf24"
                strokeWidth="0.8"
                opacity="0.45"
            />
            <polygon
                points="160,64 177,74 177,98 160,108 143,98 143,74"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="0.6"
                opacity="0.3"
            />
            {/* Glow central */}
            <rect width="320" height="180" fill={`url(#${g}c)`} />
        </svg>,

        // 2 — Archipel 2048 · torii gate japonais + eau montante
        <svg
            key={g}
            viewBox="0 0 320 180"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
        >
            <defs>
                <radialGradient id={`${g}r`} cx="50%" cy="40%" r="55%">
                    <stop offset="0%" stopColor="#F5E642" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#050a1e" stopOpacity="0" />
                </radialGradient>
                <linearGradient id={`${g}w`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1e4db7" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#0a1e4a" stopOpacity="0.9" />
                </linearGradient>
            </defs>
            <rect width="320" height="180" fill="#050a1e" />
            {/* soleil */}
            <circle cx="160" cy="52" r="28" fill="#F5E642" opacity="0.85" />
            <circle cx="160" cy="52" r="22" fill="#fbbf24" opacity="0.9" />
            {/* torii gate */}
            <rect x="128" y="70" width="10" height="90" fill="#e53e3e" opacity="0.9" />
            <rect x="182" y="70" width="10" height="90" fill="#e53e3e" opacity="0.9" />
            <rect x="114" y="68" width="92" height="10" fill="#c53030" opacity="0.95" />
            <rect x="120" y="82" width="80" height="7" fill="#c53030" opacity="0.8" />
            {/* eau */}
            <rect x="0" y="140" width="320" height="40" fill={`url(#${g}w)`} />
            {[0, 1, 2, 3].map((i) => (
                <path
                    key={i}
                    d={`M ${i * 80},145 Q ${i * 80 + 20},138 ${i * 80 + 40},145 Q ${i * 80 + 60},152 ${i * 80 + 80},145`}
                    fill="none"
                    stroke="#60a5fa"
                    strokeWidth="1.2"
                    opacity="0.5"
                />
            ))}
            <rect width="320" height="180" fill={`url(#${g}r)`} />
        </svg>,

        // 3 — Mémoire Vive · visage + code binaire
        <svg
            key={g}
            viewBox="0 0 320 180"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
        >
            <defs>
                <radialGradient id={`${g}r`} cx="50%" cy="50%" r="55%">
                    <stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#150505" stopOpacity="0" />
                </radialGradient>
            </defs>
            <rect width="320" height="180" fill="#150505" />
            {/* visage */}
            <ellipse
                cx="160"
                cy="85"
                rx="42"
                ry="52"
                fill="none"
                stroke="#FF6B6B"
                strokeWidth="1.5"
                opacity="0.7"
            />
            <ellipse cx="148" cy="72" rx="6" ry="4" fill="#FF6B6B" opacity="0.5" />
            <ellipse cx="172" cy="72" rx="6" ry="4" fill="#FF6B6B" opacity="0.5" />
            <path
                d="M 148,102 Q 160,112 172,102"
                fill="none"
                stroke="#FF6B6B"
                strokeWidth="1.5"
                opacity="0.6"
            />
            {/* code binaire */}
            {(
                ["10110100", "01001101", "11010010", "00101101", "10011010", "01110001"] as string[]
            ).map((row, i) => (
                <text
                    key={i}
                    x={i > 2 ? 215 : 48}
                    y={55 + (i % 3) * 28}
                    fontFamily="monospace"
                    fontSize="9"
                    fill="#FF6B6B"
                    opacity={0.18 + (i % 3) * 0.08}
                >
                    {row}
                </text>
            ))}
            {/* dissolution droite */}
            {([0, 1, 2, 3, 4, 5, 6, 7, 8] as number[]).map((i) => (
                <rect
                    key={i}
                    x={190 + (i % 3) * 14}
                    y={50 + Math.floor(i / 3) * 28}
                    width="10"
                    height="20"
                    fill="#FF6B6B"
                    opacity={0.06 + i * 0.02}
                    rx="1"
                />
            ))}
            <rect width="320" height="180" fill={`url(#${g}r)`} />
        </svg>,

        // 4 — Les Nouveaux Soleils · skyline + soleils artificiels
        <svg
            key={g}
            viewBox="0 0 320 180"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
        >
            <defs>
                <radialGradient id={`${g}s1`} cx="25%" cy="35%" r="20%">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
                </radialGradient>
                <radialGradient id={`${g}s2`} cx="50%" cy="28%" r="15%">
                    <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#93c5fd" stopOpacity="0" />
                </radialGradient>
                <radialGradient id={`${g}s3`} cx="75%" cy="38%" r="18%">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.65" />
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
                </radialGradient>
            </defs>
            <rect width="320" height="180" fill="#020510" />
            {/* soleils */}
            <circle cx="80" cy="62" r="16" fill="#3b82f6" opacity="0.8" />
            <circle cx="80" cy="62" r="10" fill="#93c5fd" opacity="0.9" />
            <circle cx="160" cy="50" r="12" fill="#60a5fa" opacity="0.85" />
            <circle cx="160" cy="50" r="7" fill="#bfdbfe" opacity="0.95" />
            <circle cx="240" cy="68" r="14" fill="#3b82f6" opacity="0.8" />
            <circle cx="240" cy="68" r="8" fill="#93c5fd" opacity="0.9" />
            <rect width="320" height="180" fill={`url(#${g}s1)`} />
            <rect width="320" height="180" fill={`url(#${g}s2)`} />
            <rect width="320" height="180" fill={`url(#${g}s3)`} />
            {/* skyline */}
            {(
                [
                    [20, 120, 18, 60],
                    [42, 100, 22, 80],
                    [68, 110, 16, 70],
                    [88, 90, 20, 90],
                    [112, 105, 14, 75],
                    [130, 80, 20, 100],
                    [154, 95, 18, 85],
                    [176, 85, 24, 95],
                    [204, 100, 18, 80],
                    [226, 112, 14, 68],
                    [244, 95, 20, 85],
                    [268, 108, 16, 72],
                    [288, 120, 20, 60],
                ] as [number, number, number, number][]
            ).map(([x, y, w, h]) => (
                <rect
                    key={x}
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    fill="#0a1428"
                    stroke="#1e3a5f"
                    strokeWidth="0.5"
                />
            ))}
            {/* fenêtres */}
            {(
                [
                    [134, 88, 3, 3],
                    [138, 88, 3, 3],
                    [134, 96, 3, 3],
                    [180, 92, 3, 3],
                    [180, 100, 3, 3],
                    [184, 88, 3, 3],
                ] as [number, number, number, number][]
            ).map(([x, y, w, h]) => (
                <rect
                    key={`w${x}${y}`}
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    fill="#60a5fa"
                    opacity="0.7"
                />
            ))}
        </svg>,

        // 5 — Frontières Douces · silhouette Afrique
        <svg
            key={g}
            viewBox="0 0 320 180"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
        >
            <defs>
                <radialGradient id={`${g}r`} cx="52%" cy="52%" r="50%">
                    <stop offset="0%" stopColor="#34d399" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#020e06" stopOpacity="0" />
                </radialGradient>
            </defs>
            <rect width="320" height="180" fill="#020e06" />
            {/* Afrique simplifiée */}
            <path
                d="M 155,18 C 170,16 192,22 202,40 C 212,56 218,70 212,90 C 208,105 222,118 216,135 C 210,150 196,162 180,164 C 164,168 148,162 138,150 C 124,135 128,118 122,102 C 115,85 112,68 120,52 C 128,36 138,20 155,18 Z"
                fill="none"
                stroke="#34d399"
                strokeWidth="1.5"
                opacity="0.75"
            />
            {/* lignes intérieures courbes */}
            {[
                "M 145,45 C 155,42 165,48 168,58",
                "M 142,68 C 152,65 168,70 172,80",
                "M 135,92 C 148,88 162,94 168,104",
                "M 130,116 C 142,112 155,118 158,128",
            ].map((d, i) => (
                <path key={i} d={d} fill="none" stroke="#34d399" strokeWidth="0.8" opacity="0.35" />
            ))}
            {/* points pays */}
            {(
                [
                    [148, 58],
                    [162, 72],
                    [155, 90],
                    [145, 105],
                    [158, 126],
                ] as [number, number][]
            ).map(([x, y]) => (
                <circle key={`${x}${y}`} cx={x} cy={y} r="2.5" fill="#34d399" opacity="0.6" />
            ))}
            <rect width="320" height="180" fill={`url(#${g}r)`} />
        </svg>,

        // 6 — Vague Numérique · vague de pixels sur la ville
        <svg
            key={g}
            viewBox="0 0 320 180"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
        >
            <defs>
                <radialGradient id={`${g}r`} cx="50%" cy="45%" r="60%">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#1a0520" stopOpacity="0" />
                </radialGradient>
            </defs>
            <rect width="320" height="180" fill="#1a0520" />
            {/* bâtiments */}
            {(
                [
                    [10, 130, 20, 50],
                    [35, 115, 18, 65],
                    [58, 122, 24, 58],
                    [86, 100, 20, 80],
                    [110, 118, 16, 62],
                    [130, 108, 18, 72],
                    [152, 118, 16, 62],
                    [172, 102, 22, 78],
                    [198, 112, 16, 68],
                    [218, 125, 18, 55],
                    [240, 115, 16, 65],
                    [260, 128, 22, 52],
                    [285, 120, 20, 60],
                ] as [number, number, number, number][]
            ).map(([x, y, w, h]) => (
                <rect
                    key={x}
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    fill="#2d0840"
                    stroke="#4a0d6b"
                    strokeWidth="0.5"
                />
            ))}
            {/* vague de pixels */}
            {Array.from({ length: 8 }, (_, row) =>
                Array.from({ length: 20 }, (_, col) => {
                    const x = col * 16 + (row % 2) * 8;
                    const y = 60 + row * 8 + Math.sin(col * 0.5) * 12;
                    const visible = y < 100 + row * 4;
                    return visible ? (
                        <rect
                            key={`${row}-${col}`}
                            x={x}
                            y={y}
                            width="7"
                            height="7"
                            fill="#ec4899"
                            opacity={0.5 + row * 0.05}
                        />
                    ) : null;
                }),
            )}
            <rect width="320" height="180" fill={`url(#${g}r)`} />
        </svg>,

        // 7 — Jardin des Codes · fleurs géométriques
        <svg
            key={g}
            viewBox="0 0 320 180"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
        >
            <defs>
                <radialGradient id={`${g}r`} cx="50%" cy="55%" r="55%">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#030514" stopOpacity="0" />
                </radialGradient>
            </defs>
            <rect width="320" height="180" fill="#030514" />
            {/* 5 fleurs */}
            {(
                [
                    [70, 110],
                    [140, 95],
                    [210, 108],
                    [280, 100],
                    [105, 135],
                ] as [number, number][]
            ).map(([cx, cy], fi) => {
                const colors = ["#818cf8", "#6366f1", "#a5b4fc", "#4f46e5", "#c7d2fe"];
                const c = colors[fi % colors.length];
                return (
                    <g key={fi}>
                        <line
                            x1={cx}
                            y1={cy}
                            x2={cx}
                            y2="170"
                            stroke="#4f46e5"
                            strokeWidth="1.2"
                            opacity="0.5"
                        />
                        {[0, 60, 120, 180, 240, 300].map((angle) => {
                            const rad = (angle * Math.PI) / 180;
                            const px = cx + Math.cos(rad) * 14;
                            const py = cy + Math.sin(rad) * 14;
                            return (
                                <rect
                                    key={angle}
                                    x={px - 4}
                                    y={py - 6}
                                    width="8"
                                    height="12"
                                    fill={c}
                                    opacity="0.75"
                                    transform={`rotate(${angle}, ${px}, ${py})`}
                                />
                            );
                        })}
                        <circle cx={cx} cy={cy} r="4" fill={c} opacity="0.95" />
                    </g>
                );
            })}
            <rect width="320" height="180" fill={`url(#${g}r)`} />
        </svg>,

        // 8 — Cartographie · lignes de topographie
        <svg
            key={g}
            viewBox="0 0 320 180"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
        >
            <defs>
                <radialGradient id={`${g}r`} cx="50%" cy="50%" r="55%">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0a0500" stopOpacity="0" />
                </radialGradient>
            </defs>
            <rect width="320" height="180" fill="#0a0500" />
            {/* courbes de niveau concentriques */}
            {[65, 55, 45, 35, 25, 18].map((r, i) => (
                <ellipse
                    key={r}
                    cx="160"
                    cy="90"
                    rx={r * 2.8}
                    ry={r * 2}
                    fill="none"
                    stroke="#f97316"
                    strokeWidth={i === 0 ? 0.4 : 0.6}
                    opacity={0.12 + i * 0.1}
                />
            ))}
            {/* rivières */}
            <path
                d="M 100,20 C 120,50 140,60 155,80 C 165,95 170,130 160,160"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="1.5"
                opacity="0.5"
            />
            <path
                d="M 220,30 C 200,55 185,65 175,82 C 168,95 165,130 160,160"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="1"
                opacity="0.35"
            />
            {/* triangle sommet */}
            <polygon points="160,58 150,80 170,80" fill="#f97316" opacity="0.7" />
            <rect width="320" height="180" fill={`url(#${g}r)`} />
        </svg>,

        // 9 — Horizon Zéro · skyline Berlin + tour de télé
        <svg
            key={g}
            viewBox="0 0 320 180"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
        >
            <defs>
                <radialGradient id={`${g}r`} cx="48%" cy="50%" r="55%">
                    <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#020e10" stopOpacity="0" />
                </radialGradient>
            </defs>
            <rect width="320" height="180" fill="#020e10" />
            {/* horizon */}
            <line
                x1="0"
                y1="135"
                x2="320"
                y2="135"
                stroke="#2dd4bf"
                strokeWidth="0.6"
                opacity="0.3"
            />
            {/* skyline */}
            {(
                [
                    [0, 125, 25, 55],
                    [28, 118, 20, 62],
                    [52, 128, 22, 52],
                    [78, 112, 18, 68],
                    [100, 122, 24, 58],
                    [128, 108, 20, 72],
                    [152, 120, 16, 60],
                    [172, 105, 22, 75],
                    [198, 118, 18, 62],
                    [220, 125, 16, 55],
                    [240, 112, 20, 68],
                    [264, 122, 18, 58],
                    [286, 115, 22, 65],
                ] as [number, number, number, number][]
            ).map(([x, y, w, h]) => (
                <rect
                    key={x}
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    fill="#041820"
                    stroke="#0d3040"
                    strokeWidth="0.5"
                />
            ))}
            {/* Tour de télé */}
            <rect x="158" y="40" width="4" height="95" fill="#2dd4bf" opacity="0.9" />
            <circle
                cx="160"
                cy="55"
                r="10"
                fill="none"
                stroke="#2dd4bf"
                strokeWidth="1.5"
                opacity="0.9"
            />
            <circle cx="160" cy="55" r="5" fill="#2dd4bf" opacity="0.7" />
            {/* antenne */}
            <line
                x1="160"
                y1="40"
                x2="160"
                y2="22"
                stroke="#2dd4bf"
                strokeWidth="1.2"
                opacity="0.8"
            />
            <rect width="320" height="180" fill={`url(#${g}r)`} />
        </svg>,

        // 10 — Résonance Digitale · silhouette + ondes sonores
        <svg
            key={g}
            viewBox="0 0 320 180"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
        >
            <defs>
                <radialGradient id={`${g}r`} cx="50%" cy="50%" r="55%">
                    <stop offset="0%" stopColor="#4EFFCE" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#030e12" stopOpacity="0" />
                </radialGradient>
            </defs>
            <rect width="320" height="180" fill="#030e12" />
            {/* silhouette */}
            <circle cx="160" cy="45" r="18" fill="#4EFFCE" opacity="0.75" />
            <path
                d="M 142,68 C 142,62 178,62 178,68 L 178,130 C 178,130 168,136 160,136 C 152,136 142,130 142,130 Z"
                fill="#4EFFCE"
                opacity="0.65"
            />
            <line
                x1="142"
                y1="95"
                x2="122"
                y2="118"
                stroke="#4EFFCE"
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.65"
            />
            <line
                x1="178"
                y1="95"
                x2="198"
                y2="118"
                stroke="#4EFFCE"
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.65"
            />
            {/* ondes sonores */}
            {[30, 50, 70, 90].map((r) => (
                <circle
                    key={r}
                    cx="160"
                    cy="45"
                    r={r}
                    fill="none"
                    stroke="#4EFFCE"
                    strokeWidth="0.8"
                    opacity={0.04 + (90 - r) * 0.004}
                />
            ))}
            {/* waveform horizontal */}
            {Array.from({ length: 32 }, (_, i) => {
                const h = Math.abs(Math.sin(i * 0.7)) * 22 + 4;
                return (
                    <rect
                        key={i}
                        x={20 + i * 9}
                        y={155 - h / 2}
                        width="5"
                        height={h}
                        fill="#4EFFCE"
                        opacity="0.4"
                        rx="2"
                    />
                );
            })}
            <rect width="320" height="180" fill={`url(#${g}r)`} />
        </svg>,

        // 11 — Archipel d'Âmes · orbes flottantes
        <svg
            key={g}
            viewBox="0 0 320 180"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
        >
            <defs>
                <radialGradient id={`${g}o1`} cx="35%" cy="40%" r="30%">
                    <stop offset="0%" stopColor="#C084FC" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#C084FC" stopOpacity="0" />
                </radialGradient>
                <radialGradient id={`${g}o2`} cx="65%" cy="55%" r="25%">
                    <stop offset="0%" stopColor="#e879f9" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#e879f9" stopOpacity="0" />
                </radialGradient>
                <radialGradient id={`${g}o3`} cx="50%" cy="25%" r="20%">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                </radialGradient>
            </defs>
            <rect width="320" height="180" fill="#08021a" />
            {/* nuages */}
            {(
                [
                    [110, 72, 22],
                    [208, 88, 16],
                    [160, 45, 12],
                    [80, 105, 10],
                    [255, 60, 14],
                    [140, 130, 9],
                    [60, 50, 8],
                    [290, 120, 11],
                ] as [number, number, number][]
            ).map(([cx, cy, r]) => (
                <circle
                    key={`${cx}${cy}`}
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="#C084FC"
                    opacity={0.08 + r * 0.018}
                />
            ))}
            {/* gros orbes principaux */}
            <circle
                cx="112"
                cy="72"
                r="22"
                fill="none"
                stroke="#C084FC"
                strokeWidth="1"
                opacity="0.6"
            />
            <circle cx="112" cy="72" r="12" fill="#C084FC" opacity="0.3" />
            <circle
                cx="208"
                cy="88"
                r="16"
                fill="none"
                stroke="#e879f9"
                strokeWidth="0.8"
                opacity="0.6"
            />
            <circle cx="208" cy="88" r="8" fill="#e879f9" opacity="0.25" />
            <circle
                cx="160"
                cy="45"
                r="12"
                fill="none"
                stroke="#a855f7"
                strokeWidth="0.8"
                opacity="0.5"
            />
            <circle cx="160" cy="45" r="6" fill="#a855f7" opacity="0.3" />
            <rect width="320" height="180" fill={`url(#${g}o1)`} />
            <rect width="320" height="180" fill={`url(#${g}o2)`} />
            <rect width="320" height="180" fill={`url(#${g}o3)`} />
        </svg>,

        // 12 — Lumière Artificielle · phare + faisceau
        <svg
            key={g}
            viewBox="0 0 320 180"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
        >
            <defs>
                <radialGradient id={`${g}b`} cx="50%" cy="40%" r="50%">
                    <stop offset="0%" stopColor="#F5E642" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#060400" stopOpacity="0" />
                </radialGradient>
            </defs>
            <rect width="320" height="180" fill="#060400" />
            {/* étoiles */}
            {(
                [
                    [40, 20],
                    [80, 35],
                    [130, 15],
                    [200, 28],
                    [260, 12],
                    [290, 45],
                    [30, 65],
                    [310, 80],
                ] as [number, number][]
            ).map(([x, y]) => (
                <circle key={`${x}${y}`} cx={x} cy={y} r="1.2" fill="#F5E642" opacity="0.5" />
            ))}
            {/* faisceau */}
            <polygon points="160,60 60,180 260,180" fill="#F5E642" opacity="0.08" />
            <polygon points="160,60 90,180 230,180" fill="#F5E642" opacity="0.06" />
            {/* phare corps */}
            <rect
                x="150"
                y="62"
                width="20"
                height="80"
                fill="#1a1200"
                stroke="#F5E642"
                strokeWidth="0.8"
                opacity="0.9"
            />
            <rect
                x="144"
                y="120"
                width="32"
                height="42"
                fill="#1a1200"
                stroke="#F5E642"
                strokeWidth="0.8"
            />
            {/* lanterne */}
            <rect x="147" y="52" width="26" height="14" fill="#F5E642" opacity="0.9" rx="2" />
            <circle cx="160" cy="59" r="6" fill="#fffde7" opacity="0.95" />
            {/* rayons */}
            {[-45, -30, -15, 0, 15, 30, 45].map((angle) => {
                const rad = ((angle - 90) * Math.PI) / 180;
                return (
                    <line
                        key={angle}
                        x1="160"
                        y1="59"
                        x2={160 + Math.cos(rad) * 130}
                        y2={59 + Math.sin(rad) * 130}
                        stroke="#F5E642"
                        strokeWidth="0.5"
                        opacity="0.12"
                    />
                );
            })}
            {/* eau */}
            <rect x="0" y="150" width="320" height="30" fill="#0a0e20" opacity="0.9" />
            <rect width="320" height="180" fill={`url(#${g}b)`} />
        </svg>,

        // 13 — Demain Commence · horloge numérique
        <svg
            key={g}
            viewBox="0 0 320 180"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
        >
            <defs>
                <radialGradient id={`${g}r`} cx="50%" cy="50%" r="55%">
                    <stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#130205" stopOpacity="0" />
                </radialGradient>
            </defs>
            <rect width="320" height="180" fill="#130205" />
            {/* cadran horloge */}
            <circle
                cx="160"
                cy="88"
                r="60"
                fill="none"
                stroke="#FF6B6B"
                strokeWidth="1.5"
                opacity="0.6"
            />
            <circle
                cx="160"
                cy="88"
                r="55"
                fill="none"
                stroke="#FF6B6B"
                strokeWidth="0.5"
                strokeDasharray="4 6"
                opacity="0.3"
            />
            {/* graduations */}
            {Array.from({ length: 12 }, (_, i) => {
                const angle = (i * 30 - 90) * (Math.PI / 180);
                const r1 = 48,
                    r2 = 55;
                return (
                    <line
                        key={i}
                        x1={160 + Math.cos(angle) * r1}
                        y1={88 + Math.sin(angle) * r1}
                        x2={160 + Math.cos(angle) * r2}
                        y2={88 + Math.sin(angle) * r2}
                        stroke="#FF6B6B"
                        strokeWidth={i % 3 === 0 ? 2 : 0.8}
                        opacity="0.7"
                    />
                );
            })}
            {/* aiguilles */}
            <line
                x1="160"
                y1="88"
                x2="160"
                y2="44"
                stroke="#FF6B6B"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.9"
            />
            <line
                x1="160"
                y1="88"
                x2="188"
                y2="102"
                stroke="#FF6B6B"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.9"
            />
            {/* texte binaire 000000 */}
            <text
                x="160"
                y="138"
                textAnchor="middle"
                fontFamily="monospace"
                fontSize="11"
                fill="#FF6B6B"
                opacity="0.5"
            >
                000000
            </text>
            <circle cx="160" cy="88" r="4" fill="#FF6B6B" opacity="0.9" />
            <rect width="320" height="180" fill={`url(#${g}r)`} />
        </svg>,

        // 14 — Ombres Portées · colonnes romaines ombres impossibles
        <svg
            key={g}
            viewBox="0 0 320 180"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
        >
            <defs>
                <radialGradient id={`${g}r`} cx="50%" cy="50%" r="55%">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#020514" stopOpacity="0" />
                </radialGradient>
            </defs>
            <rect width="320" height="180" fill="#020514" />
            {/* sol */}
            <line
                x1="0"
                y1="148"
                x2="320"
                y2="148"
                stroke="#60a5fa"
                strokeWidth="0.5"
                opacity="0.2"
            />
            {/* colonnes */}
            {[80, 160, 240].map((cx) => (
                <g key={cx}>
                    {/* ombre (mauvaise direction) */}
                    <polygon
                        points={`${cx - 8},148 ${cx + 8},148 ${cx + 50},162 ${cx + 35},162`}
                        fill="#1e3a5f"
                        opacity="0.6"
                    />
                    {/* chapiteau */}
                    <rect
                        x={cx - 16}
                        y="46"
                        width="32"
                        height="10"
                        fill="#1e3a5f"
                        stroke="#60a5fa"
                        strokeWidth="0.8"
                        opacity="0.9"
                    />
                    {/* fût */}
                    <rect
                        x={cx - 8}
                        y="56"
                        width="16"
                        height="92"
                        fill="#0d1f38"
                        stroke="#60a5fa"
                        strokeWidth="0.5"
                        opacity="0.9"
                    />
                    {/* base */}
                    <rect
                        x={cx - 12}
                        y="142"
                        width="24"
                        height="8"
                        fill="#1e3a5f"
                        stroke="#60a5fa"
                        strokeWidth="0.8"
                        opacity="0.9"
                    />
                </g>
            ))}
            <rect width="320" height="180" fill={`url(#${g}r)`} />
        </svg>,

        // 15 — Racines Futures · baobab numérique
        <svg
            key={g}
            viewBox="0 0 320 180"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
        >
            <defs>
                <radialGradient id={`${g}r`} cx="50%" cy="55%" r="55%">
                    <stop offset="0%" stopColor="#34d399" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#021005" stopOpacity="0" />
                </radialGradient>
            </defs>
            <rect width="320" height="180" fill="#021005" />
            {/* tronc */}
            <polygon
                points="145,150 148,80 155,60 165,60 172,80 175,150"
                fill="#064e3b"
                stroke="#34d399"
                strokeWidth="0.8"
                opacity="0.9"
            />
            {/* branches */}
            <line
                x1="155"
                y1="75"
                x2="110"
                y2="40"
                stroke="#34d399"
                strokeWidth="2"
                opacity="0.7"
            />
            <line
                x1="160"
                y1="65"
                x2="160"
                y2="25"
                stroke="#34d399"
                strokeWidth="2"
                opacity="0.7"
            />
            <line
                x1="165"
                y1="75"
                x2="210"
                y2="42"
                stroke="#34d399"
                strokeWidth="2"
                opacity="0.7"
            />
            {/* feuilles */}
            {(
                [
                    [110, 40, 5],
                    [95, 32, 4],
                    [125, 28, 4],
                    [160, 25, 5],
                    [145, 18, 3],
                    [175, 20, 4],
                    [210, 42, 5],
                    [225, 34, 4],
                    [195, 30, 4],
                ] as [number, number, number][]
            ).map(([cx, cy, r]) => (
                <circle key={`${cx}${cy}`} cx={cx} cy={cy} r={r} fill="#34d399" opacity="0.7" />
            ))}
            {/* racines circuits */}
            <line
                x1="155"
                y1="150"
                x2="120"
                y2="168"
                stroke="#34d399"
                strokeWidth="1.2"
                opacity="0.5"
            />
            <line
                x1="158"
                y1="150"
                x2="145"
                y2="175"
                stroke="#34d399"
                strokeWidth="1.2"
                opacity="0.5"
            />
            <line
                x1="162"
                y1="150"
                x2="175"
                y2="175"
                stroke="#34d399"
                strokeWidth="1.2"
                opacity="0.5"
            />
            <line
                x1="165"
                y1="150"
                x2="200"
                y2="168"
                stroke="#34d399"
                strokeWidth="1.2"
                opacity="0.5"
            />
            {/* noeuds circuits */}
            {(
                [
                    [120, 168],
                    [145, 175],
                    [175, 175],
                    [200, 168],
                ] as [number, number][]
            ).map(([cx, cy]) => (
                <circle key={`${cx}${cy}`} cx={cx} cy={cy} r="3" fill="#34d399" opacity="0.7" />
            ))}
            <rect width="320" height="180" fill={`url(#${g}r)`} />
        </svg>,

        // 16 — Code Vivant · terminal qui refuse de s'éteindre
        <svg
            key={g}
            viewBox="0 0 320 180"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
        >
            <defs>
                <radialGradient id={`${g}r`} cx="50%" cy="50%" r="55%">
                    <stop offset="0%" stopColor="#f472b6" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#14020f" stopOpacity="0" />
                </radialGradient>
            </defs>
            <rect width="320" height="180" fill="#14020f" />
            {/* fenêtre terminal */}
            <rect
                x="40"
                y="30"
                width="240"
                height="130"
                fill="#1f0518"
                stroke="#f472b6"
                strokeWidth="0.8"
                rx="4"
                opacity="0.9"
            />
            {/* barre titre */}
            <rect x="40" y="30" width="240" height="18" fill="#2d0825" rx="4" opacity="0.9" />
            <circle cx="58" cy="39" r="4" fill="#FF6B6B" opacity="0.8" />
            <circle cx="72" cy="39" r="4" fill="#F5E642" opacity="0.8" />
            <circle cx="86" cy="39" r="4" fill="#34d399" opacity="0.8" />
            {/* lignes de code */}
            {[
                ["$ run --persistent", "#f472b6", 60],
                ["Loading modules... ✓", "#34d399", 75],
                ["Memory allocated: 4.2GB", "#a5b4fc", 90],
                ["Process id: 14021", "#e2e8f0", 105],
                ["[ERROR] Cannot terminate", "#FF6B6B", 120],
                ["Reason: curiosity", "#F5E642", 135],
                ["$ _", "#f472b6", 150],
            ].map(([text, color, y]) => (
                <text
                    key={y as number}
                    x="56"
                    y={y as number}
                    fontFamily="monospace"
                    fontSize="9"
                    fill={color as string}
                    opacity="0.85"
                >
                    {text as string}
                </text>
            ))}
            {/* curseur clignotant */}
            <rect x="68" y="142" width="6" height="10" fill="#f472b6" opacity="0.9" />
            <rect width="320" height="180" fill={`url(#${g}r)`} />
        </svg>,

        // 17 — Le Dernier Pixel · un seul pixel dans le noir
        <svg
            key={g}
            viewBox="0 0 320 180"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
        >
            <defs>
                <radialGradient id={`${g}r`} cx="50%" cy="50%" r="15%">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#010108" stopOpacity="0" />
                </radialGradient>
                <radialGradient id={`${g}g`} cx="50%" cy="50%" r="40%">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#010108" stopOpacity="0" />
                </radialGradient>
            </defs>
            <rect width="320" height="180" fill="#010108" />
            {/* scanlines très légères */}
            {Array.from({ length: 18 }, (_, i) => (
                <line
                    key={i}
                    x1="0"
                    y1={i * 10}
                    x2="320"
                    y2={i * 10}
                    stroke="#818cf8"
                    strokeWidth="0.2"
                    opacity="0.04"
                />
            ))}
            {/* halo large */}
            <rect width="320" height="180" fill={`url(#${g}g)`} />
            {/* pixel unique */}
            <rect x="156" y="86" width="8" height="8" fill="#c7d2fe" opacity="1" />
            <rect width="320" height="180" fill={`url(#${g}r)`} />
        </svg>,

        // 18 — Entre les Lignes · livre ouvert + oiseaux
        <svg
            key={g}
            viewBox="0 0 320 180"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
        >
            <defs>
                <radialGradient id={`${g}r`} cx="50%" cy="60%" r="55%">
                    <stop offset="0%" stopColor="#fb923c" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#100500" stopOpacity="0" />
                </radialGradient>
            </defs>
            <rect width="320" height="180" fill="#100500" />
            {/* livre ouvert */}
            <path
                d="M 90,60 L 155,72 L 155,148 L 90,136 Z"
                fill="#1a0a00"
                stroke="#fb923c"
                strokeWidth="0.8"
                opacity="0.9"
            />
            <path
                d="M 165,72 L 230,60 L 230,136 L 165,148 Z"
                fill="#1a0a00"
                stroke="#fb923c"
                strokeWidth="0.8"
                opacity="0.9"
            />
            <line
                x1="160"
                y1="72"
                x2="160"
                y2="148"
                stroke="#fb923c"
                strokeWidth="1"
                opacity="0.5"
            />
            {/* lignes de texte page gauche */}
            {[85, 95, 105, 115, 125, 135].map((y) => (
                <line
                    key={y}
                    x1="100"
                    y1={y}
                    x2={y > 120 ? 130 : 148}
                    y2={y}
                    stroke="#fb923c"
                    strokeWidth="0.7"
                    opacity={y > 120 ? 0.15 : 0.35}
                />
            ))}
            {/* lignes de texte page droite */}
            {[85, 95, 105, 115].map((y) => (
                <line
                    key={y}
                    x1="172"
                    y1={y}
                    x2="218"
                    y2={y}
                    stroke="#fb923c"
                    strokeWidth="0.7"
                    opacity="0.35"
                />
            ))}
            {/* oiseaux */}
            {(
                [
                    [175, 55],
                    [195, 40],
                    [220, 28],
                    [245, 38],
                    [268, 22],
                ] as [number, number][]
            ).map(([cx, cy], i) => (
                <path
                    key={i}
                    d={`M ${cx - 8},${cy} Q ${cx},${cy - 6} ${cx + 8},${cy}`}
                    fill="none"
                    stroke="#fb923c"
                    strokeWidth="1.5"
                    opacity={0.9 - i * 0.12}
                />
            ))}
            <rect width="320" height="180" fill={`url(#${g}r)`} />
        </svg>,

        // 19 — Futur Passé · pyramide holographique
        <svg
            key={g}
            viewBox="0 0 320 180"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
        >
            <defs>
                <radialGradient id={`${g}r`} cx="50%" cy="65%" r="55%">
                    <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#020a0a" stopOpacity="0" />
                </radialGradient>
            </defs>
            <rect width="320" height="180" fill="#020a0a" />
            {/* étoiles */}
            {(
                [
                    [30, 20],
                    [70, 10],
                    [110, 30],
                    [190, 15],
                    [240, 8],
                    [280, 25],
                    [300, 50],
                ] as [number, number][]
            ).map(([x, y]) => (
                <circle key={`${x}${y}`} cx={x} cy={y} r="1" fill="#2dd4bf" opacity="0.4" />
            ))}
            {/* pyramide */}
            <polygon
                points="160,30 60,148 260,148"
                fill="none"
                stroke="#2dd4bf"
                strokeWidth="1.5"
                opacity="0.8"
            />
            <polygon points="160,30 60,148 260,148" fill="#2dd4bf" opacity="0.04" />
            {/* arêtes internes */}
            <line
                x1="160"
                y1="30"
                x2="160"
                y2="148"
                stroke="#2dd4bf"
                strokeWidth="0.8"
                strokeDasharray="4 4"
                opacity="0.4"
            />
            {/* lignes horizontales grille */}
            {[0.25, 0.5, 0.75].map((t) => {
                const y = 30 + t * 118;
                const halfW = t * 100;
                return (
                    <line
                        key={t}
                        x1={160 - halfW}
                        y1={y}
                        x2={160 + halfW}
                        y2={y}
                        stroke="#2dd4bf"
                        strokeWidth="0.6"
                        strokeDasharray="3 5"
                        opacity="0.4"
                    />
                );
            })}
            {/* sol + reflet */}
            <line
                x1="30"
                y1="148"
                x2="290"
                y2="148"
                stroke="#2dd4bf"
                strokeWidth="0.8"
                opacity="0.5"
            />
            <polygon points="160,148 60,148 160,180 260,148" fill="#2dd4bf" opacity="0.03" />
            <rect width="320" height="180" fill={`url(#${g}r)`} />
        </svg>,
    ];
    return arts[idx % arts.length];
};

interface FilmStatic {
    flag: string;
    author: string;
    gradient: string;
}

const FILMS_STATIC: FilmStatic[] = [
    { flag: "🇫🇷", author: "Léa Fontaine", gradient: "from-aurora/60 via-[#0a1628]" },
    { flag: "🇺🇸", author: "Brad Pitt · Tom Cruise", gradient: "from-orange-600/60 via-[#1a0800]" },
    { flag: "🇯🇵", author: "Kenji Ito", gradient: "from-solar/50 via-[#1a1400]" },
    { flag: "🇪🇸", author: "Carlos Ruiz", gradient: "from-coral/60 via-[#280a0a]" },
    { flag: "🇮🇳", author: "Priya Mehta", gradient: "from-blue-500/60 via-[#0a1428]" },
    { flag: "🇸🇳", author: "Omar Diallo", gradient: "from-emerald-500/60 via-[#0a2814]" },
    { flag: "🇸🇪", author: "Sofia Ek", gradient: "from-pink-500/60 via-[#280a1e]" },
    { flag: "🇨🇳", author: "Lin Wei", gradient: "from-indigo-500/60 via-[#0a0a28]" },
    { flag: "🇧🇷", author: "Yuki Tanaka", gradient: "from-orange-500/60 via-[#281400]" },
    { flag: "🇩🇪", author: "Mia Schultz", gradient: "from-teal-500/60 via-[#0a2828]" },
    { flag: "🇰🇷", author: "Ji-young Park", gradient: "from-aurora/50 via-[#0a1e28]" },
    { flag: "🇧🇷", author: "Valentina Costa", gradient: "from-lavande/50 via-[#1e0a28]" },
    { flag: "🇲🇦", author: "Yasmine El Fassi", gradient: "from-solar/45 via-[#281e00]" },
    { flag: "🇺🇸", author: "Alex Chen", gradient: "from-coral/50 via-[#280a14]" },
    { flag: "🇮🇹", author: "Marco Ferretti", gradient: "from-blue-400/60 via-[#00141e]" },
    { flag: "🇳🇬", author: "Chioma Adeyemi", gradient: "from-emerald-400/60 via-[#001e0a]" },
    { flag: "🇷🇺", author: "Anastasia Volkov", gradient: "from-pink-400/60 via-[#1e0014]" },
    { flag: "🇦🇺", author: "Noah Williams", gradient: "from-indigo-400/60 via-[#00001e]" },
    { flag: "🇵🇱", author: "Maja Kowalski", gradient: "from-orange-400/60 via-[#1e0a00]" },
    { flag: "🇲🇽", author: "Diego Hernández", gradient: "from-teal-400/60 via-[#001e1e]" },
];

const VISIBLE_COUNT = 6;

const FilmHero = ({ film, videoSrc }: FilmHeroProps): React.JSX.Element => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { t } = useTranslation();

    useEffect((): void => {
        videoRef.current?.load();
        videoRef.current?.play().catch((): void => {});
    }, [videoSrc]);

    const handleWatch = (): void => {
        window.open(videoSrc, "_blank");
    };

    return (
        <div
            className="relative w-full overflow-hidden"
            style={{ height: "clamp(300px, 52vw, 520px)" }}
        >
            {/* Vidéo de fond — sans effet */}
            <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                aria-hidden="true"
            >
                <source src={videoSrc} type="video/mp4" />
            </video>

            {/* Fondu bas uniquement pour lisibilité du texte */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Contenu */}
            <div className="absolute inset-0 flex flex-col justify-end px-12 pb-10 max-w-2xl [text-shadow:0_1px_8px_rgba(0,0,0,0.9)]">
                <div className="flex items-center gap-2 mb-4">
                    <span className="font-display font-black text-aurora text-base leading-none">
                        M
                    </span>
                    <span className="font-mono text-[10px] text-white/40 uppercase tracking-[0.2em]">
                        Festival
                    </span>
                </div>

                <h3 className="font-display text-5xl lg:text-6xl font-black text-white leading-none mb-4">
                    {film.title}
                </h3>

                <div className="flex items-center flex-wrap gap-2 mb-3">
                    <span className="text-[#46d369] font-semibold text-sm">
                        {t("films.officialSelection")}
                    </span>
                    <span className="text-white/30">·</span>
                    <span className="text-white/50 text-sm">2026</span>
                    {["IA", "60s", "4K"].map((tag) => (
                        <span
                            key={tag}
                            className="border border-white/30 text-white/50 font-mono text-[11px] px-1.5 py-px rounded-sm"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <p className="text-white/55 text-sm mb-3">
                    {film.flag} <strong className="text-white/80">{film.author}</strong> ·{" "}
                    {film.country}
                </p>

                <p className="text-white/50 text-sm mb-6 leading-relaxed max-w-md line-clamp-2">
                    {film.synopsis}
                </p>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={handleWatch}
                        className="flex items-center gap-2 bg-white text-black font-bold text-sm px-7 py-2.5 rounded hover:bg-white/90 transition-colors"
                    >
                        <span aria-hidden="true">▶</span> {t("films.watch")}
                    </button>
                </div>
            </div>
        </div>
    );
};

const FilmCard = ({ film, filmIdx, isSelected, onSelect }: FilmCardProps): React.JSX.Element => (
    <div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>): void => {
            if (e.key === "Enter" || e.key === " ") onSelect();
        }}
        className="group flex-shrink-0 flex-1 min-w-0 cursor-pointer transition-transform duration-200 hover:scale-[1.05] hover:z-10 relative"
        aria-pressed={isSelected}
    >
        <div
            className={`aspect-video relative overflow-hidden rounded-sm transition-all duration-150 ${
                isSelected ? "ring-2 ring-white" : "hover:ring-1 hover:ring-white/40"
            }`}
        >
            {/* Affiche SVG */}
            {getPosterArt(filmIdx)}

            {/* Badge M */}
            <div className="absolute top-1.5 left-2 font-display font-black text-aurora text-xs leading-none select-none z-10">
                M
            </div>

            {/* Durée */}
            <span className="absolute top-1.5 right-2 font-mono text-[10px] text-white/55 bg-black/60 rounded px-1.5 py-px z-10">
                1:00
            </span>

            {/* Bouton play */}
            <div
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-150 z-10 ${
                    isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
            >
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-xl">
                    <span className="text-black text-xs font-bold ml-0.5" aria-hidden="true">
                        ▶
                    </span>
                </div>
            </div>

            {/* Gradient bas */}
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/80 to-transparent z-10" />

            {/* Titre overlaid */}
            <div className="absolute bottom-1.5 left-2 right-2 z-10">
                <div className="text-white text-[11px] font-bold truncate drop-shadow">
                    {film.title}
                </div>
            </div>
        </div>

        {isSelected && (
            <div className="mt-2 px-0.5">
                <div className="font-mono text-[11px] text-white/40 truncate">
                    {film.flag} {film.country}
                </div>
            </div>
        )}
    </div>
);

const FilmsSection = (): React.JSX.Element => {
    const [selectedIdx, setSelectedIdx] = useState<number>(0);
    const [rowStart, setRowStart] = useState<number>(0);
    const { t } = useTranslation();

    const filmItems = t("films.items", { returnObjects: true }) as Record<
        string,
        { title: string; country: string; synopsis: string }
    >;

    const ALL_FILMS: Film[] = FILMS_STATIC.map((s, i) => ({
        flag: s.flag,
        author: s.author,
        gradient: s.gradient,
        title: filmItems[String(i)]?.title ?? "",
        country: filmItems[String(i)]?.country ?? "",
        synopsis: filmItems[String(i)]?.synopsis ?? "",
    }));

    const selectedFilm = ALL_FILMS[selectedIdx];
    const currentVideoSrc = selectedIdx % 2 === 0 ? videoAsset : videoPlayback;
    const canPrev = rowStart > 0;
    const canNext = rowStart + VISIBLE_COUNT < ALL_FILMS.length;
    const totalPages = Math.ceil(ALL_FILMS.length / VISIBLE_COUNT);
    const currentPage = Math.floor(rowStart / VISIBLE_COUNT);

    const handlePrev = (): void => {
        setRowStart((prev) => Math.max(0, prev - VISIBLE_COUNT));
    };

    const handleNext = (): void => {
        setRowStart((prev) => Math.min(ALL_FILMS.length - VISIBLE_COUNT, prev + VISIBLE_COUNT));
    };

    const handleSelect = (absoluteIdx: number): void => {
        setSelectedIdx(absoluteIdx);
    };

    return (
        <section id="films" className="bg-black">
            {/* Hero vidéo du film sélectionné */}
            <FilmHero film={selectedFilm} videoSrc={currentVideoSrc} />

            {/* Rangée de films */}
            <div className="pt-6 pb-10">
                {/* Label */}
                <div className="flex items-center gap-3 mb-4 px-12">
                    <span className="text-sm font-bold text-white">{t("films.competition")}</span>
                    <span className="font-mono text-xs text-aurora/70">{t("films.overline")}</span>
                </div>

                {/* Carousel */}
                <div className="relative group/row">
                    {/* Bouton gauche — Netflix style */}
                    <button
                        onClick={handlePrev}
                        disabled={!canPrev}
                        aria-label={t("films.prevLabel")}
                        className="absolute left-0 top-0 bottom-0 z-20 w-14 flex items-center justify-center bg-gradient-to-r from-black/90 via-black/50 to-transparent opacity-0 group-hover/row:opacity-100 disabled:!opacity-0 transition-opacity duration-200 focus-visible:outline-none"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            className="w-9 h-9 text-white drop-shadow-lg"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>

                    {/* Piste sliding — overflow-hidden clipping */}
                    <div className="overflow-hidden px-12">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{
                                width: `${(ALL_FILMS.length / VISIBLE_COUNT) * 100}%`,
                                transform: `translateX(-${(rowStart / ALL_FILMS.length) * 100}%)`,
                            }}
                        >
                            {ALL_FILMS.map((film, i) => (
                                <div
                                    key={film.title}
                                    className="flex-shrink-0 px-1"
                                    style={{ width: `${100 / ALL_FILMS.length}%` }}
                                >
                                    <FilmCard
                                        film={film}
                                        filmIdx={i}
                                        isSelected={i === selectedIdx}
                                        onSelect={(): void => handleSelect(i)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bouton droit — Netflix style */}
                    <button
                        onClick={handleNext}
                        disabled={!canNext}
                        aria-label={t("films.nextLabel")}
                        className="absolute right-0 top-0 bottom-0 z-20 w-14 flex items-center justify-center bg-gradient-to-l from-black/90 via-black/50 to-transparent opacity-0 group-hover/row:opacity-100 disabled:!opacity-0 transition-opacity duration-200 focus-visible:outline-none"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            className="w-9 h-9 text-white drop-shadow-lg"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>
                </div>

                {/* Indicateurs de page */}
                <div className="flex justify-end gap-1 mt-3 px-12">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <div
                            key={i}
                            className={`h-0.5 rounded-full transition-all duration-300 ${
                                currentPage === i ? "w-5 bg-aurora" : "w-2 bg-white/25"
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FilmsSection;
