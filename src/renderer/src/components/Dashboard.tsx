import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, UploadCloud, Scissors, Download, AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export interface DashboardProps {
  // Config
  useYt: boolean
  useVk: boolean
  useTg: boolean
  autoDelete: boolean
  
  // States
  dlProgress: number
  dlStatus: string
  dlSpeed: string
  
  ytProgress: number
  ytStatus: string
  
  vkProgress: number
  vkStatus: string
  
  tgProgress: number
  tgStatus: string

  onCancel: () => void
  onComplete?: () => void
  isPiP?: boolean
  onClickPiP?: () => void
}

const ProgressBar = ({ progress, color, active }: { progress: number, color: string, active: boolean }) => (
  <div className={`w-full h-4 border-2 border-pixel-darkblue p-[2px] bg-black relative overflow-hidden ${active ? 'shadow-[0_0_10px_rgba(255,255,255,0.2)]' : ''}`}>
    <motion.div 
      className="h-full transition-all"
      style={{ backgroundColor: color }}
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ ease: "linear", duration: 0.2 }}
    />
    {active && progress > 0 && progress < 100 && (
      <motion.div 
        className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    )}
  </div>
)

export const Dashboard = (props: DashboardProps) => {
  const { t } = useTranslation()

  // Calculate if a stage is active
  const isDlActive = props.dlProgress < 100 || props.dlStatus.includes('Склейка') || props.dlStatus.includes('Merging')
  const isDlDone = !isDlActive && props.dlProgress === 100

  const allDone = props.dlProgress === 100 && 
                  (!props.useYt || props.ytProgress === 100) && 
                  (!props.useVk || props.vkProgress === 100) && 
                  (!props.useTg || props.tgProgress === 100)

  
  if (props.isPiP) {
    return (
      <motion.div 
        layoutId="dashboard-container"
        onClick={props.onClickPiP}
        className="fixed bottom-6 right-6 z-[100] w-64 bg-black/95 border-2 border-[#38bdf8] p-3 shadow-[0_0_15px_rgba(56,189,248,0.5)] cursor-pointer hover:bg-black group transition-colors"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex justify-between items-center mb-2 border-b border-[#38bdf8]/50 pb-1">
          <span className="text-[#38bdf8] text-xs font-bold uppercase tracking-widest animate-pulse flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            MISSION CONTROL
          </span>
          <span className="text-white/50 text-[10px] group-hover:text-white transition-colors">EXPAND ↗</span>
        </div>
        
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-[10px]">
            <span className="text-[#38bdf8]">DL</span>
            <span className={isDlDone ? 'text-pixel-green' : 'text-[#38bdf8]'}>{props.dlProgress}%</span>
          </div>
          <ProgressBar progress={props.dlProgress} color={isDlDone ? '#22c55e' : '#38bdf8'} active={isDlActive} />
          
          {props.useYt && (
            <>
              <div className="flex justify-between text-[10px] mt-1">
                <span className="text-[#ff0000]">YT</span>
                <span className={props.ytProgress === 100 ? 'text-pixel-green' : 'text-[#ff0000]'}>{props.ytProgress}%</span>
              </div>
              <ProgressBar progress={props.ytProgress} color={props.ytProgress === 100 ? '#22c55e' : '#ff0000'} active={props.ytProgress > 0 && props.ytProgress < 100} />
            </>
          )}

          {props.useVk && (
            <>
              <div className="flex justify-between text-[10px] mt-1">
                <span className="text-[#4c75a3]">VK</span>
                <span className={props.vkProgress === 100 ? 'text-pixel-green' : 'text-[#4c75a3]'}>{props.vkProgress}%</span>
              </div>
              <ProgressBar progress={props.vkProgress} color={props.vkProgress === 100 ? '#22c55e' : '#4c75a3'} active={props.vkProgress > 0 && props.vkProgress < 100} />
            </>
          )}

          {props.useTg && (
            <>
              <div className="flex justify-between text-[10px] mt-1">
                <span className="text-[#26a5e4]">TG</span>
                <span className={props.tgProgress === 100 ? 'text-pixel-green' : 'text-[#26a5e4]'}>{props.tgProgress}%</span>
              </div>
              <ProgressBar progress={props.tgProgress} color={props.tgProgress === 100 ? '#22c55e' : '#26a5e4'} active={props.tgProgress > 0 && props.tgProgress < 100} />
            </>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      layoutId="dashboard-container"
      key="dashboard"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="pixel-panel w-full max-w-4xl flex flex-col gap-4 shadow-[0_0_40px_rgba(56,189,248,0.2)]"
    >
      <h2 className="text-[#38bdf8] text-2xl text-center border-b-2 border-pixel-darkblue pb-2 mb-2 tracking-widest uppercase flex items-center justify-center gap-3">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        MISSION CONTROL
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      </h2>

      <div className="flex flex-col gap-4">
        
        {/* 1. Download Stage */}
        <div className={`border-2 p-4 transition-colors ${isDlActive ? 'border-[#38bdf8] bg-[#38bdf8]/10' : isDlDone ? 'border-pixel-green/50 bg-pixel-green/5' : 'border-pixel-darkblue bg-black/40'}`}>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2 font-bold text-[#38bdf8]">
              <Download size={20} /> СКАЧИВАНИЕ ИСХОДНИКА
              {isDlDone && <Check className="text-pixel-green ml-2" size={18} />}
            </div>
            <div className="text-xs text-[#38bdf8]/80 text-right">
              {props.dlStatus} {props.dlSpeed && `| ${props.dlSpeed}`}
            </div>
          </div>
          <ProgressBar progress={props.dlProgress} color={isDlDone ? '#22c55e' : '#38bdf8'} active={isDlActive} />
        </div>

        {/* 2. YouTube Stage */}
        {props.useYt && (
          <div className={`border-2 p-4 transition-colors ${!isDlDone ? 'border-pixel-darkblue bg-black/40 opacity-50' : props.ytProgress < 100 ? 'border-[#ff0000] bg-[#ff0000]/10' : 'border-pixel-green/50 bg-pixel-green/5'}`}>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2 font-bold text-[#ff0000]">
                <UploadCloud size={20} /> YOUTUBE
                {props.ytProgress === 100 && <Check className="text-pixel-green ml-2" size={18} />}
              </div>
              <div className="text-xs text-[#ff0000]/80">
                {!isDlDone ? 'Ожидание исходника...' : props.ytStatus || 'Инициализация...'}
              </div>
            </div>
            <ProgressBar progress={!isDlDone ? 0 : props.ytProgress} color={props.ytProgress === 100 ? '#22c55e' : '#ff0000'} active={isDlDone && props.ytProgress < 100} />
          </div>
        )}

        {/* 3. VK Stage */}
        {props.useVk && (
          <div className={`border-2 p-4 transition-colors ${!isDlDone ? 'border-pixel-darkblue bg-black/40 opacity-50' : props.vkProgress < 100 ? 'border-[#0077ff] bg-[#0077ff]/10' : 'border-pixel-green/50 bg-pixel-green/5'}`}>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2 font-bold text-[#0077ff]">
                <UploadCloud size={20} /> VK VIDEO
                {props.vkProgress === 100 && <Check className="text-pixel-green ml-2" size={18} />}
              </div>
              <div className="text-xs text-[#0077ff]/80">
                {!isDlDone ? 'Ожидание исходника...' : props.vkStatus || 'Инициализация...'}
              </div>
            </div>
            <ProgressBar progress={!isDlDone ? 0 : props.vkProgress} color={props.vkProgress === 100 ? '#22c55e' : '#0077ff'} active={isDlDone && props.vkProgress < 100} />
          </div>
        )}

        {/* 4. Telegram Stage */}
        {props.useTg && (
          <div className={`border-2 p-4 transition-colors ${!isDlDone ? 'border-pixel-darkblue bg-black/40 opacity-50' : props.tgProgress < 100 ? 'border-[#0088cc] bg-[#0088cc]/10' : 'border-pixel-green/50 bg-pixel-green/5'}`}>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2 font-bold text-[#0088cc]">
                <Scissors size={20} /> TELEGRAM (НАРЕЗКА И ОТПРАВКА)
                {props.tgProgress === 100 && <Check className="text-pixel-green ml-2" size={18} />}
              </div>
              <div className="text-xs text-[#0088cc]/80">
                {!isDlDone ? 'Ожидание исходника...' : props.tgStatus || 'Инициализация...'}
              </div>
            </div>
            <ProgressBar progress={!isDlDone ? 0 : props.tgProgress} color={props.tgProgress === 100 ? '#22c55e' : '#0088cc'} active={isDlDone && props.tgProgress < 100} />
          </div>
        )}

      </div>

      <div className="mt-4 flex justify-between items-center">
        {props.autoDelete && (
           <div className="text-pixel-red text-xs flex items-center gap-1">
             <AlertTriangle size={14} /> Исходник будет удален после завершения всех процессов
           </div>
        )}
        {allDone ? (
          <button 
            className="pixel-btn pixel-btn-success ml-auto shadow-[0_0_15px_#22c55e]"
            onClick={props.onComplete || props.onCancel}
          >
            ГОТОВО
          </button>
        ) : (
          <button 
            className="pixel-btn text-pixel-red border-pixel-red hover:bg-pixel-red/20 ml-auto"
            onClick={props.onCancel}
          >
            {t('cancel', 'ОТМЕНА')}
          </button>
        )}
      </div>

    </motion.div>
  )
}
