/**
 * groupTabs.jsx — Mount File (Entry Point)
 * ─────────────────────────────────────────────────────────────────────────────
 * This file is the BRIDGE between the EJS page and React.
 *
 * HOW IT WORKS:
 *   1. groupPage.ejs renders three <div> mount points with data-* attributes.
 *   2. This script reads those data attributes to get groupId, userId, etc.
 *   3. It mounts each React component into its matching mount point div.
 *
 * BUILD:
 *   Vite compiles this file → public/js/groupTabs.js
 *   groupPage.ejs loads it with: <script type="module" src="/js/groupTabs.js">
 *
 * COMPONENTS MOUNTED HERE:
 *   #group-tabs-root → <Tabs> wrapping <ItineraryBuilder>   (Person 3 — YOU)
 *   #chat-root       → <ChatBox>                            (Person 1)
 *   #voting-root     → <VotingSystem>                       (Person 2)
 */

import React from 'react';
import { createRoot } from 'react-dom/client';

// ── Nashwa's components (Tabs + ItineraryBuilder) ──────────────────────────
import Tabs from './components/Tabs';
import ItineraryBuilder from './components/ItineraryBuilder';
import './styles/tabs.css';
import './styles/itinerary-builder.css';

// ── Anna: import ChatBox here when it's ready ────────────────────────────
// import ChatBox from './components/ChatBox';

// ── Neesan: import VotingSystem here when it's ready ───────────────────────
// import VotingSystem from './components/VotingSystem';


// ═════════════════════════════════════════════════════════════════════════════
// MOUNT 1 — Tabs + ItineraryBuilder into #group-tabs-root   (Person 3)
// ═════════════════════════════════════════════════════════════════════════════

const tabsMount = document.getElementById('group-tabs-root');

if (tabsMount) {
  // Read data attributes set by EJS in groupPage.ejs
  const groupId   = tabsMount.dataset.groupId;
  const userId    = tabsMount.dataset.userId;
  const groupName = tabsMount.dataset.groupName;

  // ── Tab content: Chat placeholder (Anna replaces this) ───────────────
  const ChatTabPlaceholder = () => (
    <div className="tab-placeholder">
      <div className="placeholder-icon">💬</div>
      <h3>Group Chat</h3>
      <p>Chat for <strong>{groupName}</strong> will appear here.</p>
      <p className="placeholder-note">Person 1 is building this.</p>
    </div>
  );

  // ── Tab content: Voting placeholder (Neesan replaces this) ─────────────
  const VotingTabPlaceholder = () => (
    <div className="tab-placeholder">
      <div className="placeholder-icon">⭐</div>
      <h3>Recommended Activities</h3>
      <p>Voting for <strong>{groupName}</strong> will appear here.</p>
      <p className="placeholder-note">Person 2 is building this.</p>
    </div>
  );

  // ── Tab content: ItineraryBuilder (Nashwa's component) ────────────
  const ItineraryTab = () => (
    <ItineraryBuilder
      tripId={groupId}
      onSave={(itinerary) => {
        // Week 2: replace this with a fetch() call to save to the backend
        // Example:
        //   fetch(`/api/groups/${groupId}/itinerary`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(itinerary)
        //   });
        console.log('Itinerary saved:', itinerary);
      }}
    />
  );

  // ── Tab definitions ───────────────────────────────────────────────────────
  const tabs = [
    {
      id:      'chat',
      label:   'Chat',
      icon:    '💬',
      content: <ChatTabPlaceholder />,
    },
    {
      id:      'recommended',
      label:   'Recommended',
      icon:    '⭐',
      content: <VotingTabPlaceholder />,
    },
    {
      id:      'itinerary',
      label:   'Itinerary',
      icon:    '📅',
      content: <ItineraryTab />,
    },
  ];

  // ── Mount into the page ───────────────────────────────────────────────────
  createRoot(tabsMount).render(
    <React.StrictMode>
      <Tabs tabs={tabs} defaultTab="chat" />
    </React.StrictMode>
  );
}


// ═════════════════════════════════════════════════════════════════════════════
// MOUNT 2 — ChatBox into #chat-root   *ANNA*
// ═════════════════════════════════════════════════════════════════════════════
//
// INSTRUCTIONS:
//   1. Build your component in client/src/components/ChatBox.jsx
//   2. Uncomment the import at the top of this file:
//        import ChatBox from './components/ChatBox';
//   3. Uncomment the block below and delete the placeholder div.
//
// ─────────────────────────────────────────────────────────────────────────────

const chatMount = document.getElementById('chat-root');

if (chatMount) {
  const groupId  = chatMount.dataset.groupId;
  const userId   = chatMount.dataset.userId;
  const userName = chatMount.dataset.userName;

  // ── WEEK 1: Placeholder shown until Person 1 builds ChatBox ──────────────
  const ChatPlaceholder = () => (
    <div className="tab-placeholder">
      <div className="placeholder-icon">💬</div>
      <h3>Chat coming soon</h3>
      <p>Anna is building the ChatBox component.</p>
    </div>
  );

  createRoot(chatMount).render(
    <React.StrictMode>
      <ChatPlaceholder />
      {/*
        ── WEEK 2: Swap the line above for this once ChatBox.jsx is ready:
        <ChatBox
          groupId={groupId}
          userId={userId}
          userName={userName}
        />
      */}
    </React.StrictMode>
  );
}


// ═════════════════════════════════════════════════════════════════════════════
// MOUNT 3 — VotingSystem into #voting-root   nEESAN
// ═════════════════════════════════════════════════════════════════════════════
//
// INSTRUCTIONS:
//   1. Build your component in client/src/components/VotingSystem.jsx
//   2. Uncomment the import at the top of this file:
//        import VotingSystem from './components/VotingSystem';
//   3. Uncomment the block below and delete the placeholder div.
//
// ─────────────────────────────────────────────────────────────────────────────

const votingMount = document.getElementById('voting-root');

if (votingMount) {
  const groupId  = votingMount.dataset.groupId;
  const userId   = votingMount.dataset.userId;
  const userName = votingMount.dataset.userName;

  // ── WEEK 1: Placeholder shown until Neesan builds VotingSystem ─────────
  const VotingPlaceholder = () => (
    <div className="tab-placeholder">
      <div className="placeholder-icon">⭐</div>
      <h3>Voting coming soon</h3>
      <p>Neesan is building the VotingSystem component.</p>
    </div>
  );

  createRoot(votingMount).render(
    <React.StrictMode>
      <VotingPlaceholder />
      {/*
        ── WEEK 2: Swap the line above for this once VotingSystem.jsx is ready:
        <VotingSystem
          groupId={groupId}
          userId={userId}
          userName={userName}
        />
      */}
    </React.StrictMode>
  );
}
