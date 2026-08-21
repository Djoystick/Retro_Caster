import log from 'electron-log/main';
import { google } from 'googleapis';
import express from 'express';
import { shell } from 'electron';
import { Server } from 'http';

let oauth2Client: any = null;

export async function authenticateYouTube(clientId: string, clientSecret: string): Promise<{refreshToken: string, accountName: string}> {
  return new Promise((resolve, reject) => {
    // The redirect URI must be registered in the Google Cloud Console for the Desktop App client.
    const redirectUri = 'http://localhost:3000/oauth2callback';
    
    oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );

    const scopes = [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.readonly'
    ];

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline', // IMPORTANT to get a refresh token
      scope: scopes,
      prompt: 'consent' // Forces consent screen to ensure we get a refresh token
    });

    const app = express();
    let server: Server;
    
    app.get('/oauth2callback', async (req, res) => {
      try {
        const code = req.query.code as string;
        if (!code) {
          res.send('<h1 style="color:red;">Ошибка авторизации</h1><p>Код не найден.</p>');
          server.close();
          return reject(new Error('No code in callback'));
        }

        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        
        // Fetch channel name just to confirm
        const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
          let channelName = 'Неизвестный канал';
          try {
            const channelRes = await youtube.channels.list({
              part: ['snippet'],
              mine: true
            });
            channelName = channelRes.data.items?.[0]?.snippet?.title || 'Unknown Channel';
          } catch (apiErr: any) {
            console.error('Failed to fetch channel name:', apiErr.message);
            channelName = 'Канал подключен (сеть)';
          }
        
        res.send(`
          <div style="font-family: sans-serif; padding: 40px; text-align: center;">
            <h1 style="color:#22c55e;">RetroCaster: Авторизация успешна!</h1>
            <p>Подключен канал: <b>${channelName}</b></p>
            <p>Вы можете закрыть эту вкладку и вернуться в приложение.</p>
          </div>
        `);
        server.close();
        
        if (tokens.refresh_token) {
          resolve({ refreshToken: tokens.refresh_token, accountName: channelName });
        } else {
          reject(new Error('No refresh token received.'));
        }
      } catch (err: any) {
        res.send('<h1 style="color:red;">Ошибка авторизации</h1><p>' + err.message + '</p>');
        server.close();
        reject(err);
      }
    });

    server = app.listen(3000, () => {
      // Open the browser to the authorize url
      shell.openExternal(url);
    });
    
    // Timeout after 3 minutes
    setTimeout(() => {
      if (server.listening) {
        server.close();
        reject(new Error('OAuth timeout - пользователь не завершил авторизацию.'));
      }
    }, 3 * 60 * 1000);
  });
}

import fs from 'fs';

export async function uploadToYouTube(
  clientId: string,
  clientSecret: string,
  refreshToken: string,
  videoPath: string,
  title: string,
  onProgress: (percent: number, status: string) => void
): Promise<{ success: boolean; error?: string }> {
  try {
    onProgress(0, 'Подключение к YouTube API...');
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, 'http://localhost:3000/oauth2callback');
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
    
    const fileSize = fs.statSync(videoPath).size;

    onProgress(0, 'Начинаю загрузку видео...');
    
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        attempts++;
        await youtube.videos.insert(
          {
            part: ['snippet', 'status'],
            requestBody: {
              snippet: {
                title: title || 'Twitch VOD Upload',
                description: 'Uploaded by RetroCaster',
                tags: ['twitch', 'vod', 'retrocaster'],
                categoryId: '20'
              },
              status: {
                privacyStatus: 'public',
                selfDeclaredMadeForKids: false
              }
            },
            media: {
              mimeType: 'video/mp4',
              body: fs.createReadStream(videoPath)
            }
          },
          {
            onUploadProgress: (evt) => {
              if (evt.bytesRead) {
                const percent = (evt.bytesRead / fileSize) * 100;
                onProgress(Math.min(100, Math.round(percent)), 'Загрузка: ' + Math.round(percent) + '%');
              }
            }
          }
        );
        break; // Success, exit loop
      } catch (err: any) {
        if (attempts >= maxAttempts) {
          throw err;
        }
        log.warn(`YouTube upload failed on attempt ${attempts}. Retrying in 5 seconds...`, err.message);
        onProgress(0, `Сбой сети. Повтор (${attempts}/${maxAttempts})...`);
        await new Promise(r => setTimeout(r, 5000));
      }
    }

    onProgress(100, 'Успешно загружено!');
    return { success: true };
  } catch (err: any) {
    log.error('YouTube upload error:', err);
    return { success: false, error: err.message };
  }
}
