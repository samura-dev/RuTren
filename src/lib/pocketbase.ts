import PocketBase from 'pocketbase';

// Дефолтный локальный URL
const PB_URL = import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090';

export const pb = new PocketBase(PB_URL);

// Отключаем автоматическую отмену дублирующихся запросов,
// так как в React (особенно в StrictMode) это может вызывать ошибки
pb.autoCancellation(false);

export default pb;
