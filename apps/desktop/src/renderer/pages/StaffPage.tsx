/**
 * apps/desktop/src/renderer/pages/StaffPage.tsx
 * 
 * Staff Room Screen conforming strictly to Section 6.4, 7.1, and 7.2:
 * - 4 contacts: Assistant Manager, Youth Scout (using real ojeador data), President, Press Officer.
 * - Chat stream with deterministic templates and quick replies.
 * - Modal decision cards for club events with indicator consequence preview.
 * - Developer triggers to manually test each of the 4 club events.
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../state/AppContext';
import { TemplateEngine, StaffRole } from '../../engine/templates';
import { CheckCircle2 } from 'lucide-react';

export const StaffPage: React.FC = () => {
  const {
    data,
    t,
    lang,
    personalities,
    activeEvents,
    triggerManualEvent,
    resolveEvent,
  } = useApp();

  const [selectedRole, setSelectedRole] = useState<StaffRole>('assistant_manager');
  const [quickMessages, setQuickMessages] = useState<Array<{ text: string; sender: string; timestamp: string; isUser?: boolean }>>([]);

  const templateEngine = useMemo(() => {
    return new TemplateEngine(lang, personalities);
  }, [lang, personalities]);

  const scoutInfo = data?.state?.ojeador;
  const matches = data?.matches || [];
  const latestMatch = matches[0];
  const simulatedDate = data?.state?.fecha_simulada || '2025-01-25';

  // Build 4 contacts
  const contacts = [
    {
      role: 'assistant_manager' as StaffRole,
      name: 'Marcus Vance',
      title: lang === 'en' ? 'Assistant Manager' : 'Segundo Entrenador',
      description: lang === 'en' ? 'Tactics & Squad Dynamics' : 'Táctica y Gestión de Plantel',
      status: 'Active · Pitchside',
    },
    {
      role: 'youth_scout' as StaffRole,
      name: scoutInfo?.nombre || 'Mateo Silva',
      title: lang === 'en' ? 'Youth Academy Scout' : 'Ojeador de Cantera',
      description: scoutInfo ? `${scoutInfo.nacionalidad} (Exp: ${scoutInfo.experiencia}★ / Know: ${scoutInfo.conocimiento}★)` : 'Regional Scouting',
      status: 'On Assignment',
    },
    {
      role: 'president' as StaffRole,
      name: 'Lord Reginald Sterling',
      title: lang === 'en' ? 'Club President' : 'Presidente del Club',
      description: lang === 'en' ? 'Board & Institutional Strategy' : 'Directiva y Estrategia Institucional',
      status: 'Executive Suite',
    },
    {
      role: 'press_officer' as StaffRole,
      name: 'Chloe Hastings',
      title: lang === 'en' ? 'Head of Media & PR' : 'Jefa de Prensa',
      description: lang === 'en' ? 'Press Relations & Narrative Control' : 'Relaciones con la Prensa',
      status: 'Media Centre',
    },
  ];

  // Base messages for selected staff member
  const baseStaffMessages = useMemo(() => {
    const list: Array<{ text: string; sender: string; timestamp: string; isUser?: boolean }> = [];

    if (selectedRole === 'assistant_manager' && latestMatch) {
      const summary = templateEngine.generateAssistantMatchSummary(latestMatch);
      list.push({ text: summary.text, sender: summary.senderName, timestamp: summary.timestamp });
    } else if (selectedRole === 'president') {
      const streak = templateEngine.generatePresidentStreakMessage(matches);
      if (streak) {
        list.push({ text: streak.text, sender: streak.senderName, timestamp: streak.timestamp });
      } else {
        list.push({
          text: lang === 'en' ? 'The board remains attentive to squad progress. Maintain high tactical standards.' : 'La directiva se mantiene atenta a la evolución del plantel. Mantenga el nivel competitivo.',
          sender: 'Lord Reginald Sterling',
          timestamp: simulatedDate,
        });
      }
    } else if (selectedRole === 'youth_scout') {
      const scoutMsg = templateEngine.generateScoutTalentMessage(simulatedDate, scoutInfo);
      list.push({ text: scoutMsg.text, sender: scoutMsg.senderName, timestamp: scoutMsg.timestamp });
    } else if (selectedRole === 'press_officer') {
      const pressMsg = latestMatch ? templateEngine.generatePressCupMessage(latestMatch) : null;
      if (pressMsg) {
        list.push({ text: pressMsg.text, sender: pressMsg.senderName, timestamp: pressMsg.timestamp });
      } else {
        list.push({
          text: lang === 'en' ? 'The media pack is quiet for now. Expect heightened scrutiny ahead of the next fixture.' : 'El ambiente mediático está en calma. Anticipo mayor presión para la próxima fecha.',
          sender: 'Chloe Hastings',
          timestamp: simulatedDate,
        });
      }
    }

    return list;
  }, [selectedRole, latestMatch, matches, simulatedDate, scoutInfo, lang, templateEngine]);

  const handleQuickInquiry = (topic: 'injury' | 'next_match') => {
    const questionText = topic === 'injury' ? t.staff.askInjuries : t.staff.askNextMatch;
    const reply = templateEngine.generateQuickResponse(topic, simulatedDate);

    setQuickMessages((prev) => [
      ...prev,
      { text: questionText, sender: 'Manager', timestamp: 'Just now', isUser: true },
      { text: reply.text, sender: reply.senderName, timestamp: 'Just now' },
    ]);
  };

  const selectedContact = contacts.find((c) => c.role === selectedRole)!;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 320px', height: '100%', overflow: 'hidden' }}>
      {/* 1. Contacts List */}
      <div
        style={{
          borderRight: '1px solid var(--border)',
          backgroundColor: 'var(--bg-2)',
          padding: '20px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, padding: '0 8px' }}>
          {t.staff.contacts}
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {contacts.map((c) => {
            const isSelected = selectedRole === c.role;
            return (
              <button
                key={c.role}
                onClick={() => {
                  setSelectedRole(c.role);
                  setQuickMessages([]);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '12px',
                  borderRadius: 'var(--r-card)',
                  border: isSelected ? '1px solid var(--border-strong)' : '1px solid var(--border)',
                  background: isSelected ? 'var(--accent-soft)' : 'var(--surface-solid)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--bg-3)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isSelected ? 'var(--accent)' : 'var(--text-muted)',
                    fontWeight: 700,
                    fontSize: '13px',
                  }}
                >
                  {c.name.slice(0, 2).toUpperCase()}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: '11px', color: isSelected ? 'var(--accent)' : 'var(--text-dim)' }}>
                    {c.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dev Event Trigger Button Menu per Section 7.2 */}
        <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
            {t.staff.triggerEventTest}
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <button
              onClick={() => triggerManualEvent('disciplinary_red_card')}
              className="btn-secondary"
              style={{ fontSize: '10px', padding: '6px' }}
            >
              Discipline
            </button>
            <button
              onClick={() => triggerManualEvent('injury_medical_report')}
              className="btn-secondary"
              style={{ fontSize: '10px', padding: '6px' }}
            >
              Injury
            </button>
            <button
              onClick={() => triggerManualEvent('press_conference_post_match')}
              className="btn-secondary"
              style={{ fontSize: '10px', padding: '6px' }}
            >
              Press Conf
            </button>
            <button
              onClick={() => triggerManualEvent('board_monthly_review')}
              className="btn-secondary"
              style={{ fontSize: '10px', padding: '6px' }}
            >
              Board Mtg
            </button>
          </div>
        </div>
      </div>

      {/* 2. Chat Stream */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* Chat Header */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(5, 18, 26, 0.4)',
          }}
        >
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{t.staff.chatWith}</span>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
              {selectedContact.name} ({selectedContact.title})
            </h3>
          </div>
          <span className="badge-verified">{selectedContact.status}</span>
        </div>

        {/* Message Stream */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[...baseStaffMessages, ...quickMessages].map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.isUser ? 'flex-end' : 'flex-start',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: msg.isUser ? 'var(--accent)' : 'var(--text-muted)' }}>
                  {msg.sender}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>{msg.timestamp}</span>
              </div>
              <div
                style={{
                  maxWidth: '75%',
                  padding: '12px 16px',
                  borderRadius: 'var(--r-card)',
                  background: msg.isUser ? 'var(--accent)' : 'var(--surface-solid)',
                  color: msg.isUser ? 'var(--accent-ink)' : 'var(--text)',
                  border: msg.isUser ? 'none' : '1px solid var(--border)',
                  fontSize: '13px',
                  lineHeight: 1.5,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Inquiries Row */}
        {selectedRole === 'assistant_manager' && (
          <div
            style={{
              padding: '12px 24px',
              borderTop: '1px solid var(--border)',
              background: 'rgba(5, 18, 26, 0.5)',
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-dim)', flexShrink: 0 }}>
              {t.staff.quickQuestions}:
            </span>
            <button
              onClick={() => handleQuickInquiry('injury')}
              className="btn-secondary"
              style={{ fontSize: '11px', padding: '6px 12px' }}
            >
              {t.staff.askInjuries}
            </button>
            <button
              onClick={() => handleQuickInquiry('next_match')}
              className="btn-secondary"
              style={{ fontSize: '11px', padding: '6px 12px' }}
            >
              {t.staff.askNextMatch}
            </button>
          </div>
        )}
      </div>

      {/* 3. Member Profile & Club Events Drawer */}
      <div
        style={{
          borderLeft: '1px solid var(--border)',
          backgroundColor: 'var(--bg-2)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          overflowY: 'auto',
        }}
      >
        {/* Profile Details */}
        <div className="glass-panel" style={{ padding: '18px' }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700 }}>
            Staff Dossier
          </span>
          <div style={{ marginTop: '10px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
              {selectedContact.name}
            </h4>
            <div style={{ fontSize: '12px', color: 'var(--accent)', marginTop: '2px' }}>
              {selectedContact.title}
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.4 }}>
              {selectedContact.description}
            </p>
          </div>
        </div>

        {/* Active Club Events Section with Decisions */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700 }}>
              {t.staff.eventsTitle} ({activeEvents.length})
            </span>
          </div>

          {activeEvents.length === 0 ? (
            <div className="glass-panel" style={{ padding: '16px', fontSize: '12px', color: 'var(--text-dim)', textAlign: 'center' }}>
              {t.staff.noEvents}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activeEvents.map((event) => (
                <div
                  key={event.instanceId}
                  className="glass-panel"
                  style={{
                    padding: '16px',
                    borderLeft: '4px solid var(--accent)',
                  }}
                >
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', display: 'block' }}>
                    {event.title}
                  </span>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '8px 0 12px 0', lineHeight: 1.4 }}>
                    {event.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {event.decisions.map((dec) => (
                      <button
                        key={dec.id}
                        onClick={() => resolveEvent(event.instanceId, dec.id)}
                        className="btn-secondary"
                        style={{
                          fontSize: '11px',
                          padding: '6px 10px',
                          justifyContent: 'space-between',
                          textAlign: 'left',
                        }}
                      >
                        <span>{dec.label}</span>
                        <CheckCircle2 size={13} color="var(--accent)" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
