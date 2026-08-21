import { motion, AnimatePresence } from 'framer-motion'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, Settings, UploadCloud, Trash2, MonitorPlay, History, Crosshair, Scissors, Package, HelpCircle, X } from 'lucide-react'
import { Dashboard } from './components/Dashboard'
import { AchievementPopup } from './components/AchievementPopup'

const LANGUAGES = [
  { code: 'en', label: 'ENGLISH' },
  { code: 'ru', label: 'РУССКИЙ' },
]

// Simple typewriter effect component
const TypewriterText = ({ text, delay = 0, speed = 40 }: { text: string, delay?: number, speed?: number }) => {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1))
        i++
        if (i >= text.length) clearInterval(interval)
      }, speed)
      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timer)
  }, [text, delay, speed])

  return <span>{displayedText}</span>
}

// Custom animated checkbox
const PixelCheckbox = ({ label, checked, onChange, icon: Icon }: { label: string, checked: boolean, onChange: (val: boolean) => void, icon: any }) => {
  return (
    <div 
      className={`flex items-center gap-3 p-3 cursor-pointer transition-colors border-2 ${checked ? 'bg-pixel-darkblue/50 border-pixel-blue' : 'bg-black/30 border-transparent hover:bg-black/50'}`}
      onClick={() => onChange(!checked)}
    >
      <div className={`w-6 h-6 border-2 flex items-center justify-center shrink-0 ${checked ? 'border-pixel-green bg-pixel-darkgreen text-pixel-dark' : 'border-gray-500 bg-black'}`}>
        {checked && <Check size={16} strokeWidth={4} />}
      </div>
      <Icon size={18} className={checked ? "text-pixel-light" : "text-gray-500"} />
      <span className={`text-sm ${checked ? 'text-pixel-light' : 'text-gray-400'}`}>{label}</span>
    </div>
  )
}

const PixelUfo = () => {
  const sprite = [
    "        00000000        ",
    "      001111222200      ",
    "     01112222333330     ",
    "    0112222333333330    ",
    "   000000000000000000   ",
    "  04444444444444444440  ",
    " 0555555555555555555550 ",
    "066666666666666666666660",
    "070777077707770777077700",
    " 0000000000000000000000 ",
    "   0  0   0  0   0  0   ",
  ]
  
  const colors: Record<string, string> = {
    '0': '#0f172a', // Outline dark
    '1': '#7dd3fc', // Glass bright
    '2': '#0ea5e9', // Glass mid
    '3': '#0369a1', // Glass dark
    '4': '#e2e8f0', // Metal top highlight
    '5': '#94a3b8', // Metal light
    '6': '#64748b', // Metal mid
    '7': '#334155', // Metal dark bottom
  }

  return (
    <div className="relative">
      <svg viewBox="0 0 24 11" width="72" height="33" shapeRendering="crispEdges" className="drop-shadow-[0_4px_8px_rgba(56,189,248,0.4)]">
        {sprite.map((row, y) => 
          row.split('').map((char, x) => {
            if (char === ' ') return null;
            return <rect key={`${x}-${y}`} x={x} y={y} width="1.05" height="1.05" fill={colors[char] || '#000'} />
          })
        )}
      </svg>
      {/* Engine Lights */}
      <motion.div className="absolute w-[6px] h-[6px] bg-pixel-yellow left-[10px] top-[24px]" animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.4 }} />
      <motion.div className="absolute w-[6px] h-[6px] bg-pixel-red left-[33px] top-[24px]" animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.4, delay: 0.2 }} />
      <motion.div className="absolute w-[6px] h-[6px] bg-pixel-yellow left-[55px] top-[24px]" animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.4, delay: 0.1 }} />
    </div>
  )
}


const BootSequence = ({ onComplete }: { onComplete: () => void }) => {
  const [lines, setLines] = useState<number>(0)
  
  const hasYt = !!localStorage.getItem('ytRefreshToken')
  const hasVk = !!localStorage.getItem('vkToken')
  const hasTg = !!localStorage.getItem('tgBotToken')

  useEffect(() => {
    const timer = setInterval(() => {
      setLines(l => {
        if (l >= 6) {
          clearInterval(timer)
          setTimeout(onComplete, 1600) // delay to let explosion play
          return l + 1
        }
        return l + 1
      })
    }, 900)
    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-8 font-mono text-sm md:text-xl overflow-hidden">
      <div className="w-full max-w-2xl flex flex-col gap-3 z-10 relative">
        {lines >= 1 && <motion.div initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} className="text-[#00ffff]">&gt; SYSTEM INITIALIZATION V0.9...</motion.div>}
        {lines >= 2 && <motion.div initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} className="text-pixel-light">&gt; CHECKING YOUTUBE UPLINK....... <span className={hasYt ? 'text-pixel-green font-bold' : 'text-pixel-red font-bold'}>[{hasYt ? 'OK' : 'MISSING'}]</span></motion.div>}
        {lines >= 3 && <motion.div initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} className="text-pixel-light">&gt; CHECKING VKONTAKTE NODE....... <span className={hasVk ? 'text-pixel-green font-bold' : 'text-pixel-red font-bold'}>[{hasVk ? 'OK' : 'MISSING'}]</span></motion.div>}
        {lines >= 4 && <motion.div initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} className="text-pixel-light">&gt; CHECKING TELEGRAM BOTNET...... <span className={hasTg ? 'text-pixel-green font-bold' : 'text-pixel-red font-bold'}>[{hasTg ? 'OK' : 'MISSING'}]</span></motion.div>}
        
        {lines >= 5 && <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-[#ffaa00] mt-6 animate-pulse">&gt; PRE-FLIGHT VALIDATION COMPLETE. STANDBY...</motion.div>}
      </div>
      
      {lines >= 7 && (
        <motion.div 
          className="absolute inset-0 bg-white z-20 origin-center"
          initial={{ scale: 0, opacity: 0.8, borderRadius: '100%' }}
          animate={{ scale: 10, opacity: 1, borderRadius: '0%' }}
          transition={{ duration: 0.5, ease: "easeIn" }}
        />
      )}
    </div>
  )
}

