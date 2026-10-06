import { useState } from 'react'

// ——— Types ———
type Screen = 'lobby' | 'stories' | 'playing' | 'social' | 'settings'

interface Story {
  id: number
  title: string
  setting: 'library' | 'beach' | 'rec'
  date: string
  tags: string[]
  emoji: string
  xp: number
  steps: Array<{ text: string; isGuide: boolean }>
}

// ——— Data ———
const STORIES: Story[] = [
  {
    id: 1,
    title: 'Kennedy Library Expansion: What You Need to Know',
    setting: 'library',
    date: 'Sept 24, 2026',
    tags: ['Campus', 'Academics'],
    emoji: '📚',
    xp: 75,
    steps: [
      { text: "Hey! I'm Poly, your guide 👋 Today we're diving into the Kennedy Library expansion. Ready to explore?", isGuide: true },
      { text: "Cal Poly announced a $42M expansion adding 3 new floors, a tech hub, and 800 new study seats — opening 2029.", isGuide: false },
      { text: "Students have mixed feelings. Excited about the space, but worried about construction noise during finals week.", isGuide: false },
      { text: "Here's the timeline: construction starts Spring 2027, wraps in 2029. Current freshmen will see it done! 🎉", isGuide: true },
    ],
  },
  {
    id: 2,
    title: 'Morro Bay Water Crisis: What It Means for SLO',
    setting: 'beach',
    date: 'Sept 22, 2026',
    tags: ['Environment', 'Local'],
    emoji: '🌊',
    xp: 80,
    steps: [
      { text: "Welcome to Morro Bay! I'm Poly. This story is about the water shortage hitting our coastal neighbor.", isGuide: true },
      { text: "Morro Bay entered Stage 3 water restrictions in August — households limited to just 50 gallons per day.", isGuide: false },
      { text: "Cal Poly Environmental Engineering students are now partnering with the city on a desalination feasibility study.", isGuide: false },
      { text: "This connects directly to you! Restaurants, farms, tourism — the whole local economy students depend on.", isGuide: true },
    ],
  },
  {
    id: 3,
    title: 'Rec Center Expansion Gets Green Light',
    setting: 'rec',
    date: 'Sept 20, 2026',
    tags: ['Campus', 'Student Life'],
    emoji: '🎮',
    xp: 70,
    steps: [
      { text: "Big announcement! ASI just approved a major Rec Center upgrade. Let me walk you through what's changing.", isGuide: true },
      { text: "The $18M project adds a climbing wall, an esports lounge with 20 gaming stations, and 40% more cardio equipment.", isGuide: false },
      { text: "The esports lounge opens Fall 2027 — free to all enrolled students with a valid PolyCard.", isGuide: false },
      { text: "Students voted 78% in favor last spring. You made this happen! 🏆 Construction starts January 2027.", isGuide: true },
    ],
  },
  {
    id: 4,
    title: 'ASI Election Results: What the New Board Means for You',
    setting: 'rec',
    date: 'Sept 18, 2026',
    tags: ['Campus', 'Student Life'],
    emoji: '🗳️',
    xp: 65,
    steps: [
      { text: "Election season is over — Poly here to break down what the new ASI board means for campus life.", isGuide: true },
      { text: "New ASI President Camila Reyes ran on a platform of expanded mental health services and lower student fees.", isGuide: false },
      { text: "Her first act: a proposal to extend Counseling Services hours to 10 PM on weekdays.", isGuide: false },
      { text: "The board takes office October 1. Watch this space — student government shapes more of your life than you think!", isGuide: true },
    ],
  },
  {
    id: 5,
    title: "SLO Farmers Market Goes Year-Round Starting November",
    setting: 'beach',
    date: 'Sept 15, 2026',
    tags: ['Local', 'Environment'],
    emoji: '🥦',
    xp: 60,
    steps: [
      { text: "Good news for food lovers! The SLO Farmers Market is going year-round. Let me tell you why that matters.", isGuide: true },
      { text: "The Thursday night market will now run every week through winter — a first in the market's 38-year history.", isGuide: false },
      { text: "It's backed by a new city grant focused on supporting local agriculture and reducing grocery transportation emissions.", isGuide: false },
      { text: "Students get 10% off with a PolyCard at over 20 vendors. Worth the walk down Higuera St.!", isGuide: true },
    ],
  },
]

const ALL_TAGS = Array.from(new Set(STORIES.flatMap(s => s.tags)))

const PLANETS = [
  { id: 'recent', label: 'Recent Stories', sublabel: '5 new today', color: '#B5FF4D', size: 130, x: 18, y: 36, hasRing: true, target: 'stories' as Screen, emoji: '🌍' },
  { id: 'explainer', label: 'Deep Dives', sublabel: 'Explore context', color: '#FF6B9D', size: 92, x: 65, y: 20, hasRing: false, target: 'stories' as Screen, emoji: '🪐' },
  { id: 'community', label: 'Community', sublabel: 'What\'s trending', color: '#4DFFEE', size: 78, x: 70, y: 62, hasRing: true, target: 'social' as Screen, emoji: '✨' },
  { id: 'trending', label: 'Trending', sublabel: '🔥 Hot right now', color: '#FFB84D', size: 62, x: 16, y: 68, hasRing: false, target: 'stories' as Screen, emoji: '⭐' },
]

