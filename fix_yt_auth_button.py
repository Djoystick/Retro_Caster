import re

file_path = r'src\renderer\src\App.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

old_button = """                              <button 
                                className="arcade-btn w-full bg-[#ff3333]/10 border-[#ff3333] text-[#ff3333] hover:bg-[#ff3333] hover:text-white !py-1.5 mt-1 text-[9px]"
                                onClick={async () => {
                                  const authUrl = await (window as any).api.ytGetAuthUrl(tempYtClientId, tempYtClientSecret)
                                  if (authUrl) {
                                    (window as any).api.openExternal(authUrl)
                                    setAppState('api_guide')
                                  }
                                }}
                              >"""

new_button = """                              <button 
                                className="arcade-btn w-full bg-[#ff3333]/10 border-[#ff3333] text-[#ff3333] hover:bg-[#ff3333] hover:text-white !py-1.5 mt-1 text-[9px]"
                                onClick={async () => {
                                  try {
                                    const res = await (window as any).api.youtubeAuth(tempYtClientId, tempYtClientSecret);
                                    if (res.success && res.refreshToken) {
                                      localStorage.setItem('ytRefreshToken', res.refreshToken);
                                      setGlobalAlert('✓ YouTube успешно подключен: ' + res.accountName);
                                      // Force re-render to show green badge
                                      setAppState('main_quest'); setTimeout(() => setAppState('settings'), 10);
                                    } else {
                                      setGlobalAlert('❌ Ошибка авторизации: ' + (res.error || 'Отменено'));
                                    }
                                  } catch (e: any) {
                                    setGlobalAlert('❌ Ошибка: ' + e.message);
                                  }
                                }}
                              >"""

if old_button in content:
    content = content.replace(old_button, new_button)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("YouTube Auth Button Fixed!")
else:
    print("Could not find old button in App.tsx. Using regex...")
    # fallback with regex
    pattern = re.compile(
        r'<button[^>]*onClick=\{async \(\) => \{\s*const authUrl = await \(window as any\)\.api\.ytGetAuthUrl[^}]*?\}\}[^>]*>',
        re.DOTALL
    )
    if pattern.search(content):
        content = pattern.sub(new_button.replace("                              <button", "<button"), content)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("YouTube Auth Button Fixed with Regex!")
    else:
        print("Failed completely to find the button")
