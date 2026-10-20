# Slazete — Art Commission Website Design

Date: 2026-10-19
Status: Approved by user

## Overview

A manga-styled (black/white/gray) commission website for the artist "slazete", built with Vite + React + TypeScript.

## Stack

- Vite + React + TypeScript
- react-router-dom (2 pages)
- Tailwind CSS v4 (@tailwindcss/vite)
- framer-motion (portfolio carousel)
- lucide-react (icons)
- Google Fonts: Anton (display) + Space Grotesk (body)

## Theme

- Pure monochrome: ink #0a0a0a, paper #fafafa, mid grays
- Halftone/screentone dot textures, thick manga-panel borders with hard offset shadows, speed lines in hero
- Section headers styled as manga "chapters" (CHAPTER 01 — PRICELIST)
- Speech-bubble badges, ink underlines

## Pages

### Home (/)
- Navbar: black bar, slazete_logo_white.png, links Home/Order
- Hero: halftone + speed-line background, slazete_logo_nobg.png centerpiece, CTA to /order
- Portfolio: fan-deck carousel (3 visible cards — center upright in front, sides rotated behind), prev/next + dots. Card placeholders styled like reference image ("illustration soon!"). Data lives in src/data/portfolio.ts for easy swapping with real art.

### Order (/order)
- Will draw / Won't draw badges
- Base price table (type x IDR x USD) + extras list (from commission sheet)
- Terms panels: General / Commission / Payment
- Order form: name, currency toggle (IDR/USD), type select, add-on checkboxes, commercial x2, rush +50%, brief textarea
- Live price estimate + "Send via WhatsApp" -> wa.me/{number}?text={encoded message}

## Config

- `src/config.ts`: WHATSAPP_NUMBER placeholder `6281234567890`, artist name, socials — single place to edit.

## Pricing rules (from commission sheet)

- Base: headshot 150K IDR/$50, half body 300K/$70, full body 500K/$90
- Background 20-100K / $5-40, animal 40-100K / $8-25
- Additional character +80% base, accessories +20-100K / $5-25, private +50K / $20, PSD +25K / $10, major revision 20-50K / $10-20
- Commercial x2, rush +50%
