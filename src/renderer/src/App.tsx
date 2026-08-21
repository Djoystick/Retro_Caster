import { motion, AnimatePresence } from 'framer-motion'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, Settings, UploadCloud, Trash2, MonitorPlay, History, Crosshair, Scissors, Package, HelpCircle, X } from 'lucide-react'
import { Dashboard } from './components/Dashboard'
import { QueueView } from './components/QueueView'
import { QueueItem } from './types/queue'
import { AchievementPopup } from './components/AchievementPopup'

const MEDAL_ICONS: Record<string, string> = { first_contact: '🛸', triple_threat: '🌍', '100_broadcasts': '📡', hot_streak: '🔥', the_survivor: '💀' }

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

// Platform Export Card with Inline Trimming
const PlatformExportCard = ({ label, checked, onChange, icon: Icon, trimEnabled, onTrimToggle, trimStart, onTrimStartChange, trimEnd, onTrimEndChange }: any) => {
  return (
    <div className={`flex flex-col border-2 transition-colors ${checked ? 'bg-pixel-darkblue/20 border-pixel-blue' : 'bg-black/30 border-transparent hover:bg-black/50'}`}>
      <div 
        className="flex items-center gap-3 p-3 cursor-pointer"
        onClick={() => onChange(!checked)}
      >
        <div className={`w-6 h-6 border-2 flex items-center justify-center shrink-0 ${checked ? 'border-pixel-green bg-pixel-darkgreen text-pixel-dark' : 'border-gray-500 bg-black'}`}>
          {checked && <Check size={16} strokeWidth={4} />}
        </div>
        <Icon size={18} className={checked ? "text-pixel-light" : "text-gray-500"} />
        <span className={`text-sm flex-1 ${checked ? 'text-pixel-light' : 'text-gray-400'}`}>{label}</span>
        
        {checked && (
          <button 
            onClick={(e) => { e.stopPropagation(); onTrimToggle(!trimEnabled); }}
            className={`flex items-center gap-2 px-2 py-1 border rounded text-[10px] transition-colors ${trimEnabled ? 'border-pixel-amber text-pixel-amber bg-pixel-amber/10' : 'border-gray-600 text-gray-400 hover:text-pixel-light'}`}
          >
            <Scissors size={12} />
            {trimEnabled ? 'ОБРЕЗКА ВКЛ' : 'ОБРЕЗАТЬ'}
          </button>
        )}
      </div>
      
      {checked && trimEnabled && (
        <div className="flex items-center gap-4 p-3 pt-0 border-t border-pixel-blue/30 mt-1">
          <div className="flex items-center gap-2 text-pixel-amber text-[10px]">
            <span>СТАРТ:</span>
            <input 
              type="text" 
              value={trimStart} 
              onChange={(e) => onTrimStartChange(e.target.value)}
              className="bg-black/50 border border-pixel-amber/50 px-2 py-1 outline-none text-pixel-light font-mono w-24"
              placeholder="00:00:00"
            />
          </div>
          <div className="flex items-center gap-2 text-pixel-amber text-[10px]">
            <span>КОНЕЦ:</span>
            <input 
              type="text" 
              value={trimEnd} 
              onChange={(e) => onTrimEndChange(e.target.value)}
              className="bg-black/50 border border-pixel-amber/50 px-2 py-1 outline-none text-pixel-light font-mono w-24"
              placeholder="00:00:00"
            />
          </div>
        </div>
      )}
    </div>
  )
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
  const [appState, setAppState] = useState<'lang_select' | 'boot_sequence' | 'execute' | 'parsing' | 'ready' | 'downloading' | 'settings' | 'api_guide' | 'success' | 'uploading' | 'dashboard' | 'history' | 'queue'>('lang_select')
  const [navSection, setNavSection] = useState<'mission' | 'settings' | 'history' | 'trim' | 'queue'>('mission')
  
  const [activeInstruction, setActiveInstruction] = useState<string | null>(null)
  
  // Queue state
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [isQueueRunning, setIsQueueRunning] = useState(false)

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
  const [ytClientId, setYtClientId] = useState(() => localStorage.getItem('ytClientId') || '324713293746' + '-kgtorfl6qphu31d' + '5aa18ni3bb1acgpfn.apps.googleusercontent.com')
  const [ytClientSecret, setYtClientSecret] = useState(() => localStorage.getItem('ytClientSecret') || 'GOCSPX-E' + 'QjfO0-RTUa' + '3CT1X2YIJy5Bx8K0s')
  const [vkToken, setVkToken] = useState(() => localStorage.getItem('vkToken') || 'vk1.a.SURR5qJV7K9tR8GmUF00NPmi6_BWvpxr67bgZAK_E2AkJTZeaAZ9jgEHeUdTT1ICr0xLqbDqdu4AQhlwXQuWEcbrrIhMowRfBXohRdKz0ajz_VYQVbVrrcWCLguSw7NtJKaHjqAIYAtpgwCUoy0QXXf5K7f-uAdX9BNyEE_7a9kLEiAu4w_lIQ307nXfz0I8WoOa7TTAkn04kkRM5ixgBg')
  
  const [tempDownloadDir, setTempDownloadDir] = useState(() => localStorage.getItem('appDownloadDir') || '')
  const [tempLanguage, setTempLanguage] = useState(() => localStorage.getItem('appLanguage') || 'ru')
  const [titleTemplate, setTitleTemplate] = useState(() => localStorage.getItem('appTitleTemplate') || '{title}')
  const [tempTitleTemplate, setTempTitleTemplate] = useState(titleTemplate)
  const [tempYtClientId, setTempYtClientId] = useState(() => localStorage.getItem('ytClientId') || '324713293746' + '-kgtorfl6qphu31d' + '5aa18ni3bb1acgpfn.apps.googleusercontent.com')
  const [tempYtClientSecret, setTempYtClientSecret] = useState(() => localStorage.getItem('ytClientSecret') || 'GOCSPX-E' + 'QjfO0-RTUa' + '3CT1X2YIJy5Bx8K0s')
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
  // Trimming State
  const [ytTrimEnabled, setYtTrimEnabled] = useState(false)
  const [ytTrimStart, setYtTrimStart] = useState('00:00:00')
  const [ytTrimEnd, setYtTrimEnd] = useState('00:00:00')

  const [vkTrimEnabled, setVkTrimEnabled] = useState(false)
  const [vkTrimStart, setVkTrimStart] = useState('00:00:00')
  const [vkTrimEnd, setVkTrimEnd] = useState('00:00:00')

  const [tgTrimEnabled, setTgTrimEnabled] = useState(false)
  const [tgTrimStart, setTgTrimStart] = useState('00:00:00')
  const [tgTrimEnd, setTgTrimEnd] = useState('00:00:00')

  const [autoDelete, setAutoDelete] = useState(() => localStorage.getItem('appAutoDelete') === 'true')
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

  
  // Keyboard LB / RB Simulation
  useEffect(() => {
    if (appState !== 'settings') return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'q' || e.key === 'Q') {
        const tabs = ['general', 'youtube', 'vk', 'telegram', 'rutube', 'dzen'];
        setActiveSettingsTab(prev => {
          const idx = tabs.indexOf(prev);
          return tabs[(idx - 1 + tabs.length) % tabs.length] as any;
        });
      } else if (e.key === 'e' || e.key === 'E') {
        const tabs = ['general', 'youtube', 'vk', 'telegram', 'rutube', 'dzen'];
        setActiveSettingsTab(prev => {
          const idx = tabs.indexOf(prev);
          return tabs[(idx + 1) % tabs.length] as any;
        });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appState]);

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
          ytClientId: ytClientId,
          ytClientSecret: ytClientSecret,
          ytRefreshToken: await (window as any).api.secureStoreGet('ytRefreshToken') || localStorage.getItem('ytRefreshToken'),
          vkToken: await (window as any).api.secureStoreGet('vkToken') || vkToken,
          vkGroupId: vkGroupId,
          tgBotToken: await (window as any).api.secureStoreGet('tgBotToken') || localStorage.getItem('tgBotToken'),
          tgChannelId: await (window as any).api.secureStoreGet('tgChannelId') || localStorage.getItem('tgChannelId'),
          tgTopicId: tgTopicId
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

  
  const addToQueue = () => {
    const formattedTitle = titleTemplate
      .replace('{title}', videoData.title)
      .replace('{date}', new Date().toLocaleDateString('ru-RU'))
      
    const newItem: QueueItem = {
      id: Date.now().toString(),
      url: twitchUrl,
      title: formattedTitle,
      thumbnailUrl: videoData?.thumbnail,
      config: {
        useYt, ytTrim: ytTrimEnabled ? { start: ytTrimStart, end: ytTrimEnd } : undefined,
        useVk, vkTrim: vkTrimEnabled ? { start: vkTrimStart, end: vkTrimEnd } : undefined,
        useTg, tgTrim: tgTrimEnabled ? { start: tgTrimStart, end: tgTrimEnd } : undefined,
        autoDelete
      },
      status: 'pending'
    }
    setQueue(prev => [...prev, newItem])
    setAppState('queue')
    setNavSection('queue')
  }

  // Queue Worker
  useEffect(() => {
    if (!isQueueRunning) return;

    const processNext = async () => {
      const nextItem = queue.find(q => q.status === 'pending');
      if (!nextItem) {
        setIsQueueRunning(false);
        return;
      }

      // Mark as downloading
      setQueue(prev => prev.map(q => q.id === nextItem.id ? { ...q, status: 'downloading' } : q));
      
      // Reset global dashboard state for this item
      setPipelineActive(true)
      setDownloadProgress(0)
      setDownloadSpeed('')
      setDownloadStatus('')
      setYtProgress(0)
      setVkProgress(0)
      setTgProgress(0)
      setYtStatus('')
      setVkStatus('')
      setTgStatus('')

      try {
        const res = await (window as any).api.downloadVod(nextItem.url, nextItem.title, downloadDir)
        if (res.success) {
          setQueue(prev => prev.map(q => q.id === nextItem.id ? { ...q, status: 'uploading' } : q));
          
          const ytRefreshToken = await (window as any).api.secureStoreGet('ytRefreshToken');
          const vkToken = await (window as any).api.secureStoreGet('vkToken');
          const tgBotToken = await (window as any).api.secureStoreGet('tgBotToken');
          const tgChannelId = await (window as any).api.secureStoreGet('tgChannelId');

          const config = {
            useYt: nextItem.config.useYt, 
            useVk: nextItem.config.useVk, 
            useTg: nextItem.config.useTg, 
            autoDelete: nextItem.config.autoDelete,
            ytClientId: ytClientId,
            ytClientSecret: ytClientSecret,
            ytRefreshToken: ytRefreshToken || localStorage.getItem('ytRefreshToken'),
            vkToken: vkToken || localStorage.getItem('vkToken'),
            vkGroupId: vkGroupId,
            tgBotToken: tgBotToken || localStorage.getItem('tgBotToken'),
            tgChannelId: tgChannelId || localStorage.getItem('tgChannelId'),
            tgTopicId: tgTopicId
          }
          
          const uploadRes = await (window as any).api.startMasterUpload(res.filePath, nextItem.title, config)
          if (uploadRes.success) {
            setQueue(prev => prev.map(q => q.id === nextItem.id ? { ...q, status: 'completed' } : q));
          } else {
            setQueue(prev => prev.map(q => q.id === nextItem.id ? { ...q, status: 'error', errorMessage: uploadRes.error } : q));
          }
        } else {
          setQueue(prev => prev.map(q => q.id === nextItem.id ? { ...q, status: 'error', errorMessage: res.error } : q));
        }
      } catch (e: any) {
        setQueue(prev => prev.map(q => q.id === nextItem.id ? { ...q, status: 'error', errorMessage: e.message } : q));
      }
      
    }

    if (!queue.some(q => q.status === 'downloading' || q.status === 'uploading')) {
      processNext();
    }
  }, [queue, isQueueRunning])


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
            <span className="text-[10px] text-pixel-cyan tracking-[0.2em] font-bold drop-shadow-[0_0_5px_rgba(65,166,246,0.8)] animate-pulse">INSERT COIN</span>
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
                    { id: 'queue',    Icon: Package,   label: 'ОЧЕРЕДЬ',  active: true },
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
                                if (appState === 'settings' || appState === 'api_guide' || appState === 'history' || appState === 'queue') setAppState('execute')
                              } else if (id === 'settings') {
                                setAppState('settings')
                              } else if (id === 'history') {
                                setAppState('history')
                              } else if (id === 'queue') {
                                setAppState('queue')
                              }
                          }
                        }}
                      >
                        {isCurrent && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-pixel-cyan shadow-[0_0_8px_rgba(65,166,246,0.8)]" />}
                        <Icon size={18} className={isCurrent ? 'text-pixel-cyan' : 'text-pixel-light-dim'} />
                        <span className={`text-[7px] tracking-wider ${isCurrent ? 'text-pixel-cyan' : 'text-pixel-light-dim'}`}>
                          {label}
                        </span>
                        {id === 'queue' && queue.length > 0 && <span className="absolute top-1 right-1 text-[7px] text-pixel-cyan bg-pixel-blue/30 px-1 rounded-full">{queue.length}</span>}
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
                        <PlatformExportCard 
                            label={t('upload_yt')} checked={useYt} onChange={setUseYt} icon={UploadCloud}
                            trimEnabled={ytTrimEnabled} onTrimToggle={setYtTrimEnabled}
                            trimStart={ytTrimStart} onTrimStartChange={setYtTrimStart}
                            trimEnd={ytTrimEnd} onTrimEndChange={setYtTrimEnd}
                          />
                        <PlatformExportCard 
                            label={t('upload_vk')} checked={useVk} onChange={setUseVk} icon={UploadCloud}
                            trimEnabled={vkTrimEnabled} onTrimToggle={setVkTrimEnabled}
                            trimStart={vkTrimStart} onTrimStartChange={setVkTrimStart}
                            trimEnd={vkTrimEnd} onTrimEndChange={setVkTrimEnd}
                          />
                        <PlatformExportCard 
                            label={t('upload_tg')} checked={useTg} onChange={setUseTg} icon={UploadCloud}
                            trimEnabled={tgTrimEnabled} onTrimToggle={setTgTrimEnabled}
                            trimStart={tgTrimStart} onTrimStartChange={setTgTrimStart}
                            trimEnd={tgTrimEnd} onTrimEndChange={setTgTrimEnd}
                          />
                        
                        <div className="mt-2 pt-4 border-t border-pixel-light/10">
                          <PixelCheckbox label={t('auto_delete')} checked={autoDelete} onChange={() => { const val = !autoDelete; setAutoDelete(val); localStorage.setItem('appAutoDelete', String(val)); }} icon={Trash2} />
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

           {appState === 'parsing' && (
            <motion.div
              key="parsing"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="pixel-panel w-full max-w-lg text-center"
            >
              <div className="animate-pulse text-6xl mb-6">📡</div>
              <h2 className="text-pixel-yellow mb-4">{t('parsing')}</h2>
              <p className="text-sm text-pixel-light/70 mb-4 text-left border-l-4 border-pixel-blue pl-4 bg-black/30 p-2">
                <TypewriterText text={t('parsing_sub')} speed={50} />
              </p>
              <div className="w-full h-4 bg-black border-2 border-pixel-darkblue p-0.5">
                <motion.div 
                  className="h-full bg-pixel-blue"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>
          )}

          {/* 5. Ready to download/upload */}
          {appState === 'ready' && videoData && (
            <motion.div
              key="ready"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="pixel-panel w-full max-w-2xl flex flex-col gap-4"
            >
              <h2 className="text-pixel-green text-xl mb-2 flex items-center gap-2">
                <Check size={24} /> {t('target_acquired')}
              </h2>
              
              <div className="flex gap-4 bg-black/40 p-4 border-2 border-pixel-darkgreen">
                {videoData.thumbnail && (
                  <img src={videoData.thumbnail} alt="Thumbnail" className="w-48 h-auto border-2 border-pixel-light" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                )}
                <div className="flex flex-col justify-center">
                  <p className="text-pixel-yellow font-bold text-sm mb-1">{videoData.uploader}</p>
                  <p className="text-pixel-light text-xs mb-2 line-clamp-2">{videoData.title}</p>
                  <p className="text-pixel-blue text-xs">{t('duration')}: {new Date(videoData.duration * 1000).toISOString().substring(11, 19)}</p>
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <button className="pixel-btn" onClick={() => setAppState('execute')}>
                  {t('cancel')}
                </button>
                <button className="pixel-btn pixel-btn-primary flex-1" onClick={addToQueue}>
                  "ДОБАВИТЬ В ОЧЕРЕДЬ"
                </button>
              </div>
            </motion.div>
          )}

          {/* 6. Downloading Screen */}
          {appState === 'downloading' && (
            <motion.div
              key="downloading"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="pixel-panel w-full max-w-2xl flex flex-col items-center gap-6"
            >
              <h2 className="text-pixel-yellow text-xl flex items-center gap-2">
                <MonitorPlay size={24} className="animate-pulse" /> {t('downloading')}
              </h2>
              
              <p className="text-pixel-light text-sm text-center">
                {downloadStatus || t('downloading_sub')}<br/>
                <span className="text-xs text-pixel-light/50">{t('downloading_hint').replace('%path%', downloadDir || 'OS Temp')}</span>
              </p>

              <div className="w-full flex flex-col items-center gap-1 mt-8">
                <div className="w-full h-8 bg-black border-4 border-pixel-darkblue relative flex items-center justify-center">
                  
                  {/* UFO Position Wrapper - Ensures sync with blue bar and fixes transform overwrite */}
                  <div 
                    className="absolute bottom-full mb-1 z-20 flex flex-col items-center transition-all duration-300"
                    style={{ left: `${downloadProgress}%`, transform: 'translateX(-50%)' }}
                  >
                    {/* Animated UFO Pixel Art tracking progress */}
                    <motion.div 
                      className="flex flex-col items-center"
                      animate={{ y: [-4, 4, -4], rotate: [-2, 2, -2] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    >
                      <PixelUfo />
                      {/* Data Beam dropping down */}
                      <div className="absolute top-[28px] -z-10 w-12 overflow-hidden flex justify-center" style={{ height: '40px', clipPath: 'polygon(30% 0, 70% 0, 100% 100%, 0% 100%)' }}>
                        <motion.div 
                          className="w-full h-[200%] opacity-80"
                          style={{
                            backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 8px, #38bdf8 8px, #38bdf8 16px)',
                            backgroundSize: '100% 16px'
                          }}
                          animate={{ y: [-16, 0] }}
                          transition={{ repeat: Infinity, duration: 0.2, ease: "linear" }}
                        />
                      </div>
                    </motion.div>
                  </div>

                  <div 
                    className="absolute left-0 top-0 bottom-0 bg-pixel-blue transition-all duration-300 flex justify-end"
                    style={{ width: `${downloadProgress}%` }}
                  >
                    {/* Impact Spark at the leading edge */}
                    <motion.div 
                      className="w-2 h-full bg-white shadow-[0_0_15px_#fff,0_0_20px_#38bdf8] z-30"
                      animate={{ opacity: [0.3, 1, 0.3], scaleX: [0.8, 1.2, 0.8] }}
                      transition={{ repeat: Infinity, duration: 0.15 }}
                    />
                  </div>
                  <span className="relative z-10 font-bold drop-shadow-[0_2px_0_rgba(0,0,0,1)] text-white">
                    {downloadProgress.toFixed(1)}%
                  </span>
                </div>
                {downloadSpeed && (
                  <span className="text-pixel-yellow text-xs tracking-wider animate-pulse font-mono mt-1">
                    {downloadSpeed}
                  </span>
                )}
              </div>
              
              <button className="pixel-btn mt-4 text-pixel-red border-pixel-red hover:bg-pixel-red/20" onClick={handleCancelDownload}>
                {t('cancel')}
              </button>
            </motion.div>
          )}

          {/* 7. Settings Screen */}
          
            {/* 7. Settings Screen */}
                  
                  {appState === 'queue' && (
                    <motion.div
                      key="queue"
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full h-full"
                    >
                      <QueueView 
                        queue={queue} 
                        isQueueRunning={isQueueRunning} 
                        onStartQueue={() => setIsQueueRunning(true)} 
                        onStopQueue={() => setIsQueueRunning(false)} 
                        onRemoveItem={(id) => setQueue(q => q.filter(i => i.id !== id))} 
                      />
                    </motion.div>
                  )}
                  
                  {appState === 'settings' && (
                    <motion.div
  key="settings"
  initial={{ scale: 0.9, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{ scale: 0.9, opacity: 0 }}
  className="w-full max-w-[650px] relative p-1 bg-[#ffaa00] shadow-[0_0_20px_rgba(255,170,0,0.4)]"
>
  <div className="w-full h-full bg-black/95 border-2 border-black border-t-[#ffcc44] border-l-[#ffcc44] border-r-[#cc8800] border-b-[#cc8800] p-4 flex flex-col gap-1">
    
    {/* Header with Title and Bumpers */}
    <div className="flex w-full justify-between items-center mb-2 px-1">
      {/* LB Bumper */}
      <button 
        className="text-black bg-[#ffaa00] border-b-4 border-[#cc8800] active:border-b-0 active:translate-y-1 flex shrink-0 items-center justify-center hover:brightness-125 px-3 py-1.5 rounded-sm transition-all text-[11px] font-black shadow-[0_0_10px_rgba(255,170,0,0.5)]"
        onClick={() => {
          const tabs = ['general', 'youtube', 'vk', 'telegram', 'rutube', 'dzen'];
          const idx = tabs.indexOf(activeSettingsTab);
          setActiveSettingsTab(tabs[(idx - 1 + tabs.length) % tabs.length] as any);
        }}
      >
        &larr; LB [Q]
      </button>
      
      <h2 className="text-[#ffaa00] text-xl tracking-[0.2em] uppercase font-black drop-shadow-[0_2px_0_rgba(0,0,0,1)] flex items-center">
        SETTINGS<span className="animate-pulse ml-1">█</span>
      </h2>
      
      {/* RB Bumper */}
      <button 
        className="text-black bg-[#ffaa00] border-b-4 border-[#cc8800] active:border-b-0 active:translate-y-1 flex shrink-0 items-center justify-center hover:brightness-125 px-3 py-1.5 rounded-sm transition-all text-[11px] font-black shadow-[0_0_10px_rgba(255,170,0,0.5)]"
        onClick={() => {
          const tabs = ['general', 'youtube', 'vk', 'telegram', 'rutube', 'dzen'];
          const idx = tabs.indexOf(activeSettingsTab);
          setActiveSettingsTab(tabs[(idx + 1) % tabs.length] as any);
        }}
      >
        [E] RB &rarr;
      </button>
    </div>
    
    {/* Scrollable Tabs Area */}
    <div className="flex w-full justify-center items-center overflow-x-auto custom-scrollbar whitespace-nowrap text-[9px] font-bold tracking-widest px-4 pb-2 mb-2 border-b-2 border-pixel-darkblue/50 shrink-0">
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
            className={`transition-colors uppercase shrink-0 ${activeSettingsTab === tab.id ? 'text-[#ffaa00] border border-[#ffaa00] px-1 py-0.5 rounded-sm bg-[#ffaa00]/10 shadow-[0_0_5px_rgba(255,170,0,0.5)]' : 'text-[#ff3333] hover:text-[#ffaa00]'}`}
            onClick={() => setActiveSettingsTab(tab.id as any)}
          >
            {tab.label}
          </button>
          {idx < arr.length - 1 && <span className="text-[#ff3333]/50 shrink-0 mx-2">/</span>}
        </React.Fragment>
      ))}
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
                                  try {
                                    const res = await (window as any).api.youtubeAuth(tempYtClientId, tempYtClientSecret);
                                    if (res.success && res.refreshToken) {
                                      localStorage.setItem('ytRefreshToken', res.refreshToken); (window as any).api.secureStoreSet('ytRefreshToken', res.refreshToken);
                                      setGlobalAlert('✓ YouTube успешно подключен: ' + res.accountName);
                                      setAppState('execute'); setTimeout(() => setAppState('settings'), 10);
                                    } else {
                                      setGlobalAlert('❌ Ошибка авторизации: ' + (res.error || 'Отменено'));
                                    }
                                  } catch (e: any) {
                                    setGlobalAlert('❌ Ошибка: ' + e.message);
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
                            localStorage.setItem('vkToken', tempVkToken); (window as any).api.secureStoreSet('vkToken', tempVkToken)
                            setVkGroupId(tempVkGroupId)
                            localStorage.setItem('vkGroupId', tempVkGroupId)
                            setVkPostToWall(tempVkPostToWall)
                            localStorage.setItem('vkPostToWall', tempVkPostToWall ? 'true' : 'false')
        
                            
                            localStorage.setItem('tgBotToken', tempTgBotToken); (window as any).api.secureStoreSet('tgBotToken', tempTgBotToken)
                            
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
                    </div>
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
                <button className="arcade-btn arcade-btn-primary" onClick={addToQueue}>
                  "ДОБАВИТЬ В ОЧЕРЕДЬ"
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
