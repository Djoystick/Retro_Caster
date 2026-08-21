import log from 'electron-log/main';
import { BrowserWindow } from 'electron';

export async function authenticateVK(mainWindow: BrowserWindow): Promise<{token: string, userId: string}> {
  return new Promise((resolve, reject) => {
    // Kate Mobile App ID
    const APP_ID = '2685278';
    const authUrl = `https://oauth.vk.com/authorize?client_id=${APP_ID}&scope=video,groups,wall,offline&response_type=token&redirect_uri=https://oauth.vk.com/blank.html&v=5.131`;

    const authWindow = new BrowserWindow({
      width: 600,
      height: 700,
      parent: mainWindow,
      modal: true,
      show: false,
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      }
    });

    authWindow.loadURL(authUrl);

    authWindow.once('ready-to-show', () => {
      authWindow.show();
    });

    // We must intercept the redirect. It happens via URL hash change.
    authWindow.webContents.on('will-navigate', (_, newUrl) => {
      checkUrl(newUrl);
    });
    
    authWindow.webContents.on('will-redirect', (_, newUrl) => {
      checkUrl(newUrl);
    });
    
    // In some cases (especially hash changes on the same page), 'did-navigate-in-page' is fired.
    authWindow.webContents.on('did-navigate-in-page', (_, newUrl) => {
      checkUrl(newUrl);
    });

    let resolved = false;

    function checkUrl(url: string) {
      if (url.includes('blank.html') && url.includes('access_token=')) {
        try {
          // Parse hash: #access_token=...&expires_in=0&user_id=...
          const hash = url.split('#')[1];
          const params = new URLSearchParams(hash);
          const accessToken = params.get('access_token');
          const userId = params.get('user_id');

          if (accessToken) {
            resolved = true;
            resolve({ token: accessToken, userId: userId || '' });
          } else {
            resolved = true;
            reject(new Error('Токен не найден в URL'));
          }
        } catch (error: any) {
          resolved = true;
          reject(new Error('Ошибка при парсинге токена: ' + error.message));
        } finally {
          authWindow.close();
        }
      } else if (url.includes('blank.html') && url.includes('error=')) {
        resolved = true;
        reject(new Error('ВКонтакте вернул ошибку. Вы отказали в доступе?'));
        authWindow.close();
      }
    }

    authWindow.on('closed', () => {
      if (!resolved) {
        reject(new Error('Окно авторизации было закрыто пользователем.'));
      }
    });
  });
}

import axios from 'axios';

export async function validateVkToken(token: string): Promise<{valid: boolean, name?: string, error?: string}> {
  if (!token) return { valid: false, error: 'Токен пуст' };
  
  let cleanToken = token.trim();
  // If user pasted the whole URL, extract the token smartly
  if (cleanToken.includes('access_token=')) {
    const match = cleanToken.match(/access_token=([^&]+)/);
    if (match && match[1]) {
      cleanToken = match[1];
    }
  } else if (cleanToken.includes('&')) {
    cleanToken = cleanToken.split('&')[0];
  }
  try {
    const res = await axios.get(`https://api.vk.com/method/users.get?v=5.131&access_token=${cleanToken}`);
    if (res.data && res.data.response && res.data.response.length > 0) {
      const user = res.data.response[0];
      return { valid: true, name: `${user.first_name} ${user.last_name}` };
    } else if (res.data && res.data.error) {
      return { valid: false, error: res.data.error.error_msg };
    }
    return { valid: false, error: 'Неизвестный ответ от VK' };
  } catch (err: any) {
    return { valid: false, error: err.message };
  }
}

import fs from 'fs';
import FormData from 'form-data';

export async function uploadToVK(
  token: string,
  videoPath: string,
  title: string,
  groupId: string,
  postToWall: boolean,
  onProgress: (percent: number, status: string) => void
): Promise<{ success: boolean; error?: string }> {
  try {
    // Очищаем токен смарт-парсером
    let cleanToken = token.trim();
    if (cleanToken.includes('access_token=')) {
      const match = cleanToken.match(/access_token=([^&]+)/);
      if (match && match[1]) {
        cleanToken = match[1];
      }
    } else if (cleanToken.includes('&')) {
      cleanToken = cleanToken.split('&')[0];
    }
    
    onProgress(0, 'Получение ссылки для загрузки...');

    const saveParams = new URLSearchParams();
    saveParams.append('v', '5.131');
    saveParams.append('access_token', cleanToken);
    saveParams.append('name', title || 'Twitch VOD Upload');
    saveParams.append('description', 'Uploaded by RetroCaster');
    saveParams.append('wallpost', postToWall ? '1' : '0'); 
    
    if (groupId && groupId.trim() !== '') {
      saveParams.append('group_id', groupId.trim());
    }

    const saveRes = await axios.post('https://api.vk.com/method/video.save', saveParams);
    
    if (saveRes.data.error) {
      throw new Error(saveRes.data.error.error_msg);
    }
    
    const uploadUrl = saveRes.data.response.upload_url;
    
    if (!uploadUrl) {
      throw new Error('Не удалось получить upload_url от ВКонтакте');
    }

    onProgress(0, 'Начинаю загрузку видео в VK...');

    const form = new FormData();
    const stat = fs.statSync(videoPath);
    form.append('video_file', fs.createReadStream(videoPath), { knownLength: stat.size });

    const length = await new Promise<number>((resolve, reject) => {
      form.getLength((err, len) => {
        if (err) reject(err);
        else resolve(len);
      });
    });

    const headers = {
      ...form.getHeaders(),
      'Content-Length': length
    };

    const result = await new Promise<{success: boolean, error?: string}>((resolve) => {
      const { parse } = require('url');
      const https = require('https');
      const urlObj = parse(uploadUrl);
      
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || 443,
        path: urlObj.path,
        method: 'POST',
        headers: headers
      };

      const req = https.request(options, (res: any) => {
        let responseData = '';
        res.on('data', (chunk: any) => responseData += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseData);
            if (parsed.error) {
              resolve({ success: false, error: parsed.error });
            } else {
              resolve({ success: true });
            }
          } catch (e: any) {
            resolve({ success: false, error: 'Ошибка парсинга ответа VK: ' + e.message });
          }
        });
      });

      req.on('error', (e: any) => {
        resolve({ success: false, error: 'Network error: ' + e.message });
      });

      let uploadedBytes = 0;
      let lastReportTime = 0;

      // Pipe form data to request and track progress manually
      form.on('data', (chunk) => {
        uploadedBytes += chunk.length;
        const now = Date.now();
        if (now - lastReportTime > 500) { // report every 500ms
          const percent = Math.min(100, Math.round((uploadedBytes * 100) / length));
          onProgress(percent, 'Загрузка: ' + percent + '%');
          lastReportTime = now;
        }
      });

      form.pipe(req);
    });
    
    if (!result.success) {
       throw new Error(result.error);
    }

    onProgress(100, 'Успешно загружено!');
    return { success: true };
  } catch (err: any) {
    log.error('VK upload error:', err);
    return { success: false, error: err.message };
  }
}
