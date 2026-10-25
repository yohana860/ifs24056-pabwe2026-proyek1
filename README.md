# NextOwner — Front-end
Proyek 1 PABWE 2026 (individu). Web platform preloved & thrifting. Repo back-end terpisah: `ifs24056-pabwe2026-proyek1-backend`.

- **Stack:** React 19 + Vite + Tailwind CSS 4 + Lucide React
- **Pengujian:** Vitest + Testing Library (coverage 100%), Jenkins + SonarQube
- Prasyarat: Node.js 20+ dan Git

## Menjalankan di localhost
Jalankan dulu back-end (lihat README repo back-end, API di http://localhost:4000), lalu:
```bash
git clone <url-repository-frontend> ifs24056-pabwe2026-proyek1-frontend
cd ifs24056-pabwe2026-proyek1-frontend
cp .env.example .env        # Windows CMD: copy .env.example .env
npm install
npm run dev                 # web di http://localhost:5173
```
Akun demo: `demo@nextowner.id` / `demo123`.

## Konfigurasi (.env)
| Variabel | Fungsi |
|---|---|
| `VITE_API_URL` | Alamat API. Lokal: `/api` (diteruskan proxy Vite). Setelah deploy: URL back-end, mis. `https://<domain-backend>/api` |
| `VITE_PROXY_TARGET` | Target proxy dev, default `http://localhost:4000` |
| `APP_PORT` | Port dev, default `5173` |

File `.env` tidak ikut ke deploy (dikecualikan pipeline). Karena itu URL backend yang sudah ter-deploy ditulis sebagai nilai cadangan di `src/helpers/apiHelper.js` (`BASE_URL`); untuk lokal, `.env` dengan `VITE_API_URL=/api` mengambil alih.

## Pengujian dan build
```bash
npm run test:coverage       # laporan di coverage/lcov.info (dibaca SonarQube)
npm run build               # hasil di dist/
```

## Deploy
Deploy terpisah dari back-end. Pipeline ada di `Jenkinsfile` (Checkout, Install, Test, Build, Trivy, SonarQube, Quality Gate, Package, Publish, Deploy).

## Struktur
```
src/  features/(auth, items, favorites, cart, chat, common)/{api,states,components,pages,layouts}  helpers/  hooks/
```
Tes diletakkan di samping kodenya (`*.test.js`, `*.test.jsx`).