const ACTIVITIES = [
  { user: 'Maya R.', avatar: '🦊', action: 'finished', story: 'Kennedy Library Expansion', time: '2m ago', xp: 75 },
  { user: 'Jordan L.', avatar: '🐺', action: 'read', story: 'Morro Bay Water Crisis', time: '18m ago', xp: 80 },
  { user: 'Alex K.', avatar: '🦋', action: 'finished', story: 'Rec Center Expansion', time: '45m ago', xp: 70 },
  { user: 'Sam T.', avatar: '🐸', action: 'read', story: 'ASI Election Results', time: '1h ago', xp: 65 },
  { user: 'River M.', avatar: '🦁', action: 'finished', story: 'SLO Farmers Market', time: '2h ago', xp: 60 },
]

const INTERESTS = ['Campus', 'Environment', 'Student Life', 'Academics', 'Local News', 'Sports', 'Arts & Culture', 'Tech']

const STARS = Array.from({ length: 110 }, (_, i) => ({
  id: i,
  x: (i * 37.7 + 13) % 100,
  y: (i * 53.3 + 7) % 100,
  size: ((i * 17) % 25 + 5) / 10,
  delay: ((i * 11) % 30) / 10,
  duration: ((i * 7) % 20) / 10 + 1.8,
}))

// ——— Backdrop for story settings ———
function StoryBackdrop({ setting }: { setting: 'library' | 'beach' | 'rec' }) {
  if (setting === 'library') {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #120900 0%, #2d1800 45%, #3d2200 100%)' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 70%)' }} />
        <div className="absolute top-6 left-4 flex gap-1 opacity-40">
          {[40, 28, 36, 24, 32].map((h, i) => (
            <div key={i} className="rounded-t-sm" style={{ width: 8, height: h, background: `hsl(${30 + i * 15}, 60%, ${20 + i * 3}%)` }} />
          ))}
        </div>
        <div className="absolute top-6 right-4 flex gap-1 opacity-40">
          {[32, 44, 28, 36, 20].map((h, i) => (
            <div key={i} className="rounded-t-sm" style={{ width: 8, height: h, background: `hsl(${20 + i * 12}, 55%, ${18 + i * 3}%)` }} />
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-44" style={{
          background: 'repeating-conic-gradient(#3a2000 0% 25%, #281500 0% 50%) 0 0 / 56px 56px',
          transform: 'perspective(350px) rotateX(50deg)',
          transformOrigin: 'bottom center',
          opacity: 0.7,
        }} />
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.25) 0%, transparent 70%)' }} />
        <div className="absolute top-12 left-12 text-3xl opacity-25 select-none">📖</div>
        <div className="absolute top-20 right-10 text-2xl opacity-20 select-none">🔖</div>
      </div>
    )
  }

  if (setting === 'beach') {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #060d1c 0%, #0a1e38 45%, #0e2845 70%, #060d1c 100%)' }} />
        {Array.from({ length: 35 }, (_, i) => (
          <div key={i} className="absolute rounded-full bg-white star" style={{
            width: ((i * 13) % 20 + 5) / 10,
            height: ((i * 13) % 20 + 5) / 10,
            left: `${(i * 29 + 5) % 92}%`,
            top: `${(i * 17 + 3) % 42}%`,
            '--dur': `${((i * 7) % 15) / 10 + 1.5}s`,
            '--delay': `${((i * 11) % 20) / 10}s`,
          } as React.CSSProperties} />
        ))}
        <div className="absolute w-12 h-12 rounded-full" style={{
          top: '7%', right: '20%',
          background: 'radial-gradient(circle at 38% 38%, #fff 0%, #c8dff0 50%, #8ab2d0 100%)',
          boxShadow: '0 0 32px rgba(150,210,255,0.55)',
        }} />
        <div className="absolute" style={{
          bottom: 128, right: '12%', width: 76, height: 96,
          background: '#06111e',
          clipPath: 'polygon(18% 100%, 0% 100%, 8% 42%, 32% 10%, 58% 18%, 80% 4%, 100% 28%, 100% 100%)',
        }} />
        <div className="absolute bottom-0 left-0 right-0 h-36" style={{ background: 'linear-gradient(180deg, #0b3355 0%, #041525 100%)' }} />
        <div className="absolute" style={{ bottom: 112, left: '-8%', width: '118%', height: 22, background: 'rgba(80,190,255,0.12)', borderRadius: '50%', animation: 'wave 3.2s ease-in-out infinite' }} />
        <div className="absolute" style={{ bottom: 92, left: '-8%', width: '118%', height: 18, background: 'rgba(80,190,255,0.08)', borderRadius: '50%', animation: 'wave 4.1s ease-in-out infinite 0.6s' }} />
        <div className="absolute" style={{ bottom: 0, right: '27%', width: 7, height: 110, background: 'linear-gradient(180deg, rgba(100,200,255,0.38) 0%, transparent 100%)', opacity: 0.6 }} />
      </div>
    )
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #06001a 0%, #150030 55%, #0c001e 100%)' }} />
      <div className="absolute top-0 inset-x-0 h-0.5" style={{ background: 'linear-gradient(90deg, transparent 0%, #A78BFA 25%, #7C3AED 50%, #A78BFA 75%, transparent 100%)', boxShadow: '0 0 18px rgba(167,139,250,0.9)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-44" style={{ background: 'linear-gradient(180deg, rgba(120,87,220,0.07) 0%, rgba(120,87,220,0.13) 100%)', borderTop: '2px solid rgba(167,139,250,0.25)' }} />
      <div className="absolute" style={{ bottom: 16, left: '50%', transform: 'translateX(-50%)', width: 190, height: 190, borderRadius: '50%', border: '2px solid rgba(167,139,250,0.25)', background: 'transparent' }} />
      <div className="absolute" style={{ bottom: 12, left: '50%', transform: 'translateX(-50%)', width: 290, height: 145, borderTop: '2px solid rgba(167,139,250,0.18)', borderLeft: '2px solid rgba(167,139,250,0.18)', borderRight: '2px solid rgba(167,139,250,0.18)', borderRadius: '145px 145px 0 0', background: 'transparent' }} />
      <div className="absolute top-0 left-0 w-48 h-48 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)' }} />
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 70%)' }} />
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-sm font-bold tracking-widest select-none" style={{ color: '#A78BFA', textShadow: '0 0 10px #A78BFA, 0 0 20px rgba(167,139,250,0.5)', fontFamily: 'var(--font-display)' }}>
        ESPORTS LOUNGE
      </div>
      <div className="absolute w-48 h-12 pointer-events-none" style={{ top: 6, left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 70%)' }} />
    </div>
  )
}

