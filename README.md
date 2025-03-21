# PrimeVue Projesi 🚀

Modern ve kullanıcı dostu bir web uygulaması geliştirmek için Vue 3, PrimeVue ve Vuex tabanlı başlangıç şablonu.

## ✨ Özellikler

- 🎯 Vue 3 Composition API
- 🎨 PrimeVue UI Bileşenleri
- 📦 Vuex State Yönetimi
- 🔐 JWT Tabanlı Kimlik Doğrulama
- 🌐 Axios HTTP İstemcisi
- 💅 Tailwind CSS Desteği
- 📱 Modern ve Responsive Tasarım

## 📚 Temel Teknolojiler

### 📦 Vuex Nedir ve Nasıl Kullanılır?
Vuex, Vue.js uygulamaları için merkezi bir state (durum) yönetim kütüphanesidir. Projemizde özellikle kullanıcı oturumu ve veri yönetimi için kullanılmaktadır.

#### Temel Bileşenleri:
- **State**: Uygulamanın merkezi veri deposu
  - Kullanıcı bilgileri
  - Oturum durumu
  - Token bilgisi
  - Uygulama genelinde paylaşılan veriler
- **Mutations**: State'i değiştiren senkron fonksiyonlar
  - `setUser`: Kullanıcı bilgilerini günceller
  - `setToken`: JWT token'ı günceller
  - `setAuthenticated`: Oturum durumunu günceller
  - `clearUserData`: Oturum kapatma işlemi
- **Actions**: API çağrıları gibi asenkron işlemleri yöneten fonksiyonlar
  - `login`: Kullanıcı girişi
  - `logout`: Oturum kapatma
  - `checkAuth`: Token kontrolü
- **Getters**: State'ten türetilen hesaplanmış değerler

#### Projemizdeki Kullanımı:
```javascript
// Store'a erişim (./shared/store konumunda)
import store from './shared/store';

// Komponent içinde kullanım örneği:
export default {
    setup() {
        // Login işlemi
        const handleLogin = async (credentials) => {
            try {
                await store.dispatch('login', credentials);
                // Başarılı giriş
                router.push('/dashboard');
            } catch (error) {
                // ErrorService otomatik olarak hata mesajını gösterecek
            }
        };

        // Oturum kontrolü
        const checkAuthentication = async () => {
            const isValid = await store.dispatch('checkAuth');
            if (!isValid) {
                router.push('/login');
            }
        };

        return { handleLogin, checkAuthentication };
    }
}
```

### 🌐 Axios ve HTTP Service
Axios, HTTP istekleri için kullanılan güçlü bir JavaScript kütüphanesidir. Projemizde `HttpService` wrapper'ı ile kullanılmaktadır. Bu wrapper, token yönetimi ve hata işleme gibi ortak işlevleri merkezi olarak yönetir.

#### Özellikler ve Avantajları:
- **Token Yönetimi**: 
  - Her istekte otomatik JWT token ekleme
  - Token yenileme mekanizması
  - Oturum süresinin kontrolü
- **Hata Yönetimi**: 
  - Merkezi hata yakalama
  - PrimeVue Toast ile otomatik bildirimler
  - HTTP durum kodlarına özel işlemler
- **İnterceptor'lar**: 
  - İstek öncesi token kontrolü
  - Yanıt sonrası hata işleme
  - Otomatik yönlendirmeler

#### Projemizdeki Kullanımı:
```javascript
// HttpService'e erişim
import httpService from './shared/HttpService';

// API İstekleri Örnekleri:

// 1. Kullanıcı Girişi
const login = async (credentials) => {
    try {
        const response = await httpService.post('Auth/Login', credentials);
        const token = response.data.data.token;
        // Token otomatik olarak localStorage'a kaydedilir
        return response.data;
    } catch (error) {
        // ErrorService otomatik olarak hata mesajını gösterir
        throw error;
    }
};

// 2. Kullanıcı Bilgilerini Güncelleme
const updateUser = async (userId, userData) => {
    try {
        const response = await httpService.put(`Users/${userId}`, userData);
        // Başarılı güncelleme
        return response.data;
    } catch (error) {
        // 403: Yetkisiz erişim
        // 404: Kullanıcı bulunamadı
        // 500: Sunucu hatası
        throw error;
    }
};

// 3. Veri Listesi Çekme
const getList = async (params) => {
    try {
        const response = await httpService.get('api/items', { params });
        return response.data;
    } catch (error) {
        // Hata durumunda ErrorService devreye girer
        throw error;
    }
};
```

