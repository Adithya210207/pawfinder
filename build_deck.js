/* PawFinder — engineering project presentation (15 slides).
   Academic format: abstract → problem → solution → architecture → modules
   → implementation → results → conclusion.
   On-brand with the app: near-black surfaces, signature green accent,
   emoji iconography. Installed fonts only (Trebuchet MS / Segoe UI). */
const pptxgen = require("pptxgenjs");

const p = new pptxgen();
p.defineLayout({ name: "W", width: 13.333, height: 7.5 });
p.layout = "W";
p.author = "PawFinder Team — CSE-A";
p.title = "PawFinder — Mini Project Presentation";

const W = 13.333, H = 7.5, MX = 0.7;

// ── palette (from the app's CSS custom properties) ──
const BG    = "0A0A0E";
const BG2   = "070709";
const CARD  = "14141B";
const CARD2 = "1B1B23";
const BORD  = "2A2A35";
const INK   = "F3F3F8";
const SUB   = "AEAEBE";
const MUTE  = "6A6A7C";
const GREEN = "4ADE80";
const GREENL= "86EFAC";
const BLUE  = "60A5FA";
const RED   = "F87171";
const ORANGE= "FBBF24";
const PURPLE= "C084FC";
const PINK  = "F472B6";
const HEAD = "Trebuchet MS", BODY = "Segoe UI";

const tints = {
  green:  { bg: "10211A", bd: "1F3D2B", fg: GREEN },
  blue:   { bg: "111A2B", bd: "203150", fg: BLUE },
  red:    { bg: "23151A", bd: "3C2229", fg: RED },
  orange: { bg: "231F12", bd: "3C331C", fg: ORANGE },
  purple: { bg: "1B1626", bd: "2F2442", fg: PURPLE },
  pink:   { bg: "241622", bd: "3C2438", fg: PINK },
  neutral:{ bg: CARD,     bd: BORD,     fg: INK },
};

const shadow = () => ({ type: "outer", color: "000000", blur: 9, offset: 3, angle: 135, opacity: 0.34 });

function bg(s, c = BG) { s.background = { color: c }; }

function glow(s, x, y, d, color, t = 93) {
  s.addShape(p.shapes.OVAL, { x, y, w: d, h: d, fill: { color, transparency: t }, line: { type: "none" } });
}

function eyebrow(s, t, x = MX, y = 0.52, c = GREEN) {
  s.addText(t.toUpperCase(), { x, y, w: 10.5, h: 0.3, fontFace: BODY, fontSize: 12.5, bold: true, color: c, charSpacing: 3, margin: 0 });
}

function title(s, t, x = MX, y = 0.83, w = 11.9, size = 33) {
  s.addText(t, { x, y, w, h: 0.92, fontFace: HEAD, fontSize: size, bold: true, color: INK, margin: 0, valign: "top" });
}

function subtitle(s, t, x = MX, y = 1.74, w = 11.0) {
  s.addText(t, { x, y, w, h: 0.6, fontFace: BODY, fontSize: 14.5, color: SUB, margin: 0, valign: "top", lineSpacingMultiple: 1.12 });
}

function footer(s, n) {
  s.addText(String(n).padStart(2, "0"), { x: MX, y: 7.06, w: 1, h: 0.3, fontFace: BODY, fontSize: 10, color: MUTE, margin: 0 });
  s.addText([{ text: "PawFinder ", options: { color: SUB } }, { text: "🐾", options: {} }],
    { x: W - MX - 2.4, y: 7.06, w: 2.4, h: 0.3, fontFace: BODY, fontSize: 10.5, bold: true, align: "right", margin: 0 });
}

function card(s, x, y, w, h, fill = CARD, line = BORD, rad = 0.13, sh = false) {
  const o = { x, y, w, h, fill: { color: fill }, line: { color: line, width: 1 }, rectRadius: rad };
  if (sh) o.shadow = shadow();
  s.addShape(p.shapes.ROUNDED_RECTANGLE, o);
}

function badge(s, x, y, sz, emoji, tint) {
  s.addShape(p.shapes.ROUNDED_RECTANGLE, { x, y, w: sz, h: sz, fill: { color: tint.bg }, line: { color: tint.bd, width: 1 }, rectRadius: 0.1 });
  s.addText(emoji, { x, y, w: sz, h: sz, fontSize: sz * 26, align: "center", valign: "middle", margin: 0 });
}

function chip(s, x, y, w, t, fg = SUB, bgc = CARD2, bd = BORD, fs = 12) {
  s.addShape(p.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 0.42, fill: { color: bgc }, line: { color: bd, width: 1 }, rectRadius: 0.21 });
  s.addText(t, { x, y, w, h: 0.42, fontFace: BODY, fontSize: fs, bold: true, color: fg, align: "center", valign: "middle", margin: 0 });
}

// feature row: emoji badge + bold head + description
function featureRow(s, x, y, w, emoji, head, desc, tint) {
  const bs = 0.62;
  badge(s, x, y, bs, emoji, tint);
  const tx = x + bs + 0.26, tw = w - bs - 0.26;
  s.addText(head, { x: tx, y: y - 0.02, w: tw, h: 0.34, fontFace: HEAD, fontSize: 15.5, bold: true, color: INK, margin: 0, valign: "top" });
  s.addText(desc, { x: tx, y: y + 0.32, w: tw, h: 0.5, fontFace: BODY, fontSize: 12, color: SUB, margin: 0, valign: "top", lineSpacingMultiple: 1.1 });
}

