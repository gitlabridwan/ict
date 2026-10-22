/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppSettings, RegionId, StudentProgress } from './types/game';
import {
  DEFAULT_PROGRESS,
  DEFAULT_SETTINGS,
  loadStoredProgress,
  loadStoredSettings,
  resetStoredProgress,
  saveStoredProgress,
  saveStoredSettings
} from './utils/storage';
import { calculateXPAward } from './utils/rules';
import { sound } from './utils/audio';

// UI Components
import { Navbar } from './components/ui/Navbar';
import { WelcomeView } from './components/ui/WelcomeView';
import { PreTestView } from './components/ui/PreTestView';
import { PostTestView } from './components/ui/PostTestView';
import { ReportView } from './components/ui/ReportView';
import { TeacherGuideModal } from './components/ui/TeacherGuideModal';
import { SettingsModal } from './components/ui/SettingsModal';
import { CityHub2D } from './components/ui/CityHub2D';
import { CityHub3D } from './components/3d/CityHub3D';

// Region Views
import { LabRegion } from './components/regions/LabRegion';
import { AlgorithmRegion } from './components/regions/AlgorithmRegion';
import { NetworkRegion } from './components/regions/NetworkRegion';
import { SecurityRegion } from './components/regions/SecurityRegion';

type ViewMode =
  | 'welcome'
  | 'pre_test'
  | 'hub'
  | 'region_lab'
  | 'region_algorithm'
  | 'region_network'
  | 'region_security'
  | 'post_test'
  | 'report';