#### Vuex ve Axios Entegrasyonu:
```javascript
// Store action örneği
const actions = {
    async fetchUserData({ commit }) {
        try {
            const response = await httpService.get('Users/current');
            commit('setUser', response.data);
        } catch (error) {
            // ErrorService otomatik olarak hata mesajını gösterir
            commit('clearUserData');
            throw error;
        }
    }
};

// Komponent içinde kullanımı
const UserProfile = {
    setup() {
        const store = useStore();
        
        onMounted(async () => {
            try {
                await store.dispatch('fetchUserData');
            } catch {
                // Hata durumu ErrorService tarafından yönetilir
            }
        });
    }
};
```

## 📦 Kurulum

```bash
# Projeyi klonlayın
git clone [proje-url]

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

## 🏗️ Proje Yapısı

```
src/
├── assets/          # Statik dosyalar (CSS, resimler)
├── layout/          # Sayfa düzeni bileşenleri
├── model/          # Veri modelleri
├── router/         # Vue Router yapılandırması
├── service/        # API servisleri
├── shared/         # Paylaşılan bileşenler ve servisler
│   ├── AuthService.js    # Kimlik doğrulama servisi
│   ├── HttpService.js    # Axios HTTP istemcisi
│   └── ErrorService.js   # Hata yönetimi servisi
├── store/      # Vuex store modülleri
└── views/          # Sayfa bileşenleri
```

## 💡 Temel Bileşenler ve Kullanımları

### 🔐 Kimlik Doğrulama (Authentication)
- `AuthService`: JWT token yönetimi ve kullanıcı oturumu kontrolü
- `store/auth`: Vuex üzerinde kimlik bilgileri yönetimi
- Örnek Kullanım:
```javascript
// Login işlemi
await store.dispatch('login', credentials);

// Oturum kontrolü
if (authService.isAuthenticated()) {
    // ...
}
```

### 🌐 HTTP İstekleri
- `HttpService`: Axios tabanlı HTTP istemcisi
- Otomatik token ekleme ve hata yönetimi
- Örnek Kullanım:
```javascript
// GET isteği
const response = await httpService.get('api/endpoint');

// POST isteği
await httpService.post('api/endpoint', data);
```

### 📊 State Yönetimi
- Vuex ile merkezi state yönetimi
- `vuex-persistedstate` ile oturum verilerinin saklanması
- Örnek Kullanım:
```javascript
// State'e erişim
const user = store.state.user;

// Action tetikleme
await store.dispatch('actionName', payload);
```

### 🎨 UI Bileşenleri
- PrimeVue komponentleri entegre edilmiş
- Toast, Dialog, DataTable vb. hazır bileşenler
- Örnek Kullanım:
```vue
<template>
    <Toast />
    <Button label="Kaydet" @click="saveData" />
    <DataTable :value="items" />
</template>
```

### 🚦 Yönlendirme
- Vue Router ile sayfa yönlendirmeleri
- Oturum kontrolü için route guards
- Örnek Route Tanımı:
```javascript
{
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
}
```

### ⚠️ Hata Yönetimi
- `ErrorService`: Merkezi hata yönetimi
- PrimeVue Toast entegrasyonu
- HTTP hata kodları için özelleştirilmiş mesajlar
- Örnek Kullanım:
```javascript
try {
    // API çağrısı
} catch (error) {
    errorService.errorHandler(error);
}
```

## 🛠️ Geliştirme Komutları

```bash
# Geliştirme sunucusu
npm run dev

# Prodüksiyon build
npm run build

# Lint düzeltmeleri
npm run lint
```

## 📚 Kullanılan Teknolojiler

- Vue 3.4
- PrimeVue 4.3
- Vuex 4.0
- Vue Router 4.4
- Axios 1.8
- JWT Decode 4.0
- Tailwind CSS
- Vite