// numbered objective / point row
function numRow(s, x, y, w, num, head, desc, tint) {
  s.addShape(p.shapes.ROUNDED_RECTANGLE, { x, y, w: 0.56, h: 0.56, fill: { color: tint.bg }, line: { color: tint.bd, width: 1 }, rectRadius: 0.1 });
  s.addText(num, { x, y, w: 0.56, h: 0.56, fontFace: HEAD, fontSize: 17, bold: true, color: tint.fg, align: "center", valign: "middle", margin: 0 });
  const tx = x + 0.56 + 0.24, tw = w - 0.56 - 0.24;
  s.addText(head, { x: tx, y: y - 0.01, w: tw, h: 0.32, fontFace: HEAD, fontSize: 14.5, bold: true, color: INK, margin: 0, valign: "top" });
  s.addText(desc, { x: tx, y: y + 0.3, w: tw, h: 0.42, fontFace: BODY, fontSize: 11.5, color: SUB, margin: 0, valign: "top", lineSpacingMultiple: 1.1 });
}

/* ───────────────────────── 1 · TITLE CARD ───────────────────────── */
{
  const s = p.addSlide(); bg(s, BG2);
  glow(s, 9.7, -1.8, 5.6, GREEN, 90);
  glow(s, -1.7, 4.6, 4.4, BLUE, 94);
  s.addText("🐾", { x: 10.5, y: 0.62, w: 2.2, h: 2.2, fontSize: 84, align: "center", valign: "middle", margin: 0 });
  eyebrow(s, "Mini-project presentation", 0.95, 1.28);
  s.addText("PawFinder", { x: 0.9, y: 1.66, w: 9.2, h: 1.25, fontFace: HEAD, fontSize: 62, bold: true, color: INK, margin: 0 });
  s.addText("A local web platform to adopt, foster and volunteer for Coimbatore's rescue dogs.",
    { x: 0.95, y: 2.96, w: 8.4, h: 0.85, fontFace: BODY, fontSize: 17, color: SUB, margin: 0, lineSpacingMultiple: 1.2 });

  // ── team panel ──
  const tx = 0.9, ty = 4.06, tw = W - 1.8, th = 2.66;
  card(s, tx, ty, tw, th, CARD, BORD, 0.14, true);
  s.addText("PROJECT TEAM", { x: tx + 0.36, y: ty + 0.26, w: 4, h: 0.3, fontFace: BODY, fontSize: 12, bold: true, color: GREEN, charSpacing: 2, margin: 0 });
  s.addText("CSE-A  ·  FIRST YEAR", { x: tx + tw - 4.36, y: ty + 0.26, w: 4, h: 0.3, fontFace: BODY, fontSize: 12, bold: true, color: SUB, charSpacing: 2, align: "right", margin: 0 });
  s.addShape(p.shapes.LINE, { x: tx + 0.36, y: ty + 0.66, w: tw - 0.72, h: 0, line: { color: BORD, width: 1 } });

  const team = [
    ["Abi Sree", "25BCS007"],
    ["Abinaya", "25BCS008"],
    ["Adithya", "25BCS016"],
    ["Ashwin", "25BCS043"],
    ["Bharanee Tharan", "25BCS053"],
  ];
  const innerX = tx + 0.36, innerW = tw - 0.72, gap = 0.18;
  const mw = (innerW - gap * (team.length - 1)) / team.length;
  const my = ty + 0.92, mh = 1.5;
  team.forEach(([name, roll], i) => {
    const x = innerX + i * (mw + gap);
    s.addShape(p.shapes.ROUNDED_RECTANGLE, { x, y: my, w: mw, h: mh, fill: { color: CARD2 }, line: { color: BORD, width: 1 }, rectRadius: 0.1 });
    s.addText("👤", { x, y: my + 0.18, w: mw, h: 0.42, fontSize: 18, align: "center", valign: "middle", margin: 0 });
    s.addText(name, { x: x + 0.08, y: my + 0.62, w: mw - 0.16, h: 0.5, fontFace: HEAD, fontSize: 13, bold: true, color: INK, align: "center", valign: "top", margin: 0, lineSpacingMultiple: 1.0 });
    s.addText(roll, { x: x + 0.08, y: my + mh - 0.36, w: mw - 0.16, h: 0.3, fontFace: BODY, fontSize: 11.5, bold: true, color: GREEN, align: "center", margin: 0 });
  });
  s.addText("DOG ADOPTION  ·  FOSTER  ·  VOLUNTEER PLATFORM", { x: 0.95, y: 6.92, w: 9, h: 0.3, fontFace: BODY, fontSize: 10.5, bold: true, color: MUTE, charSpacing: 2, margin: 0 });
}

