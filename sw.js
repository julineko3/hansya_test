//キャッシュの名前
var CACHE_NAME='v1.0-pwa-cache-name';
//キャッシュ対象URL一覧配列
var urlsToCache = [
  '/javascript/pwa/',
  '/javascript/pwa/index.html',
  '/javascript/pwa/icon.png',
];

//インストール処理(キャッシュに入れる)
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
        return cache.addAll(urlsToCache.map(url => new Request(url, {credentials: 'same-origin'})));
    })
  );
});

//リソースフェッチ時のキャッシュロード処理
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response){
      return response || fetch(event.request);
    })
  );
});

// アクティベーションイベント：不要なキャッシュを削除
self.addEventListener('activate', event => {
  console.log("activated");
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
              //console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
          }
        })
      );
    })
  );
});