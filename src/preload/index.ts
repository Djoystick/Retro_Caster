import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  logError: (err: string) => ipcRenderer.send('log-error', err),
  parseUrl: (url: string) => ipcRenderer.invoke('parse-url', url),
  downloadVod: (url: string, title: string, customDir?: string, startTime?: string, endTime?: string) => ipcRenderer.invoke('download-vod', url, title, customDir, startTime, endTime),
  startMasterUpload: (videoPath: string, title: string, config: any) => ipcRenderer.invoke('start-master-upload', videoPath, title, config),
  cancelDownload: () => ipcRenderer.invoke('cancel-download'),
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  youtubeAuth: (clientId: string, clientSecret: string) => ipcRenderer.invoke('youtube-auth', clientId, clientSecret),
  vkAuth: () => ipcRenderer.invoke('vk-auth'),
  vkValidateToken: (token: string) => ipcRenderer.invoke('vk-validate-token', token),
  tgValidateToken: (token: string) => ipcRenderer.invoke('tg-validate-token', token),
  getGamification: () => ipcRenderer.invoke('get-gamification'),
  getHistory: () => ipcRenderer.invoke('get-history'),
  setEquippedShip: (ship: string) => ipcRenderer.invoke('set-equipped-ship', ship),
  secureStoreSet: (key: string, value: string) => ipcRenderer.invoke('secure-store-set', key, value),
  secureStoreGet: (key: string) => ipcRenderer.invoke('secure-store-get', key),
  onDownloadProgress: (callback: (data: {percent: number, status: string, speed?: string}) => void) => {
    ipcRenderer.removeAllListeners('download-progress')
    ipcRenderer.on('download-progress', (_event, data) => callback(data))
  },
  onUploadProgressYt: (callback: (data: {percent: number, status: string}) => void) => {
    ipcRenderer.removeAllListeners('upload-progress-yt')
    ipcRenderer.on('upload-progress-yt', (_event, data) => callback(data))
  },
  onUploadProgressVk: (callback: (data: {percent: number, status: string}) => void) => {
    ipcRenderer.removeAllListeners('upload-progress-vk')
    ipcRenderer.on('upload-progress-vk', (_event, data) => callback(data))
  },
  onUploadProgressTg: (callback: (data: {percent: number, status: string}) => void) => {
    ipcRenderer.removeAllListeners('upload-progress-tg')
    ipcRenderer.on('upload-progress-tg', (_event, data) => callback(data))
  },
  onMedalUnlocked: (callback: (medal: any) => void) => {
    ipcRenderer.removeAllListeners('medal-unlocked')
    ipcRenderer.on('medal-unlocked', (_event, data) => callback(data))
  },
  onLevelUp: (callback: (data: any) => void) => {
    ipcRenderer.removeAllListeners('level-up')
    ipcRenderer.on('level-up', (_event, data) => callback(data))
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
try {
  contextBridge.exposeInMainWorld('electron', electronAPI)
  contextBridge.exposeInMainWorld('api', api)
} catch (error) {
  console.error('Failed to expose API in contextBridge:', error)
}