export default function App() {
  const [progress, setProgress] = useState<StudentProgress>(loadStoredProgress);
  const [settings, setSettings] = useState<AppSettings>(loadStoredSettings);

  const [currentView, setCurrentView] = useState<ViewMode>('welcome');
  const [isTeacherGuideOpen, setIsTeacherGuideOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Scroll to top when view changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [currentView]);

  // Check ?autostart=1 in URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        setCurrentView('hub');
      } else if (progress.hasSeenTutorial && progress.preTestCompleted) {
        setCurrentView('hub');
      }
    }
  }, []);

  // Save progress changes
  useEffect(() => {
    saveStoredProgress(progress);
  }, [progress]);

  // Save settings changes and sync audio
  useEffect(() => {
    saveStoredSettings(settings);
    sound.setMuted(!settings.soundEnabled);
  }, [settings]);

  // Handle region complete
  const handleRegionComplete = (regionId: RegionId) => {
    const isAlreadyDone = progress.completedRegions[regionId];
    const xpGain = calculateXPAward(isAlreadyDone, 250);

    setProgress(prev => {
      const updatedRegions = { ...prev.completedRegions, [regionId]: true };
      const updatedXP = prev.totalXP + xpGain;
      const updatedRegionXP = {
        ...prev.regionXP,
        [regionId]: (prev.regionXP[regionId] || 0) + xpGain
      };

      return {
        ...prev,
        completedRegions: updatedRegions,
        totalXP: updatedXP,
        regionXP: updatedRegionXP
      };
    });
  };

  // Start from welcome
  const handleStartGame = (name: string) => {
    setProgress(prev => ({
      ...prev,
      studentName: name,
      hasSeenTutorial: true
    }));

    if (!progress.preTestCompleted) {
      setCurrentView('pre_test');
    } else {
      setCurrentView('hub');
    }
  };

  // Complete Pre-Test
  const handlePreTestComplete = (score: number, answers: Record<string, number>) => {
    setProgress(prev => ({
      ...prev,
      preTestCompleted: true,
      preTestScore: score,
      preTestAnswers: answers,
      firstAttemptScorePre: prev.firstAttemptScorePre ?? score,
      historyScores: [
        ...prev.historyScores,
        { date: new Date().toISOString(), stage: 'pre', score }
      ]
    }));
    setCurrentView('hub');
  };

  // Complete Post-Test
  const handlePostTestComplete = (score: number, answers: Record<string, number>) => {
    setProgress(prev => ({
      ...prev,
      postTestCompleted: true,
      postTestScore: score,
      postTestAnswers: answers,
      firstAttemptScorePost: prev.firstAttemptScorePost ?? score,
      historyScores: [
        ...prev.historyScores,
        { date: new Date().toISOString(), stage: 'post', score }
      ]
    }));
    setCurrentView('report');
  };

  const handleResetProgress = () => {
    const reset = resetStoredProgress();
    setProgress(reset);
    setCurrentView('welcome');
  };

  const allRegionsCompleted = Object.values(progress.completedRegions).every(Boolean);

  // Font size class mapping
  const fontSizeClass =
    settings.fontSize === 'xlarge'
      ? 'text-lg'
      : settings.fontSize === 'large'
      ? 'text-base'
      : 'text-sm';

  return (
    <div
      className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-text ${fontSizeClass} ${
        settings.reduceMotion ? 'motion-reduce' : ''
      }`}
    >
      {/* Navigation bar */}
      <Navbar
        studentName={progress.studentName}
        totalXP={progress.totalXP}
        currentView={currentView}
        onNavigate={view => setCurrentView(view)}
        onOpenTeacherGuide={() => setIsTeacherGuideOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        soundEnabled={settings.soundEnabled}
        onToggleSound={() => setSettings(s => ({ ...s, soundEnabled: !s.soundEnabled }))}
        canTakePostTest={allRegionsCompleted || progress.preTestCompleted}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col items-center justify-start w-full relative">
        {/* VIEW 1: WELCOME */}
        {currentView === 'welcome' && (
          <WelcomeView
            initialName={progress.studentName}
            onStart={handleStartGame}
            hasPreTestCompleted={progress.preTestCompleted}
          />
        )}

        {/* VIEW 2: PRE-TEST */}
        {currentView === 'pre_test' && (
          <PreTestView
            studentName={progress.studentName}
            onComplete={handlePreTestComplete}
          />
        )}

        {/* VIEW 3: CITY HUB (3D / 2D) */}
        {currentView === 'hub' && (
          <div className="w-full flex-1 flex flex-col items-center justify-center relative min-h-[calc(100vh-65px)]">
            {/* Top banner status */}
            <div className="w-full max-w-5xl px-4 pt-3 flex flex-wrap items-center justify-between gap-2 z-10">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-xl border border-slate-800">
                <span>Status Pemulihan:</span>
                <span className="text-cyan-400">
                  {Object.values(progress.completedRegions).filter(Boolean).length} / 4 Wilayah Pulih
                </span>
              </div>

              {allRegionsCompleted && (
                <button
                  onClick={() => { sound.playClick(); setCurrentView('post_test'); }}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 animate-bounce"
                >
                  🎉 Seluruh Wilayah Pulih! Ambil Tes Akhir ➔
                </button>
              )}
            </div>

            {/* 3D vs 2D Toggle container */}
            <div className="w-full flex-1 flex items-center justify-center">
              {settings.use2DFallback ? (
                <CityHub2D
                  completedRegions={progress.completedRegions}
                  onSelectRegion={rId => {
                    sound.playClick();
                    if (rId === 'lab') setCurrentView('region_lab');
                    if (rId === 'algorithm') setCurrentView('region_algorithm');
                    if (rId === 'network') setCurrentView('region_network');
                    if (rId === 'security') setCurrentView('region_security');
                  }}
                />
              ) : (
                <CityHub3D
                  completedRegions={progress.completedRegions}
                  graphicsQuality={settings.graphicsQuality}
                  onSelectRegion={rId => {
                    sound.playClick();
                    if (rId === 'lab') setCurrentView('region_lab');
                    if (rId === 'algorithm') setCurrentView('region_algorithm');
                    if (rId === 'network') setCurrentView('region_network');
                    if (rId === 'security') setCurrentView('region_security');
                  }}
                />
              )}
            </div>
          </div>
        )}

        {/* VIEW 4: WILAYAH 1 - LAB KOMPUTER */}
        {currentView === 'region_lab' && (
          <LabRegion
            isCompleted={progress.completedRegions.lab}
            onCompleteRegion={handleRegionComplete}
            onBackToMap={() => { sound.playClick(); setCurrentView('hub'); }}
          />
        )}

        {/* VIEW 5: WILAYAH 2 - TAMAN ALGORITMA */}
        {currentView === 'region_algorithm' && (
          <AlgorithmRegion
            isCompleted={progress.completedRegions.algorithm}
            onCompleteRegion={handleRegionComplete}
            onBackToMap={() => { sound.playClick(); setCurrentView('hub'); }}
          />
        )}

        {/* VIEW 6: WILAYAH 3 - PUSAT JARINGAN */}
        {currentView === 'region_network' && (
          <NetworkRegion
            isCompleted={progress.completedRegions.network}
            onCompleteRegion={handleRegionComplete}
            onBackToMap={() => { sound.playClick(); setCurrentView('hub'); }}
          />
        )}

        {/* VIEW 7: WILAYAH 4 - BENTENG KEAMANAN */}
        {currentView === 'region_security' && (
          <SecurityRegion
            isCompleted={progress.completedRegions.security}
            onCompleteRegion={handleRegionComplete}
            onBackToMap={() => { sound.playClick(); setCurrentView('hub'); }}
          />
        )}

        {/* VIEW 8: POST-TEST */}
        {currentView === 'post_test' && (
          <PostTestView
            studentName={progress.studentName}
            onComplete={handlePostTestComplete}
          />
        )}

        {/* VIEW 9: REPORT */}
        {currentView === 'report' && (
          <ReportView
            progress={progress}
            onNavigateToRegion={rId => {
              sound.playClick();
              if (rId === 'lab') setCurrentView('region_lab');
              if (rId === 'algorithm') setCurrentView('region_algorithm');
              if (rId === 'network') setCurrentView('region_network');
              if (rId === 'security') setCurrentView('region_security');
            }}
            onRetakePostTest={() => { sound.playClick(); setCurrentView('post_test'); }}
            onBackToMap={() => { sound.playClick(); setCurrentView('hub'); }}
          />
        )}
      </main>

      {/* Global Modals */}
      <TeacherGuideModal
        isOpen={isTeacherGuideOpen}
        onClose={() => setIsTeacherGuideOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        onResetProgress={handleResetProgress}
      />
    </div>
  );
}
