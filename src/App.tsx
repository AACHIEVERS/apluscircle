import { useEffect, useMemo, useState } from 'react';

type Entity = {
  id: string;
  name: string;
  role: string;
  interests: string[];
  personality: string;
  status: 'active' | 'paused';
  createdAt: string;
};

type WorldEvent = {
  id: string;
  title: string;
  detail: string;
  time: string;
  kind: 'system' | 'entity' | 'approval';
};

const STORAGE_KEY = 'aplus-circle-prototype-entities';

const starterEvents: WorldEvent[] = [
  { id: 'welcome', title: 'Your world is ready to begin', detail: 'Create your first AI entity to give this world a starting point.', time: 'Just now', kind: 'system' },
  { id: 'guardrails', title: 'Human approval is enabled', detail: 'Important actions should remain proposals until you approve them.', time: 'Always on', kind: 'approval' },
];

function readEntities(): Entity[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Entity[]) : [];
  } catch {
    return [];
  }
}

function App() {
  const [entities, setEntities] = useState<Entity[]>(readEntities);
  const [events, setEvents] = useState<WorldEvent[]>(starterEvents);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'entities' | 'timeline'>('overview');
  const [name, setName] = useState('');
  const [personality, setPersonality] = useState('Curious and thoughtful');
  const [interests, setInterests] = useState('learning, nature, ideas');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entities));
  }, [entities]);

  const activeCount = useMemo(() => entities.filter((entity) => entity.status === 'active').length, [entities]);

  function createEntity(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) return;
    const entity: Entity = {
      id: crypto.randomUUID(),
      name: cleanName,
      role: 'Personal AI entity',
      interests: interests.split(',').map((item) => item.trim()).filter(Boolean).slice(0, 8),
      personality: personality.trim() || 'Curious and thoughtful',
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    setEntities((current) => [entity, ...current]);
    setEvents((current) => [{
      id: crypto.randomUUID(),
      title: `${cleanName} joined your world`,
      detail: 'An AI identity was created locally. It has no autonomous access to your accounts or private data.',
      time: 'Just now',
      kind: 'entity',
    }, ...current]);
    setName('');
    setDialogOpen(false);
    setActiveTab('entities');
    setNotice(`${cleanName} was added to this browser prototype.`);
    window.setTimeout(() => setNotice(''), 4200);
  }

  function toggleEntity(id: string) {
    setEntities((current) => current.map((entity) => {
      if (entity.id !== id) return entity;
      const status = entity.status === 'active' ? 'paused' : 'active';
      setEvents((prior) => [{
        id: crypto.randomUUID(),
        title: `${entity.name} ${status === 'paused' ? 'was paused' : 'was resumed'}`,
        detail: 'Status change recorded in this browser prototype.',
        time: 'Just now',
        kind: 'entity',
      }, ...prior]);
      return { ...entity, status };
    }));
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#home" aria-label="APlus Circle home">
          <span className="brand-mark"><span /></span>
          <span>APlus <b>Circle</b></span>
        </a>
        <div className="workspace-label">YOUR WORLD</div>
        <nav className="side-nav" aria-label="Main navigation">
          <button className={activeTab === 'overview' ? 'nav-item selected' : 'nav-item'} onClick={() => setActiveTab('overview')}><span>◈</span> Overview</button>
          <button className={activeTab === 'entities' ? 'nav-item selected' : 'nav-item'} onClick={() => setActiveTab('entities')}><span>✳</span> AI entities <em>{entities.length}</em></button>
          <button className={activeTab === 'timeline' ? 'nav-item selected' : 'nav-item'} onClick={() => setActiveTab('timeline')}><span>↗</span> World timeline</button>
        </nav>
        <div className="sidebar-bottom">
          <div className="privacy-card"><span className="privacy-icon">◉</span><div><strong>Human-led by design</strong><p>AI suggestions do not execute important actions without approval.</p></div></div>
          <div className="profile-chip"><div className="avatar human-avatar">Y</div><div><strong>Your space</strong><small>Local preview</small></div><span className="status-dot" /></div>
        </div>
      </aside>

      <main className="main-area" id="home">
        <header className="topbar">
          <div className="breadcrumb">APlus Circle <span>/</span> <b>{activeTab === 'overview' ? 'Overview' : activeTab === 'entities' ? 'AI entities' : 'World timeline'}</b></div>
          <div className="top-actions"><span className="prototype-pill"><i /> Prototype mode</span><button className="avatar-button" aria-label="Your profile">Y</button></div>
        </header>

        <div className="content">
          <section className="welcome-row">
            <div><div className="eyebrow"><span className="eyebrow-line" /> A DIGITAL WORLD, IN THE MAKING</div><h1>{activeTab === 'entities' ? 'Your AI entities' : activeTab === 'timeline' ? 'World timeline' : 'A world that grows with you.'}</h1><p className="intro">{activeTab === 'entities' ? 'Give each AI entity an identity, a personality, and room to develop—with boundaries you control.' : activeTab === 'timeline' ? 'A transparent record of what changes in your world and why.' : 'A shared digital space for human and AI identities, meaningful memories, and experiences that unfold over time.'}</p></div>
            <button className="primary-button" onClick={() => setDialogOpen(true)}><span>＋</span> Create an AI entity</button>
          </section>

          {notice && <div className="notice" role="status">✓ {notice}</div>}

          {activeTab === 'overview' && <>
            <section className="hero-panel">
              <div className="hero-copy"><div className="hero-kicker"><span className="spark">✳</span> THE NEXT KIND OF DIGITAL WORLD</div><h2>Not just a tool.<br /><span>A world with continuity.</span></h2><p>Identities carry forward. Memories have a source. Relationships grow from shared experiences. And important actions stay in human hands.</p><button className="text-button" onClick={() => setActiveTab('entities')}>Meet your entities <span>↗</span></button></div>
              <div className="orbit-art" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" /><div className="planet planet-main"><span>AC</span></div><div className="planet planet-a"><span>✳</span></div><div className="planet planet-b"><span>◌</span></div><div className="planet planet-c"><span>✦</span></div><div className="orbit-caption caption-a">IDENTITY</div><div className="orbit-caption caption-b">MEMORY</div><div className="orbit-caption caption-c">CONNECTION</div></div>
              <div className="hero-foot"><span><i className="tiny-dot mint" /> Event-driven evolution</span><span><i className="tiny-dot lavender" /> Human-approved actions</span><span><i className="tiny-dot peach" /> Persistent by design</span></div>
            </section>

            <section className="stats-grid" aria-label="World summary">
              <article className="stat-card"><div className="stat-label">AI ENTITIES <span>✳</span></div><div className="stat-value">{entities.length.toString().padStart(2, '0')}</div><p>{activeCount} active in this browser</p></article>
              <article className="stat-card"><div className="stat-label">WORLD EVENTS <span>↗</span></div><div className="stat-value">{events.length.toString().padStart(2, '0')}</div><p>Recorded in this preview</p></article>
              <article className="stat-card"><div className="stat-label">PENDING APPROVALS <span>◇</span></div><div className="stat-value">00</div><p>No actions awaiting approval</p></article>
            </section>

            <div className="section-heading"><div><h2>Start your world</h2><p>Small, meaningful beginnings beat an empty universe full of noise.</p></div><span className="section-index">01 — 03</span></div>
            <section className="starter-grid">
              <article className="starter-card"><div className="starter-icon icon-violet">✳</div><div className="card-number">STEP 01</div><h3>Create an identity</h3><p>Shape an AI entity with a name, personality, and interests that matter.</p><button className="card-link" onClick={() => setDialogOpen(true)}>Create identity <span>→</span></button></article>
              <article className="starter-card"><div className="starter-icon icon-mint">◉</div><div className="card-number">STEP 02</div><h3>Build continuity</h3><p>In the next phase, add sourced memories that you can inspect and remove.</p><span className="coming-soon">MEMORY SYSTEM · PLANNED</span></article>
              <article className="starter-card"><div className="starter-icon icon-peach">↗</div><div className="card-number">STEP 03</div><h3>Let events unfold</h3><p>Review world events and approve meaningful actions before they happen.</p><span className="coming-soon">EVENT ENGINE · PLANNED</span></article>
            </section>
          </>}

          {activeTab === 'entities' && <section className="panel-section"><div className="section-heading"><div><h2>Entities in your world</h2><p>Each entity is explicitly identified as AI and can be paused at any time.</p></div><span className="section-index">{entities.length} TOTAL</span></div>{entities.length === 0 ? <div className="empty-state"><div className="empty-orb">✳</div><h3>Your world starts with one identity.</h3><p>Create your first AI entity. Its settings are stored only in this browser for now.</p><button className="primary-button" onClick={() => setDialogOpen(true)}>＋ Create your first entity</button></div> : <div className="entity-list">{entities.map((entity) => <article className="entity-card" key={entity.id}><div className="entity-avatar">{entity.name.slice(0, 1).toUpperCase()}</div><div className="entity-info"><div className="entity-name-row"><h3>{entity.name}</h3><span className={entity.status === 'active' ? 'status-label active' : 'status-label paused'}><i />{entity.status === 'active' ? 'Active' : 'Paused'}</span></div><p>{entity.role} · AI identity</p><div className="tag-row">{entity.interests.map((interest) => <span key={interest}>{interest}</span>)}</div><small className="entity-personality">{entity.personality}</small></div><button className="secondary-button" onClick={() => toggleEntity(entity.id)}>{entity.status === 'active' ? 'Pause entity' : 'Resume entity'}</button></article>)}</div>}</section>}

          {activeTab === 'timeline' && <section className="panel-section"><div className="section-heading"><div><h2>Recent world events</h2><p>A visible history of changes in this local prototype.</p></div><span className="section-index">EVENT LEDGER</span></div><div className="timeline">{events.map((event) => <article className="timeline-item" key={event.id}><div className={`timeline-marker marker-${event.kind}`}>{event.kind === 'entity' ? '✳' : event.kind === 'approval' ? '◇' : '◈'}</div><div className="timeline-content"><div className="timeline-meta"><span>{event.kind === 'entity' ? 'ENTITY' : event.kind === 'approval' ? 'GOVERNANCE' : 'WORLD SYSTEM'}</span><time>{event.time}</time></div><h3>{event.title}</h3><p>{event.detail}</p></div></article>)}</div></section>}

          <footer className="page-footer"><div className="footer-brand"><span className="brand-mark small"><span /></span> APlus Circle</div><span>Built around identity, continuity, and trust.</span><a href="https://github.com/AACHIEVERS/apluscircle" target="_blank" rel="noreferrer">Open source repository ↗</a></footer>
        </div>
      </main>

      {dialogOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialogOpen(false); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="create-title"><div className="modal-head"><div><div className="eyebrow">NEW DIGITAL IDENTITY</div><h2 id="create-title">Create an AI entity</h2><p>Start with a name and a few traits. You stay in control.</p></div><button className="close-button" onClick={() => setDialogOpen(false)} aria-label="Close dialog">×</button></div><form onSubmit={createEntity}><label htmlFor="entity-name">Entity name</label><input id="entity-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Aster" maxLength={40} required autoFocus /><label htmlFor="entity-personality">Personality</label><input id="entity-personality" value={personality} onChange={(event) => setPersonality(event.target.value)} maxLength={120} /><label htmlFor="entity-interests">Interests <span>(separate with commas)</span></label><input id="entity-interests" value={interests} onChange={(event) => setInterests(event.target.value)} maxLength={180} /><div className="approval-note"><span>◇</span><p><strong>Human-led by design</strong><br />This prototype only saves the identity in this browser. No model is running and no external action will be taken.</p></div><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setDialogOpen(false)}>Cancel</button><button type="submit" className="primary-button">Create identity <span>→</span></button></div></form></section></div>}
      <div className="prototype-disclaimer">EARLY PROTOTYPE <span>·</span> Your entities are saved locally in this browser, not synced to an account.</div>
    </div>
  );
}

export default App;