/* ───────────────────────── 2 · ABSTRACT ───────────────────────── */
{
  const s = p.addSlide(); bg(s);
  eyebrow(s, "01 · Abstract");
  title(s, "What is PawFinder?");
  subtitle(s, "A one-paragraph view of the project — the problem it targets and the solution it delivers.");
  const cy = 2.62, ch = 4.0;
  const lw = 7.3;
  card(s, MX, cy, lw, ch, CARD, BORD, 0.13, true);
  s.addText("📝  Abstract", { x: MX + 0.4, y: cy + 0.32, w: lw - 0.8, h: 0.4, fontFace: HEAD, fontSize: 18, bold: true, color: INK, margin: 0 });
  s.addText(
    "PawFinder is a web-based platform that brings dog adoption, fostering and volunteering for the city of Coimbatore into one trusted application. It connects citizens with verified local shelters, replaces scattered paper-and-phone processes with a guided, status-tracked workflow, and lets people stay involved as adopters, fosters or volunteers — all packaged as a self-contained desktop application.",
    { x: MX + 0.4, y: cy + 0.86, w: lw - 0.8, h: ch - 1.2, fontFace: BODY, fontSize: 13.5, color: SUB, margin: 0, valign: "top", lineSpacingMultiple: 1.32 });

  const rx = MX + lw + 0.32, rw = W - MX - rx;
  const meta = [
    ["🎯", "Domain", "Animal welfare · civic tech", tints.green],
    ["💻", "Type", "Full-stack web application", tints.blue],
    ["📍", "Scope", "Coimbatore, Tamil Nadu", tints.orange],
    ["👥", "Users", "Adopters · fosters · volunteers · shelters", tints.purple],
  ];
  const bh = (ch - 3 * 0.22) / 4;
  meta.forEach((m, i) => {
    const y = cy + i * (bh + 0.22);
    card(s, rx, y, rw, bh, m[3].bg, m[3].bd, 0.12);
    s.addText(m[0], { x: rx + 0.26, y, w: 0.6, h: bh, fontSize: 17, align: "center", valign: "middle", margin: 0 });
    s.addText(m[1].toUpperCase(), { x: rx + 0.92, y: y + 0.16, w: rw - 1.1, h: 0.28, fontFace: BODY, fontSize: 10.5, bold: true, color: m[3].fg, charSpacing: 1.5, margin: 0 });
    s.addText(m[2], { x: rx + 0.92, y: y + 0.42, w: rw - 1.1, h: bh - 0.5, fontFace: BODY, fontSize: 11.5, color: INK, margin: 0, valign: "top", lineSpacingMultiple: 1.05 });
  });
  footer(s, 2);
}

/* ───────────────────────── 3 · INTRODUCTION ───────────────────────── */
{
  const s = p.addSlide(); bg(s);
  eyebrow(s, "02 · Introduction");
  title(s, "Background & motivation");
  subtitle(s, "Why a dedicated platform for dog adoption is needed in a city like Coimbatore.");
  const lx = MX, lw = 7.2, ry = 2.66;
  const rows = [
    ["🐕", "Many dogs, few homes", "Street and shelter dogs across the city wait months for a family.", tints.orange],
    ["📵", "Shelters work offline", "Most rescues run on phone calls, walk-ins and WhatsApp groups.", tints.red],
    ["🙂", "Willing adopters exist", "People want to adopt, foster or help — but have no single channel.", tints.green],
    ["📲", "Everything is digital now", "A familiar app-like experience can remove the friction entirely.", tints.blue],
  ];
  rows.forEach((r, i) => featureRow(s, lx, ry + i * 1.02, lw, r[0], r[1], r[2], r[3]));

  const dx = 8.35, dw = W - MX - dx, dy = 2.6, dh = 4.05;
  card(s, dx, dy, dw, dh, tints.green.bg, tints.green.bd, 0.14, true);
  s.addText("THE GAP", { x: dx + 0.34, y: dy + 0.3, w: dw - 0.68, h: 0.3, fontFace: BODY, fontSize: 11.5, bold: true, color: GREEN, charSpacing: 2, margin: 0 });
  s.addText("Goodwill exists. A trusted, organised channel to act on it does not.",
    { x: dx + 0.34, y: dy + 0.66, w: dw - 0.68, h: 1.5, fontFace: HEAD, fontSize: 19, bold: true, color: INK, margin: 0, valign: "top", lineSpacingMultiple: 1.15 });
  s.addShape(p.shapes.LINE, { x: dx + 0.34, y: dy + 2.32, w: dw - 0.68, h: 0, line: { color: tints.green.bd, width: 1 } });
  s.addText("PawFinder is built to close that gap with one local, end-to-end platform.",
    { x: dx + 0.34, y: dy + 2.52, w: dw - 0.68, h: 1.3, fontFace: BODY, fontSize: 13, color: SUB, margin: 0, valign: "top", lineSpacingMultiple: 1.25 });
  footer(s, 3);
}

/* ───────────────────────── 4 · PROBLEM STATEMENT ───────────────────────── */
{
  const s = p.addSlide(); bg(s);
  eyebrow(s, "03 · Problem Statement");
  title(s, "Adoption in Coimbatore is broken");
  subtitle(s, "The path from “I want to adopt” to a dog at home is scattered, offline and opaque.");
  const cy = 2.6, ch = 2.55, cw = (W - 2 * MX - 2 * 0.3) / 3;
  const probs = [
    ["🔍", "Discovery is hard", "No single place to browse dogs across local shelters with real filters.", tints.red],
    ["📋", "The process is opaque", "Paper forms and phone calls — applicants never know where they stand.", tints.orange],
    ["🤝", "Help is fragmented", "Fostering and volunteering run on informal, untracked WhatsApp threads.", tints.purple],
  ];
  probs.forEach((pr, i) => {
    const x = MX + i * (cw + 0.3);
    card(s, x, cy, cw, ch, CARD, BORD, 0.12, true);
    badge(s, x + 0.34, cy + 0.34, 0.66, pr[0], pr[3]);
    s.addText(pr[1], { x: x + 0.34, y: cy + 1.2, w: cw - 0.68, h: 0.45, fontFace: HEAD, fontSize: 18, bold: true, color: INK, margin: 0 });
    s.addText(pr[2], { x: x + 0.34, y: cy + 1.66, w: cw - 0.68, h: 0.8, fontFace: BODY, fontSize: 12.5, color: SUB, margin: 0, lineSpacingMultiple: 1.18 });
  });
  const by = cy + ch + 0.3;
  card(s, MX, by, W - 2 * MX, 1.16, tints.red.bg, tints.red.bd, 0.12);
  s.addText("❗", { x: MX + 0.34, y: by, w: 0.7, h: 1.16, fontSize: 22, align: "center", valign: "middle", margin: 0 });
  s.addText([
    { text: "Core problem   ", options: { bold: true, color: RED, fontFace: HEAD, fontSize: 15 } },
    { text: "There is no single, trusted, local system that connects adopters, fosters and volunteers with verified shelters — and tracks every step.", options: { color: INK, fontFace: BODY, fontSize: 14 } },
  ], { x: MX + 1.05, y: by, w: W - 2 * MX - 1.4, h: 1.16, valign: "middle", margin: 0, lineSpacingMultiple: 1.15 });
  footer(s, 4);
}

