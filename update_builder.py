import re

with open('electron-builder.yml', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace("appId: com.electron.app", "appId: com.djoystick.retrocaster")
c = c.replace("productName: retrocaster-app", "productName: RetroCaster")
c = c.replace("executableName: retrocaster-app", "executableName: RetroCaster")
c = c.replace("artifactName: retrocaster-app-${version}-setup.exe", "artifactName: RetroCaster-Installer-v${version}.exe")
c = c.replace("shortcutName: retrocaster-app", "shortcutName: RetroCaster")
c = c.replace("uninstallDisplayName: retrocaster-app", "uninstallDisplayName: RetroCaster")

# Let's also output a Portable version as the main artifact
c = c.replace("""win:
  executableName: RetroCaster
  target:
    - target: nsis
    - target: portable""", """win:
  executableName: RetroCaster
  target:
    - target: nsis
    - target: portable
portable:
  artifactName: RetroCaster-Portable-v${version}.exe""")

with open('electron-builder.yml', 'w', encoding='utf-8') as f:
    f.write(c)

print("electron-builder.yml updated for RetroCaster names.")
