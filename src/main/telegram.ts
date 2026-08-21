import axios from 'axios';

export async function validateTgToken(token: string): Promise<{valid: boolean, name?: string, error?: string}> {
  if (!token) return { valid: false, error: 'Токен пуст' };
  try {
    const res = await axios.get(`https://api.telegram.org/bot${token}/getMe`);
    if (res.data && res.data.ok) {
      const bot = res.data.result;
      return { valid: true, name: `@${bot.username}` };
    }
    return { valid: false, error: 'Неизвестный ответ от Telegram' };
  } catch (err: any) {
    if (err.response && err.response.data && err.response.data.description) {
      return { valid: false, error: err.response.data.description };
    }
    return { valid: false, error: err.message };
  }
}