/* ───────────────────────── 5 · EXISTING SYSTEM ───────────────────────── */
{
  const s = p.addSlide(); bg(s);
  eyebrow(s, "04 · Existing System");
  title(s, "How it works today — and where it fails");
  subtitle(s, "Adoption currently runs on a patchwork of manual, disconnected channels.");
  const cy = 2.62, ch = 4.05, cw = (W - 2 * MX - 0.32) / 2;
  const lx = MX;
  card(s, lx, cy, cw, ch, CARD, BORD, 0.13, true);
  s.addText("🔧  Current approach", { x: lx + 0.36, y: cy + 0.3, w: cw - 0.72, h: 0.4, fontFace: HEAD, fontSize: 17, bold: true, color: INK, margin: 0 });
  const cur = [
    ["📞", "Phone calls & walk-ins to shelters"],
    ["💬", "WhatsApp & Instagram rescue groups"],
    ["📄", "Paper application forms"],
    ["🗂️", "Records kept in personal notebooks"],
    ["🗣️", "Foster / volunteer help by word of mouth"],
  ];
  let yy = cy + 0.92;
  cur.forEach(([e, t]) => {
    s.addText(e, { x: lx + 0.36, y: yy, w: 0.5, h: 0.5, fontSize: 14, align: "center", valign: "middle", margin: 0 });
    s.addText(t, { x: lx + 0.92, y: yy, w: cw - 1.28, h: 0.5, fontFace: BODY, fontSize: 12.5, color: SUB, valign: "middle", margin: 0 });
    yy += 0.6;
  });
  const rx = lx + cw + 0.32;
  card(s, rx, cy, cw, ch, tints.red.bg, tints.red.bd, 0.13, true);
  s.addText("⚠️  Limitations", { x: rx + 0.36, y: cy + 0.3, w: cw - 0.72, h: 0.4, fontFace: HEAD, fontSize: 17, bold: true, color: RED, margin: 0 });
  const lim = [
    ["No central discovery of available dogs"],
    ["No application status — applicants left guessing"],
    ["No verified, reliable shelter directory"],
    ["No tracking of foster cases or volunteers"],
    ["Manual, slow and error-prone for everyone"],
  ];
  let ly = cy + 0.92;
  lim.forEach(([t]) => {
    s.addText("✗", { x: rx + 0.36, y: ly, w: 0.4, h: 0.5, fontFace: HEAD, fontSize: 14, bold: true, color: RED, align: "center", valign: "middle", margin: 0 });
    s.addText(t, { x: rx + 0.84, y: ly, w: cw - 1.2, h: 0.5, fontFace: BODY, fontSize: 12.5, color: INK, valign: "middle", margin: 0 });
    ly += 0.6;
  });
  footer(s, 5);
}

/* ───────────────────────── 6 · PROPOSED SOLUTION ───────────────────────── */
{
  const s = p.addSlide(); bg(s);
  eyebrow(s, "05 · Proposed Solution");
  title(s, "One local hub for the whole journey");
  subtitle(s, "PawFinder unifies discovery, application and ongoing involvement in a single app.");
  const items = [
    ["🐕", "Adopt", "Browse, filter & favourite dogs with rich health profiles.", tints.green],
    ["📋", "Apply", "A guided multi-step application with live status.", tints.blue],
    ["🏠", "Foster", "Short-term homes, flagged by urgency & shelter need.", tints.orange],
    ["🙋", "Volunteer", "Roles, events and a paw-points leaderboard.", tints.purple],
    ["💬", "Connect", "Verified shelters, chat and a pet-care library.", tints.pink],
  ];
  const n = items.length, g = 0.24, cw = (W - 2 * MX - (n - 1) * g) / n, cy = 2.62, ch = 3.0;
  items.forEach((it, i) => {
    const x = MX + i * (cw + g);
    card(s, x, cy, cw, ch, CARD, BORD, 0.13, true);
    badge(s, x + (cw - 0.7) / 2, cy + 0.36, 0.7, it[0], it[3]);
    s.addText(it[1], { x: x + 0.12, y: cy + 1.26, w: cw - 0.24, h: 0.4, fontFace: HEAD, fontSize: 18, bold: true, color: it[3].fg, align: "center", margin: 0 });
    s.addText(it[2], { x: x + 0.2, y: cy + 1.72, w: cw - 0.4, h: 1.2, fontFace: BODY, fontSize: 11.5, color: SUB, align: "center", margin: 0, lineSpacingMultiple: 1.2 });
  });
  const by = cy + ch + 0.26;
  card(s, MX, by, W - 2 * MX, 0.96, tints.green.bg, tints.green.bd, 0.12);
  s.addText([
    { text: "The fix   ", options: { bold: true, color: GREEN, fontFace: HEAD, fontSize: 15 } },
    { text: "Adopters, fosters and volunteers meet verified Coimbatore shelters in one place — and every step is tracked.", options: { color: INK, fontFace: BODY, fontSize: 13.5 } },
  ], { x: MX + 0.4, y: by, w: W - 2 * MX - 0.8, h: 0.96, valign: "middle", margin: 0, lineSpacingMultiple: 1.1 });
  footer(s, 6);
}

