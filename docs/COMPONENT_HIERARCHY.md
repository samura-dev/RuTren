# RuTren: Иерархия Компонентов (Component Hierarchy)

> **Назначение**: Полный список компонентов приложения, их вложенность и статус переиспользования.
> **Принцип**: Максимальная атомарность.

---

## 1. 🧱 Atoms (Базовые UI элементы)

Самые простые компоненты, из которых строится всё остальное.

- 🟢 **Button**
  - `PrimaryButton` (Лайм).
  - `GhostButton` (Текст/Прозрачный).
  - `OutlineButton` (Контур).
  - `IconButton` (Круглая иконка).
- 🟢 **Input**
  - `TextInput`.
  - `NumberInput` (С валидацией).
  - `PasswordInput` (С глазиком).
- 🟢 **Typography**
  - `PageTitle` (H1).
  - `SectionTitle` (H2).
  - `BodyText`.
  - `Caption` (Мелкий текст).
  - `Label` (Для инпутов).
- 🟢 **Icon** (Unified lucide wrapper).
- 🟢 **GlassCard** (Контейнер с blur).
- 🟢 **Avatar** (Img + Initials + StatusDot).
- 🟢 **Badge** (Статус/Тег).
- 🟢 **Switch** (Toggle).
- 🟢 **Checkbox** (Custom Tick).
- 🟢 **Divider** (Разделитель).
- 🟢 **Skeleton** (Loading state placeholder).
- 🟢 **Overlay** (Backdrop for modals).
- 🟢 **Portal** (Для рендера модалок в `body`).

---

## 2. 🧬 Molecules (Молекулы)

Сочетания атомов.

### Inputs & Forms

- 🟢 **SearchInput** (Input + Search Icon).
- 🟢 **FormInput** (Label + Input + ErrorText).
- 🟢 **GoalCard** (Icon + Title + SelectedState).
  - *Используется в Onboarding.*
- 🟢 **DayItem** (DayName + Date + StatusDot).
  - *Используется в WeeklyCalendarWidget.*

### Cards & Stats

- 🟢 **StatCard** (Icon + Label + Value + Unit).
- 🟢 **ProgramCard** (Title + ProgressBar + Status).
- 🟢 **HistoryCard** (Date + Title + StatSummary).
- 🟢 **AchievementBadge** (Icon + Title + Description).

### Listings

- 🟢 **EmptyState** (Illustration + Text + ActionButton).
- 🟢 **SectionHeader** (Title + ActionLink).
- 🟢 **FilterChip** (Selectable Button).

### Navigation

- 🟢 **BottomTabItem** (Icon + Label + ActiveDot).
- � **HeaderAction** (Right side button in header).

---

## 3. 🦀 Organisms (Организмы / Блоки)

Сложные части интерфейса.

### Global

- 🟢 **BottomNavigation** (Grid of `BottomTabItem`).
- 🟢 **Header** (BackButton + Title + Actions).
- 🟢 **ModalLayout** (Overlay + GlassCard + Content).

### Dashboard

- 🟡 **UserGreeting** (Avatar + WelcomeMessage).
- 🟡 **WeeklyCalendar** (List of `DayItem`).
- 🟡 **StatsOverview** (Grid of `StatCard`).

### Workout (Tremendous complexity here)

- 🟡 **ExerciseList** (Scrollable container).
- 🟡 **ExerciseCard** (Collapsible).
  - `CardHeader` (Title + OptionsMenu).
  - `SetList` (Container).
    - `SetRow` (Previous + Current Input).
    - `AddSetButton`.
- 🟡 **ActiveSetPanel** (Fixed Bottom Glass).
  - `WeightInput` (Huge).
  - `RepsInput` (Huge).
  - `SaveButton`.
- 🟡 **RestTimerModal** (ModalLayout + CircularProgress + Controls).
- 🟡 **WorkoutControls** (Finish/Cancel buttons).

### Library

- 🟡 **FilterBar** (Horizontal Scroll of `FilterChip`).
- 🟡 **SearchSection** (SearchInput + Filters).

### Charts

- 🟢 **LineChartWidget** (Recharts Wrapper).
- � **ProgressCircle** (SVG Circle with animation).

---

## 4. 📄 Templates (Шаблоны Экранов)

Общие лейауты страниц.

- 🟢 **PageLayout**
  - `MainContent` (Scrollable).
  - `FixedHeader` (Optional).
  - `FixedBottom` (Navigation or Actions).
  - `BackgroundGradient` (Global glow).

---

## 5. 📄 Pages (Страницы)

Сборка из организмов и шаблонов.

### Auth

1. **SplashScreen**.
2. **OnboardingPage** (`GoalGrid`, `FormInput`...).

### Core

3. **DashboardPage**.
2. **ProgramsPage**.
3. **WorkoutDetailPage**.

### Active

6. **ActiveWorkoutPage**.
2. **WorkoutSummaryPage**.

### Data

8. **HistoryPage**.
2. **ExerciseLibraryPage**.
3. **AnalyticsPage**.
4. **MeasurementsPage**.

### Profile

12. **ProfilePage**.
2. **HabitsPage**.
3. **SettingsPage**.

---

## 🌳 Дерево Вложенности (Детальное)

```
ActiveWorkoutPage (PageLayout)
├── Header
│   └── WorkoutTimer (Text)
├── MainContent
│   └── ExerciseList
│       ├── ExerciseCard
│       │   ├── CardHeader (Name + Menu)
│       │   └── SetList
│       │       ├── SetRow (Done)
│       │       │   ├── IndexBadge (1)
│       │       │   ├── PreviousVal (100x10)
│       │       │   └── CurrentVal (100x12) ✅
│       │       └── SetRow (Current)
│       │           ├── IndexBadge (2)
│       │           ├── PreviousVal (100x10)
│       │           └── Placeholder ( -- x -- )
│       └── ExerciseCard...
├── ActiveSetPanel (Fixed)
│   ├── SetInputControl (Weight)
│   ├── SetInputControl (Reps)
│   └── SaveSetButton
└── RestTimerModal (Portal)
    ├── Overlay
    └── ModalContent (GlassCard)
        ├── CircularTimer
        ├── TimeDisplay (01:30)
        └── TimerControls (+30s, Skip)
```