function App() {
  const { t, i18n } = useTranslation()
  const [pipelineActive, setPipelineActive] = useState(false)
  const [appState, setAppState] = useState<'lang_select' | 'boot_sequence' | 'execute' | 'parsing' | 'ready' | 'downloading' | 'settings' | 'api_guide' | 'success' | 'uploading' | 'dashboard' | 'history'>('lang_select')
  const [navSection, setNavSection] = useState<'mission' | 'settings' | 'history' | 'trim' | 'queue'>('mission')
  const [activeInstruction, setActiveInstruction] = useState<string | null>(null)
    const [activeSettingsTab, setActiveSettingsTab] = useState<'general' | 'youtube' | 'vk' | 'telegram' | 'rutube' | 'dzen'>('general')
  const [globalAlert, setGlobalAlert] = useState<string | null>(null)
  
  const [gamification, setGamification] = useState<any>(null)
  const [historyLog, setHistoryLog] = useState<any[]>([])
  
  const loadGamification = async () => {
    if (window.api?.getGamification) {
      setGamification(await window.api.getGamification())
      setHistoryLog(await window.api.getHistory())
    }
  }

  useEffect(() => {
    loadGamification()
  }, [])

  const [hoveredLang, setHoveredLang] = useState('en')
  const [twitchUrl, setTwitchUrl] = useState('')
  const [videoData, setVideoData] = useState<any>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [downloadSpeed, setDownloadSpeed] = useState('')
  const [downloadDir, setDownloadDir] = useState(() => localStorage.getItem('appDownloadDir') || '')
  const [ytClientId, setYtClientId] = useState(() => localStorage.getItem('ytClientId') || '')
  const [ytClientSecret, setYtClientSecret] = useState(() => localStorage.getItem('ytClientSecret') || '')
  const [vkToken, setVkToken] = useState(() => localStorage.getItem('vkToken') || 'vk1.a.SURR5qJV7K9tR8GmUF00NPmi6_BWvpxr67bgZAK_E2AkJTZeaAZ9jgEHeUdTT1ICr0xLqbDqdu4AQhlwXQuWEcbrrIhMowRfBXohRdKz0ajz_VYQVbVrrcWCLguSw7NtJKaHjqAIYAtpgwCUoy0QXXf5K7f-uAdX9BNyEE_7a9kLEiAu4w_lIQ307nXfz0I8WoOa7TTAkn04kkRM5ixgBg')
  
  const [tempDownloadDir, setTempDownloadDir] = useState(() => localStorage.getItem('appDownloadDir') || '')
  const [tempLanguage, setTempLanguage] = useState(() => localStorage.getItem('appLanguage') || 'ru')
  const [tempYtClientId, setTempYtClientId] = useState(() => localStorage.getItem('ytClientId') || '')
  const [tempYtClientSecret, setTempYtClientSecret] = useState(() => localStorage.getItem('ytClientSecret') || '')
  const [tempVkToken, setTempVkToken] = useState(() => localStorage.getItem('vkToken') || 'vk1.a.SURR5qJV7K9tR8GmUF00NPmi6_BWvpxr67bgZAK_E2AkJTZeaAZ9jgEHeUdTT1ICr0xLqbDqdu4AQhlwXQuWEcbrrIhMowRfBXohRdKz0ajz_VYQVbVrrcWCLguSw7NtJKaHjqAIYAtpgwCUoy0QXXf5K7f-uAdX9BNyEE_7a9kLEiAu4w_lIQ307nXfz0I8WoOa7TTAkn04kkRM5ixgBg')
  const [tempTgBotToken, setTempTgBotToken] = useState(() => localStorage.getItem('tgBotToken') || '')
  const [tempTgChannelId, setTempTgChannelId] = useState(() => localStorage.getItem('tgChannelId') || '')
  const [tgTopicId, setTgTopicId] = useState(() => localStorage.getItem('tgTopicId') || '')
  const [tempTgTopicId, setTempTgTopicId] = useState(() => localStorage.getItem('tgTopicId') || '')
  const [vkGroupId, setVkGroupId] = useState(() => localStorage.getItem('vkGroupId') || '240867604')
  const [tempVkGroupId, setTempVkGroupId] = useState(() => localStorage.getItem('vkGroupId') || '240867604')
  const [tgValidation, setTgValidation] = useState<any>({status: 'idle'})
  const [vkValidation, setVkValidation] = useState<any>({status: 'idle'})
  const [useYt, setUseYt] = useState(true)
  const [useVk, setUseVk] = useState(true)
  const [useTg, setUseTg] = useState(true)
  const [autoDelete, setAutoDelete] = useState(false)
  const [downloadStatus, setDownloadStatus] = useState('')
  const [ytProgress, setYtProgress] = useState(0)
  const [ytStatus, setYtStatus] = useState('')
  const [vkProgress, setVkProgress] = useState(0)
  const [vkStatus, setVkStatus] = useState('')
  const [tgProgress, setTgProgress] = useState(0)
  const [tgStatus, setTgStatus] = useState('')
  const [vkPostToWall, setVkPostToWall] = useState(() => localStorage.getItem('vkPostToWall') === 'true')
  const [tempVkPostToWall, setTempVkPostToWall] = useState(() => localStorage.getItem('vkPostToWall') === 'true')
  
  useEffect(() => {
    if (!tempTgBotToken || tempTgBotToken.trim().length < 20) {
      setTgValidation({status: 'idle'})
      return
    }
    setTgValidation({status: 'loading'})
    const timer = setTimeout(async () => {
      try {
        if (!(window as any).api.tgValidateToken) {
          setTgValidation({status: 'invalid', error: 'Метод tgValidateToken не найден.'})
          return;
        }
        const res = await (window as any).api.tgValidateToken(tempTgBotToken.trim())
        if (res.valid) {
          setTgValidation({status: 'valid', name: res.name})
        } else {
          setTgValidation({status: 'invalid', error: res.error})
        }
      } catch (err: any) {
        setTgValidation({status: 'invalid', error: err.message})
      }
    }, 800)
    return () => clearTimeout(timer)
  }, [tempTgBotToken])

  useEffect(() => {
    if (!tempVkToken || tempVkToken.trim().length < 20) {
      setVkValidation({status: 'idle'})
      return
    }
    const delay = setTimeout(async () => {
      setVkValidation({status: 'loading'})
      try {
        const res = await (window as any).api.vkValidateToken(tempVkToken.trim())
        if (res.valid) {
          setVkValidation({status: 'valid', name: res.name})
        } else {
          setVkValidation({status: 'invalid', error: res.error})
        }
      } catch (err: any) {
        setVkValidation({status: 'invalid', error: err.message})
      }
    }, 1000)
    return () => clearTimeout(delay)
  }, [tempVkToken])
  
  const [downloadedPath, setDownloadedPath] = useState('')
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('appLanguage')) {
      setAppState('boot_sequence')
    }

    ;(window as any).api.onDownloadProgress((data: any) => {
      setDownloadProgress(data.percent)
      if (data.status) setDownloadStatus(data.status)
      if (data.speed) setDownloadSpeed(data.speed)
    })
    
    ;(window as any).api.onUploadProgressYt((data: any) => {
      setYtProgress(data.percent)
      if (data.status) setYtStatus(data.status)
    })
    
    ;(window as any).api.onUploadProgressVk((data: any) => {
      setVkProgress(data.percent)
      if (data.status) setVkStatus(data.status)
    })
    
    ;(window as any).api.onUploadProgressTg((data: any) => {
      setTgProgress(data.percent)
      if (data.status) setTgStatus(data.status)
    })
  }, [])

  const selectLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode)
    localStorage.setItem('appLanguage', langCode)
    setAppState('boot_sequence')
  }

  const handleMinimize = () => {
    ;(window as any).electron.ipcRenderer.send('window-minimize')
  }

  const handleClose = () => {
    ;(window as any).electron.ipcRenderer.send('window-close')
  }

  const handleParseUrl = async () => {
    if (!twitchUrl) {
      setErrorMsg('Please enter a valid Twitch URL!')
      return
    }
    setErrorMsg('')
    setAppState('parsing')
    
    try {
      const res = await (window as any).api.parseUrl(twitchUrl)
      if (res.success) {
        setVideoData(res.data)
        setAppState('ready')
      } else {
        setErrorMsg(res.error)
        setAppState('execute')
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to connect to parser')
      setAppState('execute')
    }
  }

  const handleSelectDir = async () => {
    const dir = await (window as any).api.selectDirectory()
    if (dir) {
      setTempDownloadDir(dir)
    }
  }

  const startDownload = async () => {
    setAppState('dashboard')
    setPipelineActive(true)
    setDownloadProgress(0)
    setDownloadSpeed('')
    setDownloadStatus('')
    try {
      const res = await (window as any).api.downloadVod(twitchUrl, videoData.title, downloadDir)
      if (res.success) {
        setDownloadedPath(res.filePath)
        setDownloadProgress(100)
        setDownloadStatus('Готово! Исходник сохранен.')
        
        // Start Master Upload Process!
        const config = {
          useYt, useVk, useTg, autoDelete,
          ytClientId: localStorage.getItem('ytClientId'),
          ytClientSecret: localStorage.getItem('ytClientSecret'),
          ytRefreshToken: localStorage.getItem('ytRefreshToken'),
          vkToken: localStorage.getItem('vkToken'),
          vkGroupId: localStorage.getItem('vkGroupId'),
          tgBotToken: localStorage.getItem('tgBotToken'),
          tgChannelId: localStorage.getItem('tgChannelId'),
          tgTopicId: localStorage.getItem('tgTopicId')
        }
        
        ;(window as any).api.startMasterUpload(res.filePath, videoData.title, config)
      } else {
        if (res.error.includes('cancelled')) {
          setAppState('ready')
        } else {
          setGlobalAlert('Download failed: ' + res.error)
          setAppState('ready')
        }
      }
    } catch (e: any) {
      setGlobalAlert('Download failed: ' + e.message)
      setAppState('ready')
    }
  }

  const handleCancelDownload = async () => {
    await (window as any).api.cancelDownload()
    setAppState('ready')
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      className="h-screen w-screen flex flex-col relative text-pixel-light bg-transparent p-6"
    >
      <div 
        className="w-full h-full flex flex-col relative bg-[#181818] rounded-xl overflow-hidden" 
        style={{
          boxShadow: 'inset 8px 8px 0px 0px rgba(255,255,255,0.05), inset -8px -8px 0px 0px rgba(0,0,0,0.5), 0 0 0 4px #000, 0 10px 30px rgba(0,0,0,0.8)',
          padding: '24px 20px 32px 20px'
        }}
      >
        {/* BEZEL TOP - DRAGGABLE TITLE BAR ZONE */}
        <div className="absolute top-0 left-0 w-full h-8 flex justify-between items-center px-4 draggable z-50">
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-pixel-red animate-pulse flex items-center gap-2 drop-shadow-[0_0_5px_rgba(255,0,0,0.8)]">
              <div className="w-2.5 h-2.5 rounded-full bg-pixel-red shadow-[0_0_8px_rgba(255,0,0,1)]"></div>
              REC
            </span>
            <span className="text-[8px] text-pixel-light-dim/30 tracking-widest no-drag">RETROCASTER SYSTEM V0.9</span>
          </div>
          
          {/* WINDOW CONTROLS */}
          <div className="flex items-center gap-2 no-drag">
            <button 
              className="w-6 h-6 flex items-center justify-center text-pixel-light-dim/50 hover:text-pixel-light hover:scale-110 transition-all" 
              onClick={handleMinimize}
              title="Minimize"
            >
              <div className="w-3 h-1 bg-current"></div>
            </button>
            <button 
              className="w-6 h-6 flex items-center justify-center text-pixel-light-dim/50 hover:text-pixel-red hover:drop-shadow-[0_0_8px_rgba(255,0,0,0.8)] hover:scale-110 transition-all" 
              onClick={handleClose}
              title="Power Off"
            >
              <div className="w-3 h-3 relative">
                <div className="absolute w-full h-[2px] bg-current top-1/2 left-0 -translate-y-1/2 rotate-45"></div>
                <div className="absolute w-full h-[2px] bg-current top-1/2 left-0 -translate-y-1/2 -rotate-45"></div>
              </div>
            </button>
          </div>
        </div>

        {/* BEZEL BOTTOM - DECORATION */}
        <div className="absolute bottom-2 left-0 w-full flex justify-between items-center px-8 z-50 pointer-events-none">
          <div className="flex flex-col gap-1">
            <div className="flex gap-1">
              <div className="w-2 h-1 bg-pixel-amber/40"></div>
              <div className="w-2 h-1 bg-pixel-amber/40"></div>
              <div className="w-2 h-1 bg-pixel-amber/80 shadow-[0_0_5px_rgba(255,205,117,0.8)]"></div>
            </div>
          </div>
          <div className="flex gap-6 items-center opacity-80">
            <span className="text-[10px] text-pixel-cyan tracking-[0.2em] font-bold drop-shadow-[0_0_5px_rgba(65,166,246,0.8)]">INSERT COIN</span>
            <span className="text-[10px] text-pixel-amber tracking-[0.2em] font-bold drop-shadow-[0_0_2px_rgba(0,0,0,1)]">CREDIT: 99</span>
          </div>
          <div className="flex gap-1">
              <div className="w-4 h-1 bg-pixel-darkblue/50"></div>
              <div className="w-1 h-1 bg-pixel-cyan shadow-[0_0_5px_rgba(65,166,246,1)]"></div>
          </div>
        </div>

        {/* ARCADE SCREEN INNER BORDER */}
        <div 
          className="flex-1 flex flex-col relative bg-pixel-void overflow-hidden border-[6px] border-[#0a0a0c] rounded-lg z-10"
          style={{
            boxShadow: '0 0 0 2px #41a6f6, 0 0 25px rgba(65, 166, 246, 0.4), inset 0 0 50px rgba(0,0,0,1)'
          }}
        >
          {/* Animated Background */}
          <div className="synthwave-bg absolute inset-0 z-0">
            <div className="synthwave-sun"></div>
            <div className="synthwave-grid"></div>
          </div>
          
          <div className="scanlines absolute inset-0 z-10 pointer-events-none"></div>
          <div className="crt-overlay animate-crt-flicker absolute inset-0 z-10 pointer-events-none mix-blend-overlay"></div>
          
          {/* THE ACTUAL APP (Sidebar + Content) */}
          <div className="flex-1 flex relative overflow-hidden z-20">
            {/* LEFT SIDEBAR */}
            {appState !== 'lang_select' && appState !== 'boot_sequence' && (
              <div className="w-[84px] shrink-0 flex flex-col bg-pixel-dark/90 border-r border-pixel-border z-20">
                <div className="flex-1 py-4 flex flex-col gap-2">
                  {[
                    { id: 'mission',  Icon: Crosshair, label: 'START',   active: true },
                    { id: 'settings', Icon: Settings,  label: 'ОПЦИИ', active: true },
                    { id: 'history',  Icon: History,   label: 'РЕКОРДЫ',  active: true },
                    { id: 'trim',     Icon: Scissors,  label: 'ОБРЕЗКА',  active: false },
                    { id: 'queue',    Icon: Package,   label: 'ОЧЕРЕДЬ',  active: false },
                  ].map(({ id, Icon, label, active }) => {
                    const isCurrent = navSection === id
                    return (
                      <button 
                        key={id}
                        disabled={!active}
                        className={`group relative flex flex-col items-center justify-center py-3 px-1 gap-1.5 transition-all
                          ${active ? 'hover:bg-pixel-dark-light cursor-pointer' : 'opacity-30 cursor-not-allowed'}
                          ${isCurrent ? 'bg-pixel-dark-light' : ''}
                        `}
                        onClick={() => {
                          if (active) {
                            setNavSection(id as any)
                            if (id === 'mission') {
                              if (appState === 'settings' || appState === 'api_guide' || appState === 'history') setAppState('execute')
                            } else if (id === 'settings') {
                              setAppState('settings')
                            } else if (id === 'history') {
                              setAppState('history')
                            }
                          }
                        }}
                      >
                        {isCurrent && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-pixel-cyan shadow-[0_0_8px_rgba(65,166,246,0.8)]" />}
                        <Icon size={18} className={isCurrent ? 'text-pixel-cyan' : 'text-pixel-light-dim'} />
                        <span className={`text-[7px] tracking-wider ${isCurrent ? 'text-pixel-cyan' : 'text-pixel-light-dim'}`}>
                          {label}
                        </span>
                        {!active && <span className="absolute top-1 right-1 text-[5px] text-pixel-amber">WIP</span>}
                      </button>
                    )
                  })}
                  <div className="flex-1" /> {/* Spacer */}
                  
                  {/* Gamification Rank Card */}
                  {gamification && (
                    <div className="p-2 border-t border-pixel-border flex flex-col items-center gap-1 bg-pixel-dark/50" title={`SCORE: ${gamification.xp}`}>
                      <div className="text-[7px] text-pixel-light-dim">PLAYER 1</div>
                      <div className="w-8 h-8 rounded bg-pixel-dark flex items-center justify-center border border-pixel-cyan shadow-[0_0_8px_rgba(65,166,246,0.3)] relative overflow-hidden">
                        <div className="absolute bottom-0 w-full bg-pixel-cyan/30" style={{ height: `${Math.min(100, (gamification.xp % 500) / 5)}%` }} />
                        <span className="text-[14px] relative z-10 drop-shadow-md">🏆</span>
                      </div>
                      <span className="text-[7px] text-pixel-amber tracking-widest text-center leading-tight mt-1 break-words w-full">
                        {gamification.rank}
                      </span>
                      <div className="w-full bg-pixel-border h-1.5 mt-1 rounded-full overflow-hidden border border-pixel-dark">
                        <div 
                          className="h-full bg-pixel-cyan shadow-[0_0_5px_rgba(65,166,246,1)]"
                          style={{ width: `${Math.min(100, (gamification.xp % 500) / 5)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col items-center justify-center overflow-hidden relative p-4">
              
              {/* Global Alert Modal */}
              <AnimatePresence>
                {globalAlert && (
                  <motion.div 
                    className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div 
                      className="pixel-panel flex flex-col items-center justify-center p-6 gap-4 min-w-[300px] border-2 border-pixel-cyan"
                      initial={{ scale: 0.8, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                    >
                      <h3 className="text-pixel-amber text-xl">СИСТЕМНОЕ УВЕДОМЛЕНИЕ</h3>
                      <p className="text-pixel-light text-center text-sm">{globalAlert}</p>
                      <button 
                        className="arcade-btn arcade-btn-primary mt-4 w-24"
                        onClick={() => setGlobalAlert(null)}
                      >
                        OK
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <AnimatePresence mode="wait">
                
                {/* 1. Language Selection Screen */}
                
                  {appState === 'boot_sequence' && (
                    <BootSequence key="boot" onComplete={() => setAppState('execute')} />
                  )}

                  {appState === 'lang_select' && (
                  <motion.div
                    key="lang_select"
                    initial={{ scale: 0.95, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 1.05, opacity: 0, filter: 'blur(5px)' }}
                    transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                    className="pixel-panel w-full max-w-2xl"
                  >
                    <div className="mb-8 text-center">
                      <h1 className="text-2xl text-pixel-yellow mb-2 tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                        {t('lang_select_title', 'REGION SELECT')}
                      </h1>
                      <p className="text-sm text-pixel-light/70">
                        <TypewriterText text={t('lang_select_subtitle', 'INSERT COIN AND CHOOSE REGION')} />
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-6 items-center w-full mt-4">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          className="arcade-btn w-64 py-4 animate-float"
                          onMouseEnter={() => setHoveredLang(lang.code)}
                          onClick={() => selectLanguage(lang.code)}
                        >
                          {hoveredLang === lang.code ? '> ' + lang.label + ' <' : lang.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* 2. Main Quest Intro Screen */}
                

                  
                  {/* 3. Execute Interface */}
                  {appState === 'execute' && (
                    <motion.div
                      key="execute"
                      initial={{ scale: 0.95, opacity: 0, y: 10 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 1.05, opacity: 0, filter: 'blur(5px)' }}
                      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                      className="pixel-panel w-full max-w-2xl relative"
                    >
                      <div className="mb-6 p-4 bg-black/60 border border-pixel-green/30 text-pixel-green font-mono text-sm">
                        <TypewriterText text={t('enter_url_typewriter', '> Вставь ссылку на Twitch VOD ниже!_')} speed={30} />
                      </div>

                      <div className="flex flex-col gap-2 mb-6">
                        <label className="text-[#ffaa00] text-sm font-bold tracking-widest uppercase">
                          {t('twitch_url_label', 'ССЫЛКА НА TWITCH VOD')}
                        </label>
                        <input 
                          type="text" 
                          className="arcade-input font-mono text-sm w-full bg-black/80 text-pixel-light p-3 border-2 border-pixel-darkblue focus:border-pixel-blue outline-none transition-colors"
                          placeholder="https://twitch.tv/videos/..."
                          value={twitchUrl}
                          onChange={(e) => setTwitchUrl(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleParseUrl()}
                        />
                        {errorMsg && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-pixel-red text-xs mt-1"
                          >
                            ⚠ {errorMsg}
                          </motion.div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 mb-8">
                        <PixelCheckbox label={t('upload_yt')} checked={useYt} onChange={() => setUseYt(!useYt)} icon={UploadCloud} />
                        <PixelCheckbox label={t('upload_vk')} checked={useVk} onChange={() => setUseVk(!useVk)} icon={UploadCloud} />
                        <PixelCheckbox label={t('upload_tg')} checked={useTg} onChange={() => setUseTg(!useTg)} icon={UploadCloud} />
                        
                        <div className="mt-2 pt-4 border-t border-pixel-light/10">
                          <PixelCheckbox label={t('auto_delete')} checked={autoDelete} onChange={() => setAutoDelete(!autoDelete)} icon={Trash2} />
                        </div>
                      </div>

                      <div className="flex w-full gap-4">
                        <button 
                          className="arcade-btn flex-1 text-pixel-light border-pixel-blue hover:bg-[#ff3333] hover:border-[#ff3333] transition-colors py-4"
                          onClick={handleClose}
                        >
                          {t('exit')}
                        </button>
                        <button 
                          className="arcade-btn flex-[2] bg-pixel-darkblue border-pixel-blue hover:bg-pixel-blue hover:text-white py-4 flex items-center justify-center gap-2 disabled:opacity-50"
                          onClick={handleParseUrl}
                          disabled={!twitchUrl}
                        >
                          <UploadCloud size={20} />
                          {t('execute')}
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Dashboard Mission Control Screen */}
                  {pipelineActive && (
                    <Dashboard 
                      useYt={useYt}
                      useVk={useVk}
                      useTg={useTg}
                      autoDelete={autoDelete}
                      dlProgress={downloadProgress}
                      dlStatus={downloadStatus}
                      dlSpeed={downloadSpeed}
                      ytProgress={ytProgress}
                      ytStatus={ytStatus}
                      vkProgress={vkProgress}
                      vkStatus={vkStatus}
                      tgProgress={tgProgress}
                      tgStatus={tgStatus}
                      onCancel={() => {
                        setAppState('execute')
                        setPipelineActive(false)
                        setNavSection('mission')
                      }}
                      isPiP={appState !== 'dashboard'}
                      onClickPiP={() => {
                        setAppState('dashboard')
                        setNavSection('mission')
                      }}
                    />
                  )}

           {/* 7. Settings Screen */}
                  {appState === 'settings' && (
                    <motion.div
                      key="settings"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="pixel-panel w-full max-w-[550px] flex flex-col gap-1.5 !border-x-4 !border-y-0 !border-[#ffaa00] relative !p-4"
                    >
                      <h2 className="text-[#ffaa00] text-lg text-center pb-1 mb-1 tracking-widest uppercase font-bold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                        SETTINGS
                      </h2>
                      
                      {/* Tabs Header */}
                      <div className="flex gap-2 border-b border-pixel-darkblue/50 pb-2 mb-2 shrink-0 justify-center text-[9px] font-bold tracking-widest items-center whitespace-nowrap overflow-hidden">
                        <span className="text-[#ffaa00] flex shrink-0 items-center gap-1">&larr; LB</span>
                        
                        {[
                          { id: 'general', label: 'ОБЩИЕ' },
                          { id: 'youtube', label: 'YOUTUBE' },
                          { id: 'vk', label: 'VK' },
                          { id: 'telegram', label: 'TELEGRAM' },
                          { id: 'rutube', label: 'RUTUBE' },
                          { id: 'dzen', label: 'ДЗЕН' }
                        ].map((tab, idx, arr) => (
                          <React.Fragment key={tab.id}>
                            <button 
                              className={`transition-colors uppercase shrink-0 ${activeSettingsTab === tab.id ? 'text-[#ffaa00] border border-[#ffaa00] px-1 py-0.5 rounded-sm bg-[#ffaa00]/10' : 'text-[#ff3333] hover:text-[#ff3333]/80'}`}
                              onClick={() => setActiveSettingsTab(tab.id as any)}
                            >
                              {tab.label}
                            </button>
                            {idx < arr.length - 1 && <span className="text-[#ff3333]/50 shrink-0">/</span>}
                          </React.Fragment>
                        ))}
                        
                        <span className="text-[#ffaa00] flex shrink-0 items-center gap-1">RB &rarr;</span>
                      </div>

                      {/* Content Area - No fixed height, tightly packed */}
                      <div className="flex flex-col gap-3 px-1 w-full">
                        
                        {activeSettingsTab === 'general' && (
                          <div className="flex flex-col gap-3 w-full">
                            <div className="flex flex-col gap-1 w-full">
                              <label className="text-[#ffaa00] text-[9px] font-bold tracking-widest uppercase">{t('language')}</label>
                              <select 
                                className="arcade-input bg-black text-pixel-light text-[10px] !p-1.5 w-full min-w-0"
                                value={tempLanguage}
                                onChange={(e) => setTempLanguage(e.target.value)}
                              >
                                <option value="en">English</option>
                                <option value="ru">Русский</option>
                              </select>
                            </div>
      
                            <div className="flex flex-col gap-1 w-full">
                              <label className="text-[#ffaa00] text-[9px] font-bold tracking-widest uppercase">{t('download_folder')}</label>
                              <div className="flex gap-2 w-full">
                                <input 
                                  type="text" 
                                  readOnly 
                                  className="arcade-input flex-1 text-[10px] text-pixel-light/50 overflow-hidden text-ellipsis whitespace-nowrap bg-black !p-1.5 min-w-0" 
                                  value={tempDownloadDir || t('not_selected')} 
                                />
                                <button 
                                  className="arcade-btn !px-3 !py-1 text-[10px] shrink-0"
                                  onClick={async () => {
                                    const path = await (window as any).api.selectDirectory()
                                    if (path) setTempDownloadDir(path)
                                  }}
                                >
                                  ...
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {activeSettingsTab === 'youtube' && (
                          <div className="flex flex-col gap-2 w-full">
                            <div className="flex justify-between items-center">
                              <label className="text-[#ffaa00] text-[10px] font-bold tracking-widest uppercase">Ключи API YouTube</label>
                              <button 
                                className="text-pixel-light bg-pixel-darkblue/50 hover:bg-pixel-blue px-2 py-0.5 rounded text-[9px] flex items-center gap-1 border border-pixel-blue transition-colors"
                                onClick={() => setActiveInstruction('youtube')}
                              >
                                <HelpCircle size={10} /> Инструкция
                              </button>
                            </div>
                            
                            {localStorage.getItem('ytRefreshToken') && (
                              <div className="w-full p-1.5 bg-pixel-green/10 border border-pixel-green flex items-center justify-center">
                                <span className="text-pixel-green text-[9px] font-bold">✓ YouTube авторизован</span>
                              </div>
                            )}
                          
                            <div className="flex flex-col gap-2">
                              <div className="flex flex-col gap-1">
                                <label className="text-[#ffaa00]/70 text-[8px] uppercase tracking-wider">YouTube Client ID</label>
                                <input 
                                  type="text" 
                                  className="arcade-input text-[10px] w-full bg-black/50 !p-1.5 min-w-0" 
                                  value={tempYtClientId}
                                  onChange={(e) => setTempYtClientId(e.target.value)}
                                  placeholder="123456...apps.googleusercontent.com"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-[#ffaa00]/70 text-[8px] uppercase tracking-wider">YouTube Client Secret</label>
                                <input 
                                  type="password" 
                                  className="arcade-input text-[10px] w-full bg-black/50 !p-1.5 min-w-0" 
                                  value={tempYtClientSecret}
                                  onChange={(e) => setTempYtClientSecret(e.target.value)}
                                  placeholder="GOCSPX-..."
                                />
                              </div>
                            </div>
                            
                            <button 
                              className="arcade-btn w-full bg-[#ff3333]/10 border-[#ff3333] text-[#ff3333] hover:bg-[#ff3333] hover:text-white !py-1.5 mt-1 text-[9px]"
                              onClick={async () => {
                                const authUrl = await (window as any).api.ytGetAuthUrl(tempYtClientId, tempYtClientSecret)
                                if (authUrl) {
                                  (window as any).api.openExternal(authUrl)
                                  setAppState('api_guide')
                                }
                              }}
                            >
                              АВТОРИЗОВАТЬ КАНАЛ YOUTUBE
                            </button>
                          </div>
                        )}

                        {activeSettingsTab === 'vk' && (
                          <div className="flex flex-col gap-2 w-full">
                            <div className="flex justify-between items-center">
                              <label className="text-[#ffaa00] text-[10px] font-bold tracking-widest uppercase">VK Video API</label>
                              <button 
                                className="text-pixel-light bg-pixel-darkblue/50 hover:bg-pixel-blue px-2 py-0.5 rounded text-[9px] flex items-center gap-1 border border-pixel-blue transition-colors"
                                onClick={() => setActiveInstruction('vk')}
                              >
                                <HelpCircle size={10} /> Инструкция
                              </button>
                            </div>
                            
                            <div className="flex flex-col gap-1">
                              <label className="text-[#ffaa00]/70 text-[8px] uppercase tracking-wider">Access Token (video, groups, wall)</label>
                              <input 
                                type="password" 
                                className="arcade-input text-[10px] w-full bg-black/50 !p-1.5 min-w-0" 
                                value={tempVkToken}
                                onChange={(e) => setTempVkToken(e.target.value.trim())}
                                placeholder="vk1.a.XXXXXXXX..."
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 w-full">
                              <div className="flex flex-col gap-1">
                                <label className="text-[#ffaa00]/70 text-[8px] uppercase tracking-wider">ID Группы VK</label>
                                <input 
                                  type="text" 
                                  className="arcade-input text-[10px] w-full bg-black/50 !p-1.5 min-w-0" 
                                  value={tempVkGroupId}
                                  onChange={(e) => setTempVkGroupId(e.target.value.trim())}
                                  placeholder="например: 240867604"
                                />
                              </div>
                              <div className="flex flex-col gap-1 justify-end h-full">
                                <label className="flex items-center gap-2 cursor-pointer mb-1 border border-[#ffaa00]/30 p-1 bg-black/30">
                                  <input 
                                    type="checkbox" 
                                    className="pixel-checkbox accent-[#ffaa00]"
                                    checked={tempVkPostToWall}
                                    onChange={(e) => setTempVkPostToWall(e.target.checked)}
                                  />
                                  <span className="text-[#ffaa00] text-[8px] uppercase tracking-wider">Публиковать на стене</span>
                                </label>
                              </div>
                            </div>
          
                            <div className="h-3 flex items-center justify-center mt-1">
                              {vkValidation.status === 'loading' && <span className="text-pixel-light text-[9px] animate-pulse">Проверка токена...</span>}
                              {vkValidation.status === 'valid' && <span className="text-pixel-green text-[9px] font-bold">✓ Подключен: {vkValidation.name}</span>}
                              {vkValidation.status === 'invalid' && <span className="text-pixel-red text-[9px] font-bold">❌ Ошибка: {vkValidation.error}</span>}
                              {vkValidation.status === 'idle' && tempVkToken && <span className="text-pixel-light/50 text-[9px]">Ожидание ввода...</span>}
                            </div>
                          </div>
                        )}

                        {activeSettingsTab === 'telegram' && (
                          <div className="flex flex-col gap-2 w-full">
                            <div className="flex justify-between items-center">
                              <label className="text-[#2AABEE] text-[10px] font-bold tracking-widest uppercase">Настройки Telegram</label>
                              <button 
                                className="text-pixel-light bg-[#2AABEE]/20 hover:bg-[#2AABEE] px-2 py-0.5 rounded text-[9px] flex items-center gap-1 border border-[#2AABEE] transition-colors"
                                onClick={() => setActiveInstruction('telegram')}
                              >
                                <HelpCircle size={10} /> Инструкция
                              </button>
                            </div>
          
                            <div className="flex flex-col gap-2">
                              <div className="flex flex-col gap-1">
                                <label className="text-[#2AABEE] text-[8px] uppercase tracking-wider">Bot Token от @BotFather</label>
                                <div className="flex flex-col w-full">
                                  <input 
                                    type="password" 
                                    className="arcade-input text-[10px] w-full bg-black/50 !p-1.5 min-w-0" 
                                    value={tempTgBotToken}
                                    onChange={(e) => setTempTgBotToken(e.target.value)}
                                    placeholder="123456789:ABCdefGHIjklMNO..."
                                  />
                                  <div className="h-3 flex items-center justify-end">
                                    {tgValidation.status === 'loading' && <span className="text-pixel-light text-[8px] animate-pulse">Проверка...</span>}
                                    {tgValidation.status === 'valid' && <span className="text-[#2AABEE] text-[8px]">✓ Бот: {tgValidation.name}</span>}
                                    {tgValidation.status === 'invalid' && <span className="text-pixel-red text-[8px]">❌ Ошибка</span>}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col gap-1">
                                  <label className="text-[#2AABEE] text-[8px] uppercase tracking-wider">ID Канала / Группы</label>
                                  <input 
                                    type="text" 
                                    className="arcade-input text-[10px] w-full bg-black/50 !p-1.5 min-w-0" 
                                    value={tempTgChannelId}
                                    onChange={(e) => setTempTgChannelId(e.target.value)}
                                    placeholder="@channel или -100..."
                                  />
                                </div>
                                <div className="flex flex-col gap-1">
                                  <label className="text-[#2AABEE] text-[8px] uppercase tracking-wider">ID Топика (если есть)</label>
                                  <input 
                                    type="text" 
                                    className="arcade-input text-[10px] w-full bg-black/50 !p-1.5 min-w-0" 
                                    value={tempTgTopicId}
                                    onChange={(e) => setTempTgTopicId(e.target.value)}
                                    placeholder="например: 42"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {activeSettingsTab === 'rutube' && (
                          <div className="flex flex-col gap-2 items-center justify-center h-full min-h-[80px]">
                            <div className="text-pixel-light/50 text-[10px] text-center font-mono">
                              RuTube интеграция в разработке.<br/>(Зарезервировано)
                            </div>
                          </div>
                        )}

                        {activeSettingsTab === 'dzen' && (
                          <div className="flex flex-col gap-2 items-center justify-center h-full min-h-[80px]">
                            <div className="text-pixel-light/50 text-[10px] text-center font-mono">
                              Дзен интеграция в разработке.<br/>(Зарезервировано)
                            </div>
                          </div>
                        )}

                      </div>

                      <div className="flex w-full gap-3 mt-1 shrink-0 pt-2 border-t border-pixel-darkblue/50">
                        <button 
                          className="arcade-btn flex-1 text-pixel-light border-pixel-blue hover:bg-[#ff3333] hover:border-[#ff3333] transition-colors !py-1.5 text-[9px]"
                          onClick={() => { setAppState('execute'); setNavSection('mission'); }}
                        >
                          {t('back', 'НАЗАД')}
                        </button>
                        <button 
                          className="arcade-btn flex-[2] bg-pixel-darkblue border-pixel-blue hover:bg-pixel-blue hover:text-white !py-1.5 flex items-center justify-center gap-1 text-[9px]"
                          onClick={() => {
                            setDownloadDir(tempDownloadDir)
                            localStorage.setItem('appDownloadDir', tempDownloadDir)
                            i18n.changeLanguage(tempLanguage)
                            localStorage.setItem('appLanguage', tempLanguage)
                            
                            setYtClientId(tempYtClientId)
                            localStorage.setItem('ytClientId', tempYtClientId)
                            setYtClientSecret(tempYtClientSecret)
                            localStorage.setItem('ytClientSecret', tempYtClientSecret)
                            
                            setVkToken(tempVkToken)
                            localStorage.setItem('vkToken', tempVkToken)
                            setVkGroupId(tempVkGroupId)
                            localStorage.setItem('vkGroupId', tempVkGroupId)
                            setVkPostToWall(tempVkPostToWall)
                            localStorage.setItem('vkPostToWall', tempVkPostToWall ? 'true' : 'false')
        
                            
                            localStorage.setItem('tgBotToken', tempTgBotToken)
                            
                            localStorage.setItem('tgChannelId', tempTgChannelId)
                            setTgTopicId(tempTgTopicId)
                            localStorage.setItem('tgTopicId', tempTgTopicId)
                            
                            setAppState('execute');
                            setNavSection('mission');
                          }}
                        >
                          {t('save', 'СОХРАНИТЬ')}
                        </button>
                      </div>

                      {/* Instruction Modal Overlay */}
                      <AnimatePresence>
                        {activeInstruction && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute inset-0 z-50 bg-black/95 border-2 border-pixel-cyan flex flex-col p-4 shadow-2xl backdrop-blur-md m-1"
                          >
                            <div className="flex justify-between items-center mb-2 border-b border-pixel-cyan/30 pb-1">
                              <h3 className="text-pixel-cyan text-sm tracking-widest font-bold">ИНСТРУКЦИЯ</h3>
                              <button onClick={() => setActiveInstruction(null)} className="text-pixel-light hover:text-[#ff3333]">
                                <X size={16} />
                              </button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto custom-scrollbar text-pixel-light text-[10px] font-mono flex flex-col gap-2">
                              {activeInstruction === 'telegram' && (
                                <>
                                  <p><b>Шаг 1:</b> Перейдите к <a href="https://t.me/BotFather" onClick={(e) => { e.preventDefault(); (window as any).api.openExternal('https://t.me/BotFather') }} className="text-[#2AABEE] hover:underline cursor-pointer">@BotFather</a> в Telegram.</p>
                                  <p><b>Шаг 2:</b> Напишите команду <code>/newbot</code> и следуйте инструкции.</p>
                                  <p><b>Шаг 3:</b> В конце он выдаст вам длинный <b>HTTP API Token</b>. Скопируйте его.</p>
                                  <p><b>Шаг 4:</b> Добавьте созданного бота в свой канал/группу как Администратора.</p>
                                  <p><b>Шаг 5:</b> Вставьте токен и ID канала в настройки.</p>
                                </>
                              )}
                              {activeInstruction === 'vk' && (
                                <>
                                  <p><b>Шаг 1:</b> Перейдите по ссылке для получения токена (нажмите кнопку ниже).</p>
                                  <button 
                                    className="arcade-btn bg-pixel-blue text-white !py-1 my-1 w-full text-center text-[9px]"
                                    onClick={() => (window as any).api.openExternal('https://oauth.vk.com/authorize?client_id=51602816&display=page&redirect_uri=https://oauth.vk.com/blank.html&scope=video,groups,wall,offline&response_type=token&v=5.131')}
                                  >
                                    ОТКРЫТЬ СТРАНИЦУ АВТОРИЗАЦИИ VK
                                  </button>
                                  <p><b>Шаг 2:</b> Разрешите доступ ВКонтакте.</p>
                                  <p><b>Шаг 3:</b> Вас перекинет на пустую белую страницу. Скопируйте <b>ВЕСЬ АДРЕС</b> из адресной строки браузера и вставьте его в настройки.</p>
                                  <p className="text-pixel-light/50 text-[9px] mt-1">* Мы автоматически извлечем токен из вашей ссылки.</p>
                                </>
                              )}
                              {activeInstruction === 'youtube' && (
                                <>
                                  <p><b>Шаг 1:</b> Перейдите в <a href="#" onClick={(e) => { e.preventDefault(); (window as any).api.openExternal('https://console.cloud.google.com/') }} className="text-[#ff3333] hover:underline cursor-pointer">Google Cloud Console</a>.</p>
                                  <p><b>Шаг 2:</b> Создайте новый проект и включите <b>YouTube Data API v3</b>.</p>
                                  <p><b>Шаг 3:</b> Настройте окно согласия OAuth (OAuth consent screen) - добавьте себя в Test users.</p>
                                  <p><b>Шаг 4:</b> В разделе Credentials создайте OAuth 2.0 Client ID (тип: Desktop App).</p>
                                  <p><b>Шаг 5:</b> Скопируйте Client ID и Client Secret в настройки RetroCaster.</p>
                                </>
                              )}
                            </div>
                            
                            <button 
                              className="arcade-btn bg-pixel-cyan text-black w-full mt-2 !py-1.5 text-[10px]"
                              onClick={() => setActiveInstruction(null)}
                            >
                              ПОНЯТНО
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
{/* 8. Success Screen */}
          {appState === 'success' && (
            <motion.div
              key="success"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="pixel-panel w-full max-w-2xl flex flex-col items-center gap-6"
            >
              <h2 className="text-pixel-green text-2xl flex items-center gap-2">
                <MonitorPlay size={32} /> {t('download_success')}
              </h2>

              <div className="w-full bg-black/40 border-2 border-pixel-darkblue p-6 flex flex-col gap-4 text-center">
                <span className="text-pixel-light/70 uppercase tracking-wider">{t('saved_to')}</span>
                <div className="bg-black border border-pixel-blue p-4 text-pixel-yellow font-mono text-sm break-all shadow-pixel-inner">
                  {downloadedPath}
                </div>
                
                {/* Temporary placeholder for phase 5 */}
                <span className="text-pixel-orange/80 text-xs mt-2">{t('upload_phase_soon')}</span>
              </div>

              <button 
                className="arcade-btn arcade-btn-success mt-2" 
                onClick={() => {
                  setAppState('uploading')
                }}
              >
                {t('continue')}
              </button>
            </motion.div>
          )}

          {/* 9. Uploading Screen (Phase 5) */}
          {appState === 'uploading' && (
            <motion.div
              key="uploading"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="pixel-panel w-full max-w-2xl flex flex-col items-center gap-6"
            >
              <h2 className="text-pixel-yellow text-2xl flex items-center gap-2">
                <MonitorPlay size={32} /> {t('multi_upload')}
              </h2>

              <div className="w-full flex flex-col gap-4 mt-2">
                
                {/* Telegram */}
                <div className="w-full bg-black/40 border-2 border-[#0088cc] p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-pixel-light text-sm">
                    <span className="text-[#0088cc] flex items-center gap-2"><span className="text-xl">✈</span> Telegram</span>
                    <span>{t('waiting')}</span>
                  </div>
                  <div className="w-full h-4 border-2 border-pixel-darkblue p-[2px] bg-black">
                    <div className="h-full bg-[#0088cc] transition-all" style={{ width: '0%' }}></div>
                  </div>
                </div>

                {/* YouTube */}
                <div className="w-full bg-black/40 border-2 border-[#ff0000] p-4 flex flex-col gap-2 opacity-50">
                  <div className="flex justify-between items-center text-pixel-light text-sm">
                    <span className="text-[#ff0000] flex items-center gap-2"><span className="text-xl">▶</span> YouTube {t('coming_soon')}</span>
                    <span>{t('offline')}</span>
                  </div>
                  <div className="w-full h-4 border-2 border-pixel-darkblue p-[2px] bg-black">
                    <div className="h-full bg-[#ff0000] transition-all" style={{ width: '0%' }}></div>
                  </div>
                </div>

                {/* VK */}
                <div className="w-full bg-black/40 border-2 border-[#0077ff] p-4 flex flex-col gap-2 opacity-50">
                  <div className="flex justify-between items-center text-pixel-light text-sm">
                    <span className="text-[#0077ff] flex items-center gap-2"><span className="text-xl">V</span> VK Video {t('coming_soon')}</span>
                    <span>{t('offline')}</span>
                  </div>
                  <div className="w-full h-4 border-2 border-pixel-darkblue p-[2px] bg-black">
                    <div className="h-full bg-[#0077ff] transition-all" style={{ width: '0%' }}></div>
                  </div>
                </div>

              </div>

              <div className="flex w-full justify-between mt-4">
                <button className="arcade-btn text-pixel-red border-pixel-red hover:bg-pixel-red/20" onClick={() => { setAppState('execute'); setNavSection('mission'); }}>
                  {t('cancel')}
                </button>
                <button className="arcade-btn arcade-btn-primary" onClick={startDownload}>
                  {t('start_upload', 'START RUN')}
                </button>
              </div>

            </motion.div>
          )}

          {/* History (Star Map) Screen */}
          {appState === 'history' && (
            <motion.div
              key="history"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-4xl h-full flex flex-col overflow-hidden bg-pixel-void border border-pixel-border"
            >
              <div className="bg-pixel-dark/95 border-b border-pixel-border px-4 py-3 flex items-center justify-between shadow-lg">
                <h2 className="text-pixel-yellow text-xl font-bold tracking-widest text-shadow-pixel flex items-center gap-2">
                  <span className="text-2xl">🌌</span> ЗВЁЗДНАЯ КАРТА
                </h2>
                <div className="text-xs text-pixel-cyan uppercase tracking-widest">
                  Всего миссий: {historyLog.length}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {historyLog.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-pixel-muted opacity-50">
                    <History size={64} className="mb-4" />
                    <p className="text-xl tracking-widest">ИСТОРИЯ ПУСТА</p>
                    <p className="text-sm">Завершите первую миссию</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {historyLog.map((log) => (
                      <div key={log.id} className="pixel-panel flex flex-col gap-3 group hover:border-pixel-cyan transition-colors bg-pixel-dark/40 backdrop-blur-sm">
                        <div className="flex justify-between items-start border-b border-pixel-border/50 pb-2">
                          <h3 className="text-sm text-pixel-cyan font-bold truncate pr-2" title={log.title}>
                            {log.title || 'Unknown Mission'}
                          </h3>
                          <span className="text-[10px] text-pixel-light-dim shrink-0 bg-pixel-dark/80 px-1 border border-pixel-border">
                            {new Date(log.date).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-end">
                          <div className="flex gap-2">
                            {log.platforms.includes('youtube') && <span className="text-[#ff0000] text-sm" title="YouTube">▶</span>}
                            {log.platforms.includes('vk') && <span className="text-[#0077ff] text-sm font-bold" title="VK">V</span>}
                            {log.platforms.includes('telegram') && <span className="text-[#0088cc] text-sm" title="Telegram">✈</span>}
                          </div>
                          
                          <div className="text-xs text-pixel-amber font-bold animate-pulse">
                            +{log.xpGained} XP
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
          </div>
        </div>
        </div>
      </div>
    </motion.div>
  )
}

export default App