/* ───────────────────────── 7 · OBJECTIVES ───────────────────────── */
{
  const s = p.addSlide(); bg(s);
  eyebrow(s, "06 · Objectives");
  title(s, "Project objectives");
  subtitle(s, "What the system sets out to achieve.");
  const objs = [
    ["1", "Centralise discovery", "Browse dogs across verified Coimbatore shelters with rich filters.", tints.green],
    ["2", "Track applications", "A guided, document-backed adoption flow with live status.", tints.blue],
    ["3", "Enable fostering", "Match short-term foster homes with shelter-supported logistics.", tints.orange],
    ["4", "Coordinate volunteers", "Roles, events and a recognition system that drives participation.", tints.purple],
    ["5", "Empower shelters", "A single console to manage dogs, shelters and applications.", tints.pink],
    ["6", "Run anywhere", "Deliver it as an easy-to-run, self-contained desktop app.", tints.green],
  ];
  const cw = (W - 2 * MX - 0.5) / 2, cy = 2.5, rh = 1.36;
  objs.forEach((o, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = MX + col * (cw + 0.5);
    const y = cy + row * rh;
    numRow(s, x, y, cw, o[0], o[1], o[2], o[3]);
  });
  footer(s, 7);
}

/* ───────────────────────── 8 · SYSTEM ARCHITECTURE ───────────────────────── */
{
  const s = p.addSlide(); bg(s);
  eyebrow(s, "07 · System Architecture");
  title(s, "How the system is structured");
  subtitle(s, "A three-tier web app, packaged inside an Electron desktop shell.");
  const tx = MX, tw = 8.5;
  const tiers = [
    ["🖥️", "Presentation", "Vanilla-JS single-page app — dark, mobile-first UI rendered in the browser.", tints.blue],
    ["⚙️", "Application", "Node.js + Express REST API · 9 route modules · sessions, uploads, Socket.IO.", tints.green],
    ["🗄️", "Data", "SQLite database (better-sqlite3) · seeded catalogue · uploaded documents.", tints.orange],
  ];
  let ty = 2.5;
  const tht = 1.16, conn = 0.42;
  tiers.forEach((t, i) => {
    card(s, tx, ty, tw, tht, t[3].bg, t[3].bd, 0.12, true);
    s.addText(t[0], { x: tx + 0.3, y: ty, w: 0.8, h: tht, fontSize: 24, align: "center", valign: "middle", margin: 0 });
    s.addText(t[1], { x: tx + 1.15, y: ty + 0.18, w: tw - 1.4, h: 0.36, fontFace: HEAD, fontSize: 17, bold: true, color: t[3].fg, margin: 0 });
    s.addText(t[2], { x: tx + 1.15, y: ty + 0.54, w: tw - 1.45, h: 0.52, fontFace: BODY, fontSize: 11.5, color: INK, margin: 0, valign: "top", lineSpacingMultiple: 1.05 });
    if (i < tiers.length - 1) {
      const cl = ["▼   request / response · JSON over HTTP", "▼   SQL queries via better-sqlite3"][i];
      s.addText(cl, { x: tx, y: ty + tht, w: tw, h: conn, fontFace: BODY, fontSize: 10.5, bold: true, color: MUTE, align: "center", valign: "middle", margin: 0 });
    }
    ty += tht + conn;
  });
  // right: delivery + cross-cutting
  const rx = tx + tw + 0.34, rw = W - MX - rx;
  card(s, rx, 2.5, rw, 4.16, CARD, BORD, 0.13, true);
  s.addText("📦  DELIVERY", { x: rx + 0.32, y: 2.74, w: rw - 0.64, h: 0.3, fontFace: BODY, fontSize: 11.5, bold: true, color: GREEN, charSpacing: 1.5, margin: 0 });
  s.addText("Packaged with Electron + electron-builder — installs and runs as a Windows desktop app.",
    { x: rx + 0.32, y: 3.06, w: rw - 0.64, h: 1.0, fontFace: BODY, fontSize: 12, color: SUB, margin: 0, valign: "top", lineSpacingMultiple: 1.2 });
  s.addShape(p.shapes.LINE, { x: rx + 0.32, y: 4.18, w: rw - 0.64, h: 0, line: { color: BORD, width: 1 } });
  s.addText("CROSS-CUTTING", { x: rx + 0.32, y: 4.34, w: rw - 0.64, h: 0.3, fontFace: BODY, fontSize: 11.5, bold: true, color: SUB, charSpacing: 1.5, margin: 0 });
  const cc = [["🔐", "Auth — bcrypt + sessions"], ["📤", "Uploads — Multer"], ["⚡", "Real-time — Socket.IO"]];
  let ccy = 4.68;
  cc.forEach(([e, t]) => {
    s.addText(e, { x: rx + 0.32, y: ccy, w: 0.42, h: 0.46, fontSize: 13, align: "center", valign: "middle", margin: 0 });
    s.addText(t, { x: rx + 0.78, y: ccy, w: rw - 1.1, h: 0.46, fontFace: BODY, fontSize: 11.5, color: INK, valign: "middle", margin: 0 });
    ccy += 0.56;
  });
  footer(s, 8);
}

