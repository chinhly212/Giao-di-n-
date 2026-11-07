const CACHE_NAME = 'vibnest-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-brands-400.woff2'
];

// Cài đặt và lưu trữ giao diện
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Xóa cache cũ nếu có bản cập nhật mới
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
});

// Chặn các request để trả về dữ liệu từ Cache nếu có mạng yếu/mất mạng
self.addEventListener('fetch', (e) => {
  // BỎ QUA API JSONBIN (Để code tự động dùng dữ liệu LocalStorage dự phòng)
  if (e.request.url.includes('api.jsonbin.io')) {
    return; 
  }
  
  e.respondWith(
    caches.match(e.request).then((response) => {
      // Nếu có trong cache thì trả về, không thì lên mạng tải
      return response || fetch(e.request);
    })
  );
});
