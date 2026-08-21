import re

with open('electron-builder.yml', 'r', encoding='utf-8') as f:
    c = f.read()

replacement = """nsis:
  oneClick: false
  allowToChangeInstallationDirectory: true
  artifactName: RetroCaster-Installer-v${version}.exe
  shortcutName: RetroCaster
  uninstallDisplayName: RetroCaster
  createDesktopShortcut: always
  installerIcon: build/icon.ico
  uninstallerIcon: build/icon.ico
  installerSidebar: build/installerSidebar.bmp
  uninstallerSidebar: build/installerSidebar.bmp
  installerHeader: build/installerHeader.bmp"""

c = re.sub(r"nsis:[\s\S]*?(?=mac:)", replacement + "\n", c)

with open('electron-builder.yml', 'w', encoding='utf-8') as f:
    f.write(c)

print("electron-builder.yml updated with custom NSIS theme.")