/* ───────────────────────── 9 · TECHNOLOGY STACK ───────────────────────── */
{
  const s = p.addSlide(); bg(s);
  eyebrow(s, "08 · Technology Stack");
  title(s, "Built with");
  subtitle(s, "A lightweight, dependency-light JavaScript stack end to end.");
  const stack = [
    ["🎨", "Frontend", "HTML5 · CSS3 · Vanilla JS (SPA)", tints.blue],
    ["⚙️", "Backend", "Node.js · Express 4", tints.green],
    ["🗄️", "Database", "SQLite · better-sqlite3", tints.orange],
    ["🔐", "Security", "bcryptjs · express-session", tints.red],
    ["⚡", "Realtime & Uploads", "Socket.IO · Multer", tints.purple],
    ["📦", "Desktop", "Electron · electron-builder", tints.pink],
  ];
  const cols = 3, g = 0.3, cw = (W - 2 * MX - (cols - 1) * g) / cols, cy = 2.56, ch = 1.95;
  stack.forEach((t, i) => {
    const col = i % cols, row = Math.floor(i / cols);
    const x = MX + col * (cw + g), y = cy + row * (ch + 0.3);
    card(s, x, y, cw, ch, CARD, BORD, 0.12, true);
    badge(s, x + 0.32, y + 0.3, 0.6, t[0], t[3]);
    s.addText(t[1], { x: x + 0.32, y: y + 1.0, w: cw - 0.64, h: 0.36, fontFace: HEAD, fontSize: 16, bold: true, color: t[3].fg, margin: 0 });
    s.addText(t[2], { x: x + 0.32, y: y + 1.36, w: cw - 0.64, h: 0.46, fontFace: BODY, fontSize: 12, color: SUB, margin: 0, valign: "top", lineSpacingMultiple: 1.1 });
  });
  footer(s, 9);
}

/* ───────────────────────── 10 · MODULES ───────────────────────── */
{
  const s = p.addSlide(); bg(s);
  eyebrow(s, "09 · Modules");
  title(s, "Six core modules");
  subtitle(s, "The application is organised into independent, role-aware modules.");
  const mods = [
    ["🐕", "Adopt", "Search, filter and favourite dogs with full health profiles.", tints.green],
    ["📋", "Apply", "Multi-step application with document upload and status tracking.", tints.blue],
    ["🏠", "Foster", "Listings by urgency; one-tap registration as a foster parent.", tints.orange],
    ["🙋", "Volunteer", "Open roles, community events and a paw-points leaderboard.", tints.purple],
    ["💬", "Connect", "Verified shelter directory, shelter chat and a care library.", tints.pink],
    ["🛠️", "Admin Console", "Shelters review applications and manage dogs & directory.", tints.red],
  ];
  const cols = 3, g = 0.3, cw = (W - 2 * MX - (cols - 1) * g) / cols, cy = 2.56, ch = 1.98;
  mods.forEach((m, i) => {
    const col = i % cols, row = Math.floor(i / cols);
    const x = MX + col * (cw + g), y = cy + row * (ch + 0.3);
    card(s, x, y, cw, ch, CARD, BORD, 0.12, true);
    badge(s, x + 0.3, y + 0.3, 0.58, m[0], m[3]);
    s.addText(m[1], { x: x + 1.02, y: y + 0.34, w: cw - 1.3, h: 0.5, fontFace: HEAD, fontSize: 16.5, bold: true, color: INK, valign: "middle", margin: 0 });
    s.addText(m[2], { x: x + 0.32, y: y + 1.02, w: cw - 0.64, h: 0.84, fontFace: BODY, fontSize: 11.5, color: SUB, margin: 0, valign: "top", lineSpacingMultiple: 1.15 });
  });
  footer(s, 10);
}

/* ───────────────────────── 11 · KEY FEATURES ───────────────────────── */
{
  const s = p.addSlide(); bg(s);
  eyebrow(s, "10 · Key Features");
  title(s, "What users can do");
  subtitle(s, "The features that make the platform usable end to end.");
  const feats = [
    ["🔎", "Search & filter", "By breed, age, gender, size, vaccinated and more.", tints.green],
    ["🩺", "Rich dog profiles", "Health record, temperament, story and photos.", tints.blue],
    ["📋", "Tracked applications", "Guided steps, document upload, live status.", tints.orange],
    ["🏠", "Foster registration", "Listings by urgency with built-in FAQ.", tints.purple],
    ["🏅", "Volunteer & paw-points", "Roles, events and a monthly leaderboard.", tints.pink],
    ["🏥", "Shelters & care library", "Verified directory, chat and curated articles.", tints.green],
  ];
  const cols = 2, g = 0.5, cw = (W - 2 * MX - g) / cols, cy = 2.52, rh = 1.4;
  feats.forEach((f, i) => {
    const col = i % cols, row = Math.floor(i / cols);
    const x = MX + col * (cw + g), y = cy + row * rh;
    featureRow(s, x, y, cw, f[0], f[1], f[2], f[3]);
  });
  footer(s, 11);
}