// ——— Tour Guide ———
function TourGuide({ text, isGuide, onNext, onSkipAll, onJumpTo, step, total, guideEnabled }: {
  text: string; isGuide: boolean; onNext: () => void; onSkipAll: () => void
  onJumpTo: (i: number) => void; step: number; total: number; guideEnabled: boolean
}) {
  const showGuideLabel = isGuide && guideEnabled
  return (
    <div className="slide-up flex items-end gap-3">
      {/* Guide avatar — only shown when guide is enabled */}
      {guideEnabled && (
        <div className="relative flex-shrink-0 w-20 h-20">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
            style={{ background: 'linear-gradient(135deg, #B5FF4D 0%, #4DFFEE 100%)', boxShadow: '0 0 22px rgba(181,255,77,0.55), 0 0 44px rgba(181,255,77,0.2)' }}>
            🦝
          </div>
          {isGuide && (
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs"
              style={{ background: '#FFB84D', boxShadow: '0 0 8px rgba(255,184,77,0.7)' }}>
              💬
            </div>
          )}
        </div>
      )}

      {/* Bubble */}
      <div className="relative flex-1 rounded-2xl rounded-bl-sm p-4"
        style={{
          background: showGuideLabel ? 'rgba(181,255,77,0.12)' : 'rgba(255,255,255,0.07)',
          border: `1px solid ${showGuideLabel ? 'rgba(181,255,77,0.45)' : 'rgba(255,255,255,0.18)'}`,
          backdropFilter: 'blur(14px)',
        }}>
        {showGuideLabel && (
          <div className="text-xs font-semibold mb-1.5" style={{ color: '#B5FF4D', fontFamily: 'var(--font-display)' }}>Poly says:</div>
        )}
        <p className="text-sm leading-relaxed" style={{ color: '#F0EDFF' }}>{text}</p>

        <div className="flex items-center justify-between mt-3 gap-2">
          {/* Clickable step dots */}
          <div className="flex items-center gap-1 flex-1">
            {Array.from({ length: total }).map((_, i) => (
              <button key={i} onClick={() => onJumpTo(i)}
                className="h-1.5 rounded-full transition-all duration-300 hover:opacity-80"
                style={{ width: i === step ? 16 : 6, background: i <= step ? '#B5FF4D' : 'rgba(255,255,255,0.2)', cursor: 'pointer', border: 'none', padding: 0 }} />
            ))}
          </div>
          {/* Skip all */}
          {step < total - 1 && (
            <button onClick={onSkipAll}
              className="text-xs px-2.5 py-1 rounded-full transition-all duration-150 hover:opacity-80"
              style={{ color: '#9B95C0', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', whiteSpace: 'nowrap' }}>
              Skip all
            </button>
          )}
          {/* Next / Finish */}
          <button onClick={onNext}
            className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 hover:scale-105 active:scale-95"
            style={{ background: '#B5FF4D', color: '#0D0B1E', fontFamily: 'var(--font-display)', whiteSpace: 'nowrap' }}>
            {step === total - 1 ? '✓ Finish' : 'Next →'}
          </button>
        </div>

        {guideEnabled && (
          <div className="absolute -left-2 bottom-5 w-0 h-0" style={{
            borderTop: '7px solid transparent',
            borderBottom: '7px solid transparent',
            borderRight: `8px solid ${showGuideLabel ? 'rgba(181,255,77,0.45)' : 'rgba(255,255,255,0.18)'}`,
          }} />
        )}
      </div>
    </div>
  )
}

// ——— Bottom Nav ———
function BottomNav({ screen, setScreen }: { screen: Screen; setScreen: (s: Screen) => void }) {
  const items = [
    { id: 'lobby' as Screen, label: 'Home', icon: '🌌' },
    { id: 'stories' as Screen, label: 'Stories', icon: '📰' },
    { id: 'social' as Screen, label: 'Social', icon: '👥' },
    { id: 'settings' as Screen, label: 'Profile', icon: '⚙️' },
  ]
  return (
    <div className="flex-shrink-0 flex items-center px-2 pb-3 pt-1 gap-1"
      style={{ background: 'rgba(10,8,25,0.95)', borderTop: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(18px)' }}>
      {items.map(item => {
        const active = screen === item.id
        return (
          <button key={item.id} onClick={() => setScreen(item.id)}
            className="flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl transition-all duration-200"
            style={{ background: active ? 'rgba(181,255,77,0.08)' : 'transparent' }}>
            <span className="text-xl leading-none">{item.icon}</span>
            <span className="text-xs font-medium" style={{ color: active ? '#B5FF4D' : '#9B95C0' }}>{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}

// ——— Story card ———
function StoryCard({ story, completed, onOpen }: { story: Story; completed: boolean; onOpen: () => void }) {
  const bgMap = {
    library: 'linear-gradient(135deg, #2d1400, #5c3000)',
    beach: 'linear-gradient(135deg, #060e1c, #0d2e50)',
    rec: 'linear-gradient(135deg, #0d0020, #28004a)',
  }
  return (
    <button onClick={onOpen}
      className="w-full text-left rounded-2xl p-4 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
      style={{ background: 'rgba(26,23,48,0.95)', border: '1px solid rgba(255,255,255,0.09)' }}>
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
          style={{ background: bgMap[story.setting] }}>
          {story.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            {story.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(181,255,77,0.1)', color: '#B5FF4D', border: '1px solid rgba(181,255,77,0.22)' }}>
                {tag}
              </span>
            ))}
          </div>
          <div className="font-semibold text-sm leading-snug mb-1.5" style={{ color: '#F0EDFF', fontFamily: 'var(--font-display)' }}>
            {story.title}
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs" style={{ color: '#9B95C0' }}>{story.date} · {story.steps.length} stops</div>
            <div className="text-xs font-semibold" style={{ color: completed ? '#9B95C0' : '#B5FF4D' }}>
              {completed ? '✓ Done' : `+${story.xp} XP`}
            </div>
          </div>
        </div>
      </div>
    </button>
  )
}

// ——— Toggle ———
function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange}
      className="relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0"
      style={{ background: value ? '#B5FF4D' : 'rgba(255,255,255,0.12)' }}>
      <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300"
        style={{ left: value ? 26 : 2, boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
    </button>
  )
}

// ——— Main App ———
export default function App() {
  const [screen, setScreen] = useState<Screen>('lobby')
  const [activeStory, setActiveStory] = useState<Story | null>(null)
  const [step, setStep] = useState(0)
  const [completed, setCompleted] = useState<number[]>([])
  const [userXP, setUserXP] = useState(320)
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null)
  const [showXP, setShowXP] = useState(false)
  const [earnedXP, setEarnedXP] = useState(0)

  // Stories screen filters
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  // Settings
  const [interests, setInterests] = useState(['Campus', 'Environment', 'Student Life'])
  const [sound, setSound] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [colorTheme, setColorTheme] = useState<'lime' | 'pink' | 'cyan'>('lime')
  const [guideEnabled, setGuideEnabled] = useState(true)
  const [selfPaced, setSelfPaced] = useState(false)

  const themeColor = colorTheme === 'lime' ? '#B5FF4D' : colorTheme === 'pink' ? '#FF6B9D' : '#4DFFEE'

  // Filtered story list
  const filteredStories = STORIES.filter(s => {
    const matchesSearch = searchQuery === '' ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesFilter = activeFilter === null || s.tags.includes(activeFilter)
    return matchesSearch && matchesFilter
  })

  function openStory(story: Story) {
    setActiveStory(story)
    setStep(0)
    setScreen('playing')
  }

  function finishStory(story: Story) {
    const xp = story.xp
    setCompleted(c => Array.from(new Set([...c, story.id])))
    setUserXP(x => x + xp)
    setEarnedXP(xp)
    setShowXP(true)
    setTimeout(() => {
      setShowXP(false)
      setActiveStory(null)
      setScreen('stories')
    }, 2200)
  }

  function handleNext() {
    if (!activeStory) return
    if (step < activeStory.steps.length - 1) {
      setStep(s => s + 1)
    } else {
      finishStory(activeStory)
    }
  }

  function handleSkipAll() {
    if (!activeStory) return
    finishStory(activeStory)
  }

  function handleJumpTo(i: number) {
    setStep(i)
  }

  // ——— LOBBY ———
  if (screen === 'lobby') {
    return (
      <div className="relative w-full h-screen overflow-hidden select-none" style={{ background: '#0D0B1E', fontFamily: 'var(--font-body)' }}>
        {STARS.map(s => (
          <div key={s.id} className="absolute rounded-full bg-white star pointer-events-none" style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.size, height: s.size,
            '--dur': `${s.duration}s`, '--delay': `${s.delay}s`,
          } as React.CSSProperties} />
        ))}

        <div className="absolute w-[500px] h-[500px] rounded-full pointer-events-none opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #B5FF4D 0%, transparent 65%)', top: '5%', left: '-5%' }} />
        <div className="absolute w-80 h-80 rounded-full pointer-events-none opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #FF6B9D 0%, transparent 65%)', bottom: '10%', right: '-2%' }} />
        <div className="absolute w-56 h-56 rounded-full pointer-events-none opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #4DFFEE 0%, transparent 65%)', top: '35%', right: '2%' }} />

        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <div className="text-2xl font-bold tracking-wide" style={{ fontFamily: 'var(--font-display)', color: '#B5FF4D' }}>
              MUSTANG UNIVERSE
            </div>
            <div className="text-xs mt-0.5" style={{ color: '#9B95C0' }}>Powered by Mustang News</div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold"
              style={{ background: 'rgba(181,255,77,0.1)', border: '1px solid rgba(181,255,77,0.28)', color: '#B5FF4D' }}>
              ⚡ {userXP} XP
            </div>
            <button onClick={() => setScreen('settings')}
              className="w-9 h-9 rounded-full flex items-center justify-center text-lg transition-all hover:scale-110"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)' }}>
              ⚙️
            </button>
          </div>
        </div>

        <div className="absolute top-[72px] left-0 right-0 text-center z-10 pointer-events-none">
          <div className="text-xs" style={{ color: '#9B95C0' }}>Choose your destination</div>
        </div>

        {PLANETS.map((planet, i) => (
          <div key={planet.id}
            className="absolute cursor-pointer z-10 planet-float"
            style={{
              left: `${planet.x}%`, top: `${planet.y}%`,
              '--float-dur': `${3.6 + i * 0.65}s`,
              animationDelay: `${i * 0.45}s`,
            } as React.CSSProperties}
            onMouseEnter={() => setHoveredPlanet(planet.id)}
            onMouseLeave={() => setHoveredPlanet(null)}
            onClick={() => setScreen(planet.target)}>

            <div className="relative flex items-center justify-center transition-transform duration-200"
              style={{
                width: planet.size, height: planet.size, borderRadius: '50%',
                background: `radial-gradient(circle at 36% 34%, ${planet.color}cc 0%, ${planet.color}88 45%, ${planet.color}44 100%)`,
                boxShadow: hoveredPlanet === planet.id
                  ? `0 0 44px ${planet.color}70, 0 0 90px ${planet.color}38`
                  : `0 0 22px ${planet.color}40`,
                transform: hoveredPlanet === planet.id ? 'scale(1.12)' : 'scale(1)',
              }}>
              <div className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle at 30% 28%, rgba(255,255,255,0.28) 0%, transparent 50%)' }} />
              <span className="text-3xl relative z-10">{planet.emoji}</span>
              {planet.hasRing && (
                <div className="absolute pointer-events-none" style={{
                  width: planet.size * 1.65, height: planet.size * 0.38,
                  border: `2px solid ${planet.color}55`, borderRadius: '50%',
                  transform: 'rotateX(72deg)',
                  left: `${-planet.size * 0.325}px`, top: `${planet.size * 0.31}px`,
                }} />
              )}
            </div>

            <div className="absolute pointer-events-none text-center"
              style={{ top: planet.size + 10, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
              <div className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: planet.color }}>
                {planet.label}
              </div>
              <div className="text-xs mt-0.5" style={{ color: '#9B95C0' }}>{planet.sublabel}</div>
            </div>
          </div>
        ))}

        <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none">
          <div className="text-xs" style={{ color: '#9B95C0' }}>Tap a planet to explore</div>
        </div>
      </div>
    )
  }

  // ——— STORIES LIST ———
  if (screen === 'stories') {
    return (
      <div className="w-full h-screen flex flex-col" style={{ background: '#0D0B1E', fontFamily: 'var(--font-body)' }}>
        {/* Header */}
        <div className="flex items-center gap-3 px-5 pt-6 pb-3 flex-shrink-0">
          <button onClick={() => setScreen('lobby')}
            className="w-9 h-9 rounded-full flex items-center justify-center text-base transition-all hover:scale-110 flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)', color: '#F0EDFF' }}>
            ←
          </button>
          <div>
            <div className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: '#F0EDFF' }}>Stories</div>
            <div className="text-xs" style={{ color: '#9B95C0' }}>{filteredStories.length} of {STORIES.length} stories</div>
          </div>
          <div className="ml-auto px-3 py-1.5 rounded-full text-sm font-semibold flex-shrink-0"
            style={{ background: 'rgba(181,255,77,0.1)', border: '1px solid rgba(181,255,77,0.28)', color: '#B5FF4D' }}>
            ⚡ {userXP}
          </div>
        </div>

        {/* Search bar */}
        <div className="px-5 pb-2 flex-shrink-0">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none" style={{ color: '#9B95C0' }}>🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search stories, topics..."
              className="w-full pl-9 pr-9 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: searchQuery ? '1px solid rgba(181,255,77,0.4)' : '1px solid rgba(255,255,255,0.12)',
                color: '#F0EDFF',
                fontFamily: 'var(--font-body)',
              }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm transition-all hover:opacity-70"
                style={{ color: '#9B95C0', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 px-5 pb-3 overflow-x-auto flex-shrink-0">
          <button
            onClick={() => setActiveFilter(null)}
            className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all"
            style={{
              background: activeFilter === null ? '#B5FF4D' : 'rgba(255,255,255,0.06)',
              border: activeFilter === null ? 'none' : '1px solid rgba(255,255,255,0.12)',
              color: activeFilter === null ? '#0D0B1E' : '#9B95C0',
            }}>
            All
          </button>
          {ALL_TAGS.map(tag => (
            <button key={tag}
              onClick={() => setActiveFilter(activeFilter === tag ? null : tag)}
              className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all"
              style={{
                background: activeFilter === tag ? '#B5FF4D' : 'rgba(255,255,255,0.06)',
                border: activeFilter === tag ? 'none' : '1px solid rgba(255,255,255,0.12)',
                color: activeFilter === tag ? '#0D0B1E' : '#9B95C0',
              }}>
              {tag}
            </button>
          ))}
        </div>

        {/* Story list */}
        <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-3">
          {filteredStories.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2">
              <div className="text-3xl">🔭</div>
              <div className="text-sm font-medium" style={{ color: '#9B95C0' }}>No stories match "{searchQuery}"</div>
              <button onClick={() => { setSearchQuery(''); setActiveFilter(null) }}
                className="text-xs px-3 py-1.5 rounded-full mt-1"
                style={{ color: '#B5FF4D', border: '1px solid rgba(181,255,77,0.3)', background: 'transparent' }}>
                Clear filters
              </button>
            </div>
          ) : (
            filteredStories.map(story => (
              <StoryCard key={story.id} story={story} completed={completed.includes(story.id)} onOpen={() => openStory(story)} />
            ))
          )}

          {filteredStories.length > 0 && (
            <div className="rounded-2xl p-5 mt-2"
              style={{ background: 'linear-gradient(135deg, rgba(77,255,238,0.1) 0%, rgba(181,255,77,0.06) 100%)', border: '1px solid rgba(77,255,238,0.22)' }}>
              <div className="text-sm font-semibold mb-1" style={{ fontFamily: 'var(--font-display)', color: '#4DFFEE' }}>
                🔭 Deep Dives coming soon
              </div>
              <div className="text-xs" style={{ color: '#9B95C0' }}>
                Longer explainer content on the big stories shaping Cal Poly and SLO.
              </div>
            </div>
          )}
        </div>

        <BottomNav screen={screen} setScreen={setScreen} />
      </div>
    )
  }

  // ——— PLAYING ———
  if (screen === 'playing' && activeStory) {
    const currentStep = activeStory.steps[step]
    const locationLabel = activeStory.setting === 'library' ? 'Kennedy Library' : activeStory.setting === 'beach' ? 'Morro Bay' : 'Rec Center'

    // In self-paced mode, show all steps as a scrollable list instead of one at a time
    if (selfPaced) {
      return (
        <div className="relative w-full h-screen flex flex-col overflow-hidden" style={{ fontFamily: 'var(--font-body)' }}>
          <StoryBackdrop setting={activeStory.setting} />

          {showXP && (
            <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
              <div className="xp-pop text-5xl font-bold" style={{ fontFamily: 'var(--font-display)', color: '#B5FF4D', textShadow: '0 0 24px #B5FF4D, 0 0 50px rgba(181,255,77,0.5)' }}>
                +{earnedXP} XP!
              </div>
            </div>
          )}

          {/* Top bar */}
          <div className="relative z-20 flex items-center justify-between gap-3 px-4 pt-4 pb-2 flex-shrink-0">
            <button onClick={() => { setScreen('stories'); setActiveStory(null) }}
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0"
              style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.2)', color: '#F0EDFF', backdropFilter: 'blur(10px)' }}>
              ←
            </button>
            <div className="text-xs font-medium truncate text-center flex-1"
              style={{ color: 'rgba(255,255,255,0.75)', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
              {activeStory.title}
            </div>
            <div className="px-2.5 py-1 rounded-full text-xs flex-shrink-0"
              style={{ background: 'rgba(77,255,238,0.15)', border: '1px solid rgba(77,255,238,0.35)', color: '#4DFFEE', backdropFilter: 'blur(10px)' }}>
              Self-paced
            </div>
          </div>

          {/* Location badge */}
          <div className="relative z-20 flex justify-center pb-2 flex-shrink-0">
            <div className="px-3 py-1 rounded-full text-xs"
              style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(10px)' }}>
              📍 {locationLabel}
            </div>
          </div>

          {/* All steps as cards */}
          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3 relative z-10">
            {activeStory.steps.map((s, i) => (
              <div key={i} className="rounded-2xl p-4 fade-in"
                style={{ background: 'rgba(13,11,30,0.88)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(14px)', animationDelay: `${i * 0.06}s` }}>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(181,255,77,0.15)', color: '#B5FF4D', border: '1px solid rgba(181,255,77,0.3)' }}>
                    {i + 1}
                  </div>
                  <p className="text-sm leading-relaxed flex-1" style={{ color: '#F0EDFF' }}>{s.text}</p>
                </div>
              </div>
            ))}
            <button onClick={() => finishStory(activeStory)}
              className="w-full py-3 rounded-2xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: '#B5FF4D', color: '#0D0B1E', fontFamily: 'var(--font-display)' }}>
              ✓ Mark Complete · +{activeStory.xp} XP
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="relative w-full h-screen overflow-hidden" style={{ fontFamily: 'var(--font-body)' }}>
        <StoryBackdrop setting={activeStory.setting} />

        {showXP && (
          <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="xp-pop text-5xl font-bold" style={{ fontFamily: 'var(--font-display)', color: '#B5FF4D', textShadow: '0 0 24px #B5FF4D, 0 0 50px rgba(181,255,77,0.5)' }}>
              +{earnedXP} XP!
            </div>
          </div>
        )}

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between gap-3 px-4 pt-4">
          <button onClick={() => { setScreen('stories'); setActiveStory(null) }}
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.2)', color: '#F0EDFF', backdropFilter: 'blur(10px)' }}>
            ←
          </button>
          <div className="text-xs font-medium truncate text-center flex-1"
            style={{ color: 'rgba(255,255,255,0.75)', textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
            {activeStory.title}
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0"
            style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.2)', color: '#B5FF4D', backdropFilter: 'blur(10px)' }}>
            {step + 1}/{activeStory.steps.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute z-20 left-4 right-4" style={{ top: 56 }}>
          <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${((step + 1) / activeStory.steps.length) * 100}%`, background: '#B5FF4D' }} />
          </div>
        </div>

        {/* Location badge */}
        <div className="absolute z-20 left-1/2 -translate-x-1/2" style={{ top: 66 }}>
          <div className="px-3 py-1 rounded-full text-xs"
            style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(10px)' }}>
            📍 {locationLabel}
          </div>
        </div>

        {/* Tour guide */}
        <div className="absolute bottom-6 left-4 right-4 z-20">
          <TourGuide
            key={step}
            text={currentStep.text}
            isGuide={currentStep.isGuide}
            onNext={handleNext}
            onSkipAll={handleSkipAll}
            onJumpTo={handleJumpTo}
            step={step}
            total={activeStory.steps.length}
            guideEnabled={guideEnabled}
          />
        </div>
      </div>
    )
  }

  // ——— SOCIAL (streamlined — content-first, minimal social noise) ———
  if (screen === 'social') {
    return (
      <div className="w-full h-screen flex flex-col" style={{ background: '#0D0B1E', fontFamily: 'var(--font-body)' }}>
        <div className="flex items-center gap-3 px-5 pt-6 pb-4 flex-shrink-0">
          <button onClick={() => setScreen('lobby')}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)', color: '#F0EDFF' }}>
            ←
          </button>
          <div>
            <div className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: '#4DFFEE' }}>Community</div>
            <div className="text-xs" style={{ color: '#9B95C0' }}>What people are reading</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-6">
          {/* Trending — primary focus */}
          <div>
            <div className="text-xs font-semibold mb-3 tracking-widest" style={{ color: '#9B95C0' }}>TRENDING NOW 🔥</div>
            <div className="space-y-2.5">
              {STORIES.map((s, i) => (
                <button key={s.id} onClick={() => openStory(s)}
                  className="w-full text-left flex items-center gap-4 p-4 rounded-2xl transition-all duration-150 hover:scale-[1.015] active:scale-[0.985]"
                  style={{ background: 'rgba(26,23,48,0.95)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="text-2xl font-bold w-8 text-center flex-shrink-0" style={{
                    fontFamily: 'var(--font-display)',
                    color: i === 0 ? '#FFB84D' : i === 1 ? '#9B95C0' : '#6B6480',
                  }}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold leading-snug mb-1" style={{ color: '#F0EDFF', fontFamily: 'var(--font-display)' }}>
                      {s.title}
                    </div>
                    <div className="flex items-center gap-2">
                      {s.tags.map(t => (
                        <span key={t} className="text-xs" style={{ color: '#9B95C0' }}>{t}</span>
                      ))}
                      <span className="text-xs" style={{ color: '#9B95C0' }}>·</span>
                      <span className="text-xs" style={{ color: '#9B95C0' }}>{s.date}</span>
                    </div>
                  </div>
                  <div className="text-xs font-semibold flex-shrink-0" style={{ color: completed.includes(s.id) ? '#9B95C0' : '#B5FF4D' }}>
                    {completed.includes(s.id) ? '✓' : `+${s.xp}`}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Activity — secondary, compact */}
          <div>
            <div className="text-xs font-semibold mb-3 tracking-widest" style={{ color: '#9B95C0' }}>RECENTLY READ</div>
            <div className="space-y-2">
              {ACTIVITIES.slice(0, 4).map((a, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                  style={{ background: 'rgba(26,23,48,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="text-lg flex-shrink-0">{a.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs leading-snug" style={{ color: '#9B95C0' }}>
                      <span className="font-semibold" style={{ color: '#F0EDFF' }}>{a.user}</span>
                      {' '}{a.action}{' '}
                      <span style={{ color: 'rgba(240,237,255,0.7)' }}>{a.story}</span>
                    </div>
                  </div>
                  <div className="text-xs flex-shrink-0" style={{ color: '#6B6480' }}>{a.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <BottomNav screen={screen} setScreen={setScreen} />
      </div>
    )
  }

  // ——— SETTINGS ———
  if (screen === 'settings') {
    return (
      <div className="w-full h-screen flex flex-col" style={{ background: '#0D0B1E', fontFamily: 'var(--font-body)' }}>
        <div className="flex items-center gap-3 px-5 pt-6 pb-4 flex-shrink-0">
          <button onClick={() => setScreen('lobby')}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)', color: '#F0EDFF' }}>
            ←
          </button>
          <div className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: '#FFB84D' }}>Personalize</div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-6">
          {/* Profile */}
          <div className="flex items-center gap-4 p-4 rounded-2xl"
            style={{ background: 'rgba(26,23,48,0.95)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #B5FF4D, #4DFFEE)', boxShadow: '0 0 20px rgba(181,255,77,0.4)' }}>
              🎓
            </div>
            <div className="flex-1">
              <div className="font-bold text-base" style={{ fontFamily: 'var(--font-display)', color: '#F0EDFF' }}>Cal Poly Student</div>
              <div className="text-sm" style={{ color: '#9B95C0' }}>Level 8 Explorer</div>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${userXP % 100}%`, background: 'linear-gradient(90deg, #B5FF4D, #4DFFEE)' }} />
                </div>
                <div className="text-xs font-semibold" style={{ color: '#B5FF4D' }}>{userXP} XP</div>
              </div>
            </div>
          </div>

          {/* Story reading mode */}
          <div>
            <div className="text-xs font-semibold mb-1 tracking-widest" style={{ color: '#9B95C0' }}>STORY MODE</div>
            <div className="text-xs mb-3" style={{ color: '#9B95C0' }}>Choose how you move through stories</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: false, label: 'Guided', sub: 'Step-by-step with Poly', icon: '🦝' },
                { id: true, label: 'Self-paced', sub: 'Read at your own speed', icon: '⚡' },
              ].map(mode => (
                <button key={String(mode.id)} onClick={() => setSelfPaced(mode.id)}
                  className="p-3.5 rounded-xl text-left transition-all hover:scale-[1.02]"
                  style={{
                    background: selfPaced === mode.id ? 'rgba(181,255,77,0.12)' : 'rgba(26,23,48,0.9)',
                    border: `1px solid ${selfPaced === mode.id ? 'rgba(181,255,77,0.45)' : 'rgba(255,255,255,0.08)'}`,
                  }}>
                  <div className="text-xl mb-1">{mode.icon}</div>
                  <div className="text-sm font-semibold" style={{ color: selfPaced === mode.id ? '#B5FF4D' : '#F0EDFF', fontFamily: 'var(--font-display)' }}>{mode.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#9B95C0' }}>{mode.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Dialogue options */}
          <div>
            <div className="text-xs font-semibold mb-3 tracking-widest" style={{ color: '#9B95C0' }}>DIALOGUE OPTIONS</div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 p-3.5 rounded-xl"
                style={{ background: 'rgba(26,23,48,0.9)', border: '1px solid rgba(255,255,255,0.08)', opacity: selfPaced ? 0.4 : 1 }}>
                <span className="text-xl flex-shrink-0">🦝</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium" style={{ color: '#F0EDFF' }}>Show Poly</div>
                  <div className="text-xs" style={{ color: '#9B95C0' }}>Display the guide character and labels</div>
                </div>
                <Toggle value={guideEnabled && !selfPaced} onChange={() => !selfPaced && setGuideEnabled(v => !v)} />
              </div>
            </div>
            {selfPaced && (
              <div className="text-xs mt-1.5 px-1" style={{ color: '#9B95C0' }}>
                Dialogue options are paused in self-paced mode.
              </div>
            )}
          </div>

          {/* App preferences */}
          <div>
            <div className="text-xs font-semibold mb-3 tracking-widest" style={{ color: '#9B95C0' }}>APP PREFERENCES</div>
            <div className="space-y-2.5">
              {[
                { label: 'Sound Effects', sub: 'XP pops and ambient sounds', icon: '🔊', val: sound, set: setSound },
                { label: 'Notifications', sub: 'New stories from Mustang News', icon: '🔔', val: notifications, set: setNotifications },
              ].map(({ label, sub, icon, val, set }) => (
                <div key={label} className="flex items-center gap-3 p-3.5 rounded-xl"
                  style={{ background: 'rgba(26,23,48,0.9)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span className="text-xl flex-shrink-0">{icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium" style={{ color: '#F0EDFF' }}>{label}</div>
                    <div className="text-xs" style={{ color: '#9B95C0' }}>{sub}</div>
                  </div>
                  <Toggle value={val} onChange={() => set(!val)} />
                </div>
              ))}
            </div>
          </div>

          {/* Accent color */}
          <div>
            <div className="text-xs font-semibold mb-3 tracking-widest" style={{ color: '#9B95C0' }}>ACCENT COLOR</div>
            <div className="flex gap-3">
              {(['lime', 'pink', 'cyan'] as const).map(c => {
                const colors = { lime: '#B5FF4D', pink: '#FF6B9D', cyan: '#4DFFEE' }
                const active = colorTheme === c
                return (
                  <button key={c} onClick={() => setColorTheme(c)}
                    className="w-12 h-12 rounded-full transition-all duration-200 hover:scale-110"
                    style={{
                      background: colors[c],
                      boxShadow: active ? `0 0 22px ${colors[c]}80, 0 0 44px ${colors[c]}30` : 'none',
                      border: active ? '3px solid white' : '3px solid transparent',
                    }} />
                )
              })}
            </div>
          </div>

          {/* Interests */}
          <div>
            <div className="text-xs font-semibold mb-1 tracking-widest" style={{ color: '#9B95C0' }}>MY INTERESTS</div>
            <div className="text-xs mb-3" style={{ color: '#9B95C0' }}>Shapes which stories surface first</div>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map(interest => {
                const active = interests.includes(interest)
                return (
                  <button key={interest}
                    onClick={() => setInterests(prev => active ? prev.filter(i => i !== interest) : [...prev, interest])}
                    className="px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 hover:scale-105"
                    style={{
                      background: active ? `rgba(181,255,77,0.14)` : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${active ? themeColor : 'rgba(255,255,255,0.14)'}`,
                      color: active ? themeColor : '#9B95C0',
                    }}>
                    {interest}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Progress */}
          <div>
            <div className="text-xs font-semibold mb-3 tracking-widest" style={{ color: '#9B95C0' }}>YOUR PROGRESS</div>
            <div className="p-4 rounded-2xl" style={{ background: 'rgba(26,23,48,0.9)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold" style={{ color: '#F0EDFF', fontFamily: 'var(--font-display)' }}>
                  {completed.length} / {STORIES.length} completed
                </div>
                <div className="text-sm font-bold" style={{ color: '#B5FF4D' }}>⚡ {userXP} XP</div>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${(completed.length / STORIES.length) * 100}%`, background: 'linear-gradient(90deg, #B5FF4D, #4DFFEE)' }} />
              </div>
            </div>
          </div>
        </div>

        <BottomNav screen={screen} setScreen={setScreen} />
      </div>
    )
  }

  return null
}
