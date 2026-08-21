import re

with open('src/renderer/src/App.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. State for titleTemplate
state_target = "const [tempLanguage, setTempLanguage] = useState(() => localStorage.getItem('appLanguage') || 'ru')"
state_new = """const [tempLanguage, setTempLanguage] = useState(() => localStorage.getItem('appLanguage') || 'ru')
  const [titleTemplate, setTitleTemplate] = useState(() => localStorage.getItem('appTitleTemplate') || '{title}')
  const [tempTitleTemplate, setTempTitleTemplate] = useState(titleTemplate)"""
if "appTitleTemplate" not in c:
    c = c.replace(state_target, state_new)

# 2. Add input field to General Settings
general_target = """                              <div className="flex flex-col gap-1 w-full">
                                <label className="text-[#ffaa00] text-[9px] font-bold tracking-widest uppercase">{t('download_folder')}</label>"""
general_new = """                              <div className="flex flex-col gap-1 w-full">
                                <label className="text-[#ffaa00] text-[9px] font-bold tracking-widest uppercase">Шаблон названия</label>
                                <input 
                                  className="arcade-input bg-black text-pixel-light text-[10px] !p-1.5 w-full min-w-0"
                                  value={tempTitleTemplate}
                                  onChange={(e) => setTempTitleTemplate(e.target.value)}
                                  placeholder="{title} - {date}"
                                />
                                <span className="text-[#ffaa00]/50 text-[8px]">Доступные переменные: {title}, {date}</span>
                              </div>
                              
                              <div className="flex flex-col gap-1 w-full">
                                <label className="text-[#ffaa00] text-[9px] font-bold tracking-widest uppercase">{t('download_folder')}</label>"""
if "Шаблон названия" not in c:
    c = c.replace(general_target, general_new)

# 3. Save titleTemplate in settings save button
save_target = """                              localStorage.setItem('appLanguage', tempLanguage)
                              localStorage.setItem('appDownloadDir', tempDownloadDir)"""
save_new = """                              localStorage.setItem('appLanguage', tempLanguage)
                              localStorage.setItem('appDownloadDir', tempDownloadDir)
                              setTitleTemplate(tempTitleTemplate)
                              localStorage.setItem('appTitleTemplate', tempTitleTemplate)"""
if "setTitleTemplate" not in c:
    c = c.replace(save_target, save_new)

# 4. addToQueue formatting
add_to_queue_target = """const newItem: QueueItem = {
      id: Date.now().toString(),
      url: twitchUrl,
      title: videoData.title,
      config: {"""
add_to_queue_new = """const formattedTitle = titleTemplate
      .replace('{title}', videoData.title)
      .replace('{date}', new Date().toLocaleDateString('ru-RU'))
      
    const newItem: QueueItem = {
      id: Date.now().toString(),
      url: twitchUrl,
      title: formattedTitle,
      thumbnailUrl: videoData?.thumbnail,
      config: {"""
if "formattedTitle" not in c:
    c = c.replace(add_to_queue_target, add_to_queue_new)

# 5. processNext worker
worker_target = """const config = {
          useYt: nextItem.config.useYt, ytTrim: nextItem.config.ytTrim,
          useVk: nextItem.config.useVk, vkTrim: nextItem.config.vkTrim,
          useTg: nextItem.config.useTg, tgTrim: nextItem.config.tgTrim,
          autoDelete: nextItem.config.autoDelete,
          ytClientId: ytClientId,
          ytClientSecret: ytClientSecret,
          tgTopicId: tgTopicId
        }"""
worker_new = """const config = {
          useYt: nextItem.config.useYt, ytTrim: nextItem.config.ytTrim,
          useVk: nextItem.config.useVk, vkTrim: nextItem.config.vkTrim,
          useTg: nextItem.config.useTg, tgTrim: nextItem.config.tgTrim,
          autoDelete: nextItem.config.autoDelete,
          ytClientId: ytClientId,
          ytClientSecret: ytClientSecret,
          tgTopicId: tgTopicId,
          thumbnailUrl: nextItem.thumbnailUrl
        }"""
if "thumbnailUrl: nextItem.thumbnailUrl" not in c:
    c = c.replace(worker_target, worker_new)

with open('src/renderer/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("App.tsx updated with smart metadata and thumbnail queueing.")