/* ───────────────────────── 12 · IMPLEMENTATION (WORKFLOW) ───────────────────────── */
{
  const s = p.addSlide(); bg(s);
  eyebrow(s, "11 · Implementation");
  title(s, "The adoption workflow");
  subtitle(s, "The core implemented flow — guided application to adoption day.");
  // stepper
  const steps = [["1", "Info"], ["2", "Home"], ["3", "Docs"], ["4", "Review"]];
  const stx = MX, stw = W - 2 * MX, sy = 2.18, seg = stw / 4;
  steps.forEach((st, i) => {
    s.addShape(p.shapes.LINE, { x: stx + seg * i + 0.4, y: sy + 0.22, w: seg - 0.8, h: 0, line: { color: i < 3 ? BORD : "0A0A0E", width: 2 } });
  });
  steps.forEach((st, i) => {
    const cxp = stx + seg * i + seg / 2;
    s.addShape(p.shapes.OVAL, { x: cxp - 0.22, y: sy, w: 0.44, h: 0.44, fill: { color: i === 0 ? GREEN : tints.green.bg }, line: { color: tints.green.bd, width: 1 } });
    s.addText(st[0], { x: cxp - 0.22, y: sy, w: 0.44, h: 0.44, fontFace: BODY, fontSize: 13, bold: true, color: i === 0 ? "08130C" : GREEN, align: "center", valign: "middle", margin: 0 });
    s.addText(st[1], { x: cxp - 0.7, y: sy + 0.48, w: 1.4, h: 0.3, fontFace: BODY, fontSize: 12, bold: true, color: SUB, align: "center", margin: 0 });
  });
  // two content cards
  const cy = 3.18, ch = 2.05, cw = (W - 2 * MX - 0.32) / 2;
  card(s, MX, cy, cw, ch, CARD, BORD, 0.12, true);
  s.addText("📝  What the applicant fills in", { x: MX + 0.34, y: cy + 0.26, w: cw - 0.68, h: 0.36, fontFace: HEAD, fontSize: 15.5, bold: true, color: INK, margin: 0 });
  s.addText("A pre-adoption checklist, then home environment — residence, space, experience, other pets, children and hours alone.",
    { x: MX + 0.34, y: cy + 0.7, w: cw - 0.68, h: 1.25, fontFace: BODY, fontSize: 11.5, color: SUB, margin: 0, valign: "top", lineSpacingMultiple: 1.22 });
  const rx = MX + cw + 0.32;
  card(s, rx, cy, cw, ch, CARD, BORD, 0.12, true);
  s.addText("📎  What the shelter does", { x: rx + 0.34, y: cy + 0.26, w: cw - 0.68, h: 0.36, fontFace: HEAD, fontSize: 15.5, bold: true, color: INK, margin: 0 });
  s.addText("Reviews uploaded ID, address, income proof and home photos, then approves or declines from the admin console.",
    { x: rx + 0.34, y: cy + 0.7, w: cw - 0.68, h: 1.25, fontFace: BODY, fontSize: 11.5, color: SUB, margin: 0, valign: "top", lineSpacingMultiple: 1.22 });
  // timeline strip
  const ty = cy + ch + 0.26, th = 1.06;
  card(s, MX, ty, W - 2 * MX, th, tints.green.bg, tints.green.bd, 0.12);
  const tl = ["Submit", "Review · 48h", "Home visit", "Approval", "Meet & greet", "Adoption day 🎉"];
  const tseg = (W - 2 * MX) / tl.length;
  tl.forEach((t, i) => {
    s.addText([{ text: t, options: { color: i === tl.length - 1 ? GREENL : INK, bold: i === tl.length - 1 } }, ...(i < tl.length - 1 ? [{ text: "   ›", options: { color: GREEN } }] : [])],
      { x: MX + tseg * i, y: ty + 0.14, w: tseg, h: 0.38, fontFace: BODY, fontSize: 11, align: "center", valign: "middle", margin: 0 });
  });
  s.addText("Live status in “My Applications” — applicants always know where they stand.", { x: MX, y: ty + 0.54, w: W - 2 * MX, h: 0.4, fontFace: BODY, fontSize: 11.5, italic: true, color: SUB, align: "center", valign: "middle", margin: 0 });
  footer(s, 12);
}

/* ───────────────────────── 13 · RESULTS & OUTCOMES ───────────────────────── */
{
  const s = p.addSlide(); bg(s);
  eyebrow(s, "12 · Results & Outcomes");
  title(s, "What the prototype delivers");
  subtitle(s, "A working, demo-ready application with seeded local data.");
  // stat callouts
  const stats = [["8", "verified Coimbatore shelters", tints.green], ["5", "user journeys, end to end", tints.blue], ["6", "core modules implemented", tints.orange], ["1-tap", "demo access, no setup", tints.purple]];
  const g = 0.28, sw = (W - 2 * MX - 3 * g) / 4, sy = 2.56, sh = 1.7;
  stats.forEach((st, i) => {
    const x = MX + i * (sw + g);
    card(s, x, sy, sw, sh, st[2].bg, st[2].bd, 0.13, true);
    s.addText(st[0], { x: x + 0.16, y: sy + 0.22, w: sw - 0.32, h: 0.7, fontFace: HEAD, fontSize: 34, bold: true, color: st[2].fg, align: "center", margin: 0 });
    s.addText(st[1], { x: x + 0.16, y: sy + 0.96, w: sw - 0.32, h: 0.62, fontFace: BODY, fontSize: 11.5, color: INK, align: "center", margin: 0, valign: "top", lineSpacingMultiple: 1.1 });
  });
  // outcomes list
  const by = sy + sh + 0.3, bh = 1.78;
  card(s, MX, by, W - 2 * MX, bh, CARD, BORD, 0.13, true);
  s.addText("✅  Delivered", { x: MX + 0.36, y: by + 0.22, w: 3, h: 0.34, fontFace: HEAD, fontSize: 15, bold: true, color: GREEN, margin: 0 });
  const outs = [
    "End-to-end adoption flow with document upload & status tracking",
    "Role-based admin console for shelters to review & manage",
    "Seeded catalogue of dogs, foster cases, roles and care articles",
    "Self-contained desktop build — runs without internet setup",
  ];
  const ow = (W - 2 * MX - 0.72 - 0.4) / 2;
  outs.forEach((t, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = MX + 0.36 + col * (ow + 0.4), y = by + 0.66 + row * 0.5;
    s.addText("—", { x, y, w: 0.22, h: 0.42, fontFace: BODY, fontSize: 12, color: GREEN, margin: 0 });
    s.addText(t, { x: x + 0.26, y, w: ow - 0.26, h: 0.46, fontFace: BODY, fontSize: 11.5, color: INK, margin: 0, valign: "top", lineSpacingMultiple: 1.05 });
  });
  footer(s, 13);
}

