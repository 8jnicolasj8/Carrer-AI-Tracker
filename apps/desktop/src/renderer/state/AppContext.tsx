/**
 * apps/desktop/src/renderer/state/AppContext.tsx
 * 
 * Global application state for Career AI Tracker.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LoadedCareerData } from '../../data/reader';
import { BUNDLED_DEMO_DATA } from '../../data/mockFixtures';
import { translations, Language } from '../i18n';
import {
  ClubEventsEngine,
  ClubIndicators,
  ActiveClubEvent,
} from '../../engine/events';
import { StaffPersonalities, DEFAULT_PERSONALITIES } from '../../engine/templates';
import { SanctionRecord, verifyBenchCompliance } from '../../engine/compliance';

interface AppContextType {
  data: LoadedCareerData | null;
  loading: boolean;
  activeTab: 'dashboard' | 'squad' | 'staff' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'squad' | 'staff' | 'settings') => void;
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations.en;
  indicators: ClubIndicators;
  personalities: StaffPersonalities;
  updatePersonalities: (p: Partial<StaffPersonalities>) => void;
  activeEvents: ActiveClubEvent[];
  triggerManualEvent: (defId: string) => void;
  resolveEvent: (instanceId: string, decisionId: string) => void;
  sanctions: SanctionRecord[];
  compactMode: boolean;
  setCompactMode: (v: boolean) => void;
  showNews: boolean;
  setShowNews: (v: boolean) => void;
  customDataPath: string | null;
  setCustomDataPath: (p: string | null) => void;
  refreshData: () => Promise<void>;
  aboutOpen: boolean;
  setAboutOpen: (o: boolean) => void;
  diagnosticsOpen: boolean;
  setDiagnosticsOpen: (o: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<LoadedCareerData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'squad' | 'staff' | 'settings'>('dashboard');
  const [lang, setLang] = useState<Language>('en');
  const [compactMode, setCompactMode] = useState<boolean>(false);
  const [showNews, setShowNews] = useState<boolean>(true);
  const [customDataPath, setCustomDataPath] = useState<string | null>(null);
  const [aboutOpen, setAboutOpen] = useState<boolean>(false);
  const [diagnosticsOpen, setDiagnosticsOpen] = useState<boolean>(false);

  const [personalities, setPersonalities] = useState<StaffPersonalities>(DEFAULT_PERSONALITIES);
  const [eventsEngine] = useState(() => new ClubEventsEngine());
  const [indicators, setIndicators] = useState<ClubIndicators>(eventsEngine.getIndicators());
  const [activeEvents, setActiveEvents] = useState<ActiveClubEvent[]>([]);
  const [sanctions, setSanctions] = useState<SanctionRecord[]>([]);

  // Detect system language on initial mount
  useEffect(() => {
    const navLang = navigator.language.slice(0, 2);
    if (navLang === 'es') {
      setLang('es');
    }
  }, []);

  const refreshData = async () => {
    setLoading(true);
    try {
      const api = (window as any).electronAPI;
      let loaded: LoadedCareerData;

      if (api && api.loadCareerData) {
        loaded = await api.loadCareerData(customDataPath || undefined);
      } else {
        loaded = BUNDLED_DEMO_DATA;
      }

      setData(loaded);

      // Evaluate news for events if any
      if (loaded.news && loaded.news.length > 0) {
        const events = eventsEngine.evaluateNewsForEvents(loaded.news.slice(0, 5), lang);
        setActiveEvents(events);
      }

      // Check ongoing sanctions compliance
      if (sanctions.length > 0 && loaded.matches.length > 0) {
        setSanctions((prev) =>
          prev.map((sanc) => {
            if (sanc.status === 'in_progress') {
              const res = verifyBenchCompliance(sanc, loaded.matches);
              if (res.status !== 'in_progress') {
                if (res.effectOnIndicators) {
                  setIndicators(eventsEngine.applyEffects(res.effectOnIndicators));
                }
                return {
                  ...sanc,
                  status: res.status,
                  reason: res.reason,
                  checkedMatches: res.checkedMatches,
                };
              }
            }
            return sanc;
          })
        );
      }
    } catch (err) {
      console.error('Error loading career data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [customDataPath, lang]);

  const updatePersonalities = (p: Partial<StaffPersonalities>) => {
    setPersonalities((prev) => ({ ...prev, ...p }));
  };

  const triggerManualEvent = (defId: string) => {
    const ev = eventsEngine.createEventFromDefinition(defId, lang, {
      playerName: 'Lucas Mercer',
      playerid: 10002,
    });
    if (ev) {
      setActiveEvents((prev) => [ev, ...prev]);
    }
  };

  const resolveEvent = (instanceId: string, decisionId: string) => {
    const event = activeEvents.find((e) => e.instanceId === instanceId);
    if (!event) return;

    const decision = event.decisions.find((d) => d.id === decisionId);
    if (decision) {
      if (decision.effects) {
        setIndicators(eventsEngine.applyEffects(decision.effects));
      }

      // If decision is bench_player, register sanction
      if (decision.id === 'bench_player' && decision.required_benched_matches) {
        const newSanction: SanctionRecord = {
          id: `sanc_${Date.now()}`,
          playerid: event.contextData?.playerid || 10008,
          playerName: event.contextData?.playerName || 'Emil Novak',
          requiredMatches: decision.required_benched_matches,
          startDate: new Date().toISOString(),
          status: 'in_progress',
          checkedMatches: 0,
        };
        setSanctions((prev) => [newSanction, ...prev]);
      }
    }

    setActiveEvents((prev) => prev.filter((e) => e.instanceId !== instanceId));
  };

  const t = translations[lang];

  return (
    <AppContext.Provider
      value={{
        data,
        loading,
        activeTab,
        setActiveTab,
        lang,
        setLang,
        t,
        indicators,
        personalities,
        updatePersonalities,
        activeEvents,
        triggerManualEvent,
        resolveEvent,
        sanctions,
        compactMode,
        setCompactMode,
        showNews,
        setShowNews,
        customDataPath,
        setCustomDataPath,
        refreshData,
        aboutOpen,
        setAboutOpen,
        diagnosticsOpen,
        setDiagnosticsOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
