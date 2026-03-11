import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PageLayout } from './components/templates/PageLayout';
import { DashboardPage } from './components/pages/Dashboard';
import { Workout } from './components/pages/Workout';
import { WorkoutSummary } from './components/pages/WorkoutSummary';
import { Profile } from './components/pages/Profile';
import { PersonalData } from './components/pages/PersonalData';
import { Measurements } from './components/pages/Measurements';
import { Settings } from './components/pages/Settings';
import { Onboarding } from './components/pages/Onboarding';
import { Habits } from './components/pages/Habits';
import { Analytics } from './components/pages/Analytics';
import { Achievements } from './components/pages/Achievements';
import { Workouts } from './components/pages/Workouts/Workouts';
import { CreateWorkout } from './components/pages/Workouts/CreateWorkout';
import { EditWorkout } from './components/pages/Workouts/EditWorkout';
import { ExercisesPage } from './components/pages/Exercises';
import { ExerciseDetails } from './components/pages/ExerciseDetails';
import { History } from './components/pages/History';
import { HistoryDetail } from './components/pages/HistoryDetail';
import { ToastProvider } from './components/atoms/Toast';
import { useUserStore } from './stores/useUserStore';

// Анимация переходов между страницами
const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const pageTransition = {
  type: 'tween' as const,
  ease: 'easeInOut' as const,
  duration: 0.2,
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
        style={{ flex: 1, display: 'flex', flexDirection: 'column' as const }}
      >
        <Routes location={location}>
          {/* Редирект с корня на дашборд */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Тренировки */}
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/workouts/create" element={<CreateWorkout />} />
          <Route path="/workouts/:id/edit" element={<EditWorkout />} />
          <Route path="/workout/:id" element={<Workout />} />
          <Route path="/workout/summary" element={<WorkoutSummary />} />

          {/* История */}
          <Route path="/history" element={<History />} />
          <Route path="/history/:id" element={<HistoryDetail />} />

          {/* Упражнения */}
          <Route path="/exercises" element={<ExercisesPage />} />
          <Route path="/exercises/:id" element={<ExerciseDetails />} />

          {/* Профиль */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/personal-data" element={<PersonalData />} />
          <Route path="/profile/measurements" element={<Measurements />} />
          <Route path="/profile/habits" element={<Habits />} />
          <Route path="/profile/achievements" element={<Achievements />} />

          {/* Прочее */}
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

import { useTelegram } from './hooks/useTelegram';

function App() {
  const { user, setUser } = useUserStore();
  const { user: tgUser, isReady } = useTelegram();

  useEffect(() => {
    if (user.settings.darkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [user.settings.darkTheme]);

  useEffect(() => {
    // Sync Telegram user data to our store
    if (isReady && tgUser) {
      setUser({
        ...user,
        id: tgUser.id.toString(),
        profile: {
          ...user.profile,
          name: tgUser.first_name,
          avatar: tgUser.photo_url || user.profile.avatar,
        }
      });
    }
  }, [isReady, tgUser?.id]);

  return (
    <BrowserRouter>
      <ToastProvider>
        <PageLayout>
          <AnimatedRoutes />
        </PageLayout>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