/* ───────────────────────── 14 · ADVANTAGES & FUTURE SCOPE ───────────────────────── */
{
  const s = p.addSlide(); bg(s);
  eyebrow(s, "13 · Advantages & Scope");
  title(s, "Advantages & future enhancements");
  subtitle(s, "Why the approach works — and where it can go next.");
  const cy = 2.62, ch = 4.05, cw = (W - 2 * MX - 0.32) / 2;
  const lx = MX;
  card(s, lx, cy, cw, ch, tints.green.bg, tints.green.bd, 0.13, true);
  s.addText("✅  Advantages", { x: lx + 0.36, y: cy + 0.3, w: cw - 0.72, h: 0.4, fontFace: HEAD, fontSize: 17, bold: true, color: GREEN, margin: 0 });
  const adv = [
    "Centralised — one trusted place for the whole journey",
    "Transparent — every application is status-tracked",
    "Local — built around verified Coimbatore shelters",
    "Low-friction — one-tap demo, mobile-first UI",
    "Portable — runs as a self-contained desktop app",
  ];
  let ay = cy + 0.92;
  adv.forEach(t => {
    s.addText("✓", { x: lx + 0.36, y: ay, w: 0.4, h: 0.5, fontFace: HEAD, fontSize: 14, bold: true, color: GREEN, align: "center", valign: "middle", margin: 0 });
    s.addText(t, { x: lx + 0.82, y: ay, w: cw - 1.18, h: 0.5, fontFace: BODY, fontSize: 12, color: INK, valign: "middle", margin: 0 });
    ay += 0.6;
  });
  const rx = lx + cw + 0.32;
  card(s, rx, cy, cw, ch, CARD, BORD, 0.13, true);
  s.addText("🚀  Future enhancements", { x: rx + 0.36, y: cy + 0.3, w: cw - 0.72, h: 0.4, fontFace: HEAD, fontSize: 17, bold: true, color: BLUE, margin: 0 });
  const fut = [
    "Real-time chat between adopters and shelters",
    "Shelter self-onboarding and online donations",
    "Native mobile app (Android / iOS)",
    "Expand beyond Coimbatore to more cities",
    "Smart dog–adopter matching suggestions",
  ];
  let fy = cy + 0.92;
  fut.forEach(t => {
    s.addText("→", { x: rx + 0.36, y: fy, w: 0.4, h: 0.5, fontFace: HEAD, fontSize: 14, bold: true, color: BLUE, align: "center", valign: "middle", margin: 0 });
    s.addText(t, { x: rx + 0.82, y: fy, w: cw - 1.18, h: 0.5, fontFace: BODY, fontSize: 12, color: INK, valign: "middle", margin: 0 });
    fy += 0.6;
  });
  footer(s, 14);
}

/* ───────────────────────── 15 · CONCLUSION ───────────────────────── */
{
  const s = p.addSlide(); bg(s, BG2);
  glow(s, 9.9, 4.3, 4.8, GREEN, 91);
  glow(s, -1.6, -1.7, 4.2, BLUE, 94);
  eyebrow(s, "14 · Conclusion", 0.95, 0.7);
  s.addText("Giving Coimbatore's dogs a\nfaster path home", { x: 0.9, y: 1.04, w: 11.5, h: 1.6, fontFace: HEAD, fontSize: 36, bold: true, color: INK, margin: 0, lineSpacingMultiple: 1.05 });
  const cy = 2.96, ch = 2.5;
  card(s, 0.9, cy, W - 1.8, ch, CARD, BORD, 0.14, true);
  s.addText(
    "PawFinder replaces a scattered, offline process with one trusted local platform — connecting adopters, fosters and volunteers with verified Coimbatore shelters, with every step tracked, and shipped as a self-contained desktop app.",
    { x: 1.3, y: cy + 0.34, w: W - 2.6, h: 1.1, fontFace: BODY, fontSize: 15, color: SUB, margin: 0, valign: "top", lineSpacingMultiple: 1.3 });
  s.addShape(p.shapes.LINE, { x: 1.3, y: cy + 1.62, w: W - 2.6, h: 0, line: { color: BORD, width: 1 } });
  s.addText([
    { text: "Outcome   ", options: { bold: true, color: GREEN, fontFace: HEAD, fontSize: 14 } },
    { text: "a usable, demo-ready prototype that proves the concept end to end.", options: { color: INK, fontFace: BODY, fontSize: 13.5 } },
  ], { x: 1.3, y: cy + 1.78, w: W - 2.6, h: 0.5, valign: "middle", margin: 0 });
  s.addText("Thank you 🐾", { x: 0.9, y: cy + ch + 0.26, w: 7, h: 0.5, fontFace: HEAD, fontSize: 20, bold: true, color: INK, margin: 0 });
  s.addText("CSE-A  ·  First Year", { x: W - 0.9 - 5, y: cy + ch + 0.3, w: 5, h: 0.42, fontFace: BODY, fontSize: 13, bold: true, color: SUB, align: "right", charSpacing: 1.5, margin: 0 });
}

p.writeFile({ fileName: "C:/Users/Adithya v/pawfinder/PawFinder-Overview.new.pptx" })
  .then(() => console.log("WROTE PawFinder-Overview.new.pptx"))
  .catch(e => { console.error(e); process.exit(1); });
