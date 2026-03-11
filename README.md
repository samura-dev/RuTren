<div align="center">
  <img src="https://raw.githubusercontent.com/samura-dev/RuTren/main/public/rutren-logo.webp" alt="RuTren Logo" width="120" />
  <h1 align="center">RuTren TMA</h1>
  <p align="center">
    <strong>Премиальный фитнес-трекер в Telegram. Твой идеальный тренировочный дневник.</strong>
  </p>
  
  <p align="center">
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite%207-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
    <a href="https://firebase.google.com/"><img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=white" alt="Firebase" /></a>
  </p>
</div>

---

## ✦ Обзор проекта

**RuTren** — это прогрессивное веб-приложение (PWA) и полноценный Telegram Mini App (TMA), созданное для отслеживания тренировок. Мы верим, что запись подходов должна быть быстрой, красивой и приносящей мотивацию, а не рутинной таблицей. 

Дизайн вдохновлен современным Glassmorphism и Neumorphism: глубокие тени, матовое стекло, плавные 60fps Framer Motion анимации и фирменный акцентный цвет `Neon Rose (#FF5D8F)`.

### ✨ Ключевые фичи

- **Абсолютная интеграция с Telegram** — запускается в один клик прямо из мессенджера, не нужно скачивать отдельные приложения.
- **Интеллектуальная библиотека** — умный поиск по тысячам упражнений с фильтрацией по мышечным группам.
- **Мгновенная запись подходов** — никаких лишних кликов, только фокус на весах и повторениях.
- **Оффлайн-режим (First-class)** — тренажерные залы часто бывают в подвалах без интернета. RuTren умеет сохранять данные локально и синхронизироваться, как только появится сеть.
- **Premium UI/UX** — Vercel-like анимации, полупрозрачные карточки и идеальная отзывчивость на тапы.

---

## 🛠 Технологический Стандарт

Стек проекта отобран для максимального performance и комфорта разработчика (Developer Experience):

- **Core:** React 19 + TypeScript + Vite 7
- **Стэйт-менеджмент:** Zustand `v5+`
- **Анимации & Взаимодействия:** Framer Motion
- **База данных & Бэкенд:** Firebase (Firestore, Auth, Hosting)
- **Стилизация:** Профессиональные CSS Modules с премиальным Glassmorphism.
- **Иконки:** Lucide React

---

## 🚀 Быстрый старт

Убедись, что установлен **Node.js 18+**.

1. **Забери репозиторий:**
   ```bash
   git clone https://github.com/samura-dev/RuTren.git
   cd RuTren
   ```

2. **Установи зависимости:**
   ```bash
   npm install
   ```

3. **Запусти локальный сервер:**
   ```bash
   npm run dev
   ```
   > Приложение будет доступно на `http://localhost:5173`. 
   > Для эмуляции TMA можешь использовать [Telegram Web](https://web.telegram.org) или локальные dev-тулы.

---

## 📁 Архитектура папок

Мы придерживаемся строгой Clean Code архитектуры:
- `/src/components` — Shared UI компоненты (Glass Cards, Buttons)
- `/src/features` — Изолированные фичи (Тренировки, Профиль)
- `/src/stores` — Глобальные стейты Zustand
- `/src/styles` — Глобальные токены и миксины (Neon Rose config)

---

<div align="center">
  <p><strong>Developed by Даниил (<a href="https://github.com/samura-dev">@samura-dev</a>)</strong></p>
  <p><em>Проприетарное ПО. Все права защищены © 2026.</em></p>
</div>
