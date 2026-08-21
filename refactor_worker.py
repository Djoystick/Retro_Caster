import re

with open('src/renderer/src/App.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Replace startDownload with addToQueue
addToQueue_code = """
  const addToQueue = () => {
    const newItem: QueueItem = {
      id: Date.now().toString(),
      url: twitchUrl,
      title: videoData.title,
      config: {
        useYt, useVk, useTg, autoDelete
      },
      status: 'pending'
    }
    setQueue(prev => [...prev, newItem])
    setAppState('execute')
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
      
      // Recursively process next (the effect will re-trigger, or we can just let the effect re-run because queue state changed)
    }

    // Only process if we aren't currently processing one!
    if (!queue.some(q => q.status === 'downloading' || q.status === 'uploading')) {
      processNext();
    }
  }, [queue, isQueueRunning])
"""

# We need to replace the entire startDownload function with addToQueue_code
c = re.sub(r"const startDownload = async \(\) => \{.*?\n  \n    const handleCancelDownload = async \(\) => \{", addToQueue_code + "\n\n  const handleCancelDownload = async () => {", c, flags=re.DOTALL)

with open('src/renderer/src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("App.tsx step 2 injected")
