# ⚽ Quiniela Mundial 2026

Aplicación web Full Stack para crear grupos privados de quiniela del Mundial 2026:
registra pronósticos, consulta resultados oficiales, compite por puntaje y mira las
sedes en un mapa interactivo.

- **Backend:** Node.js + Express + Sequelize + SQLite + JWT (API REST por capas).
- **Frontend:** React + Vite + React Router + Leaflet (mapa), con CSS plano minimalista.
- **Sincronización:** proceso automático cada 20 min que actualiza marcadores desde
  [thesportsdb.com](https://www.thesportsdb.com).

---

## 📁 Estructura

```
ProyectoFinal/
├── backend/      API REST (puerto 4000)
│   ├── server.js
│   └── src/
│       ├── config/        conexión a la base de datos
│       ├── models/        modelos y relaciones (Sequelize)
│       ├── middleware/     JWT, validación y manejo de errores
│       ├── controllers/    lógica de cada recurso
│       ├── routes/         endpoints REST
│       ├── services/       puntuación, sincronización y thesportsdb
│       └── seed/           datos iniciales (admin + partidos + sedes)
└── frontend/     App React (puerto 5173)
    └── src/
        ├── api/            servicios que llaman a la API
        ├── context/        AuthContext (sesión con JWT)
        ├── components/      componentes reutilizables (Navbar, Mapa, etc.)
        ├── pages/          páginas (login, dashboard, grupos, partidos...)
        └── styles/         estilos globales
```

---

## 🚀 Cómo ejecutar

Necesitas **Node.js 18+**. Abre **dos terminales**.

### 1) Backend

```bash
cd backend
npm install
npm run dev        # arranca en http://localhost:4000
```

Al iniciar crea el archivo `database.sqlite`, siembra un **administrador** y
**partidos de ejemplo**, y programa la sincronización automática.

### 2) Frontend

```bash
cd frontend
npm install
npm run dev        # abre http://localhost:5173
```

> Las variables de entorno ya vienen configuradas en los archivos `.env`.
> Puedes copiarlas desde `.env.example` si hace falta.

---

## 👤 Cuentas

- **Administrador (sembrado):** `admin@admin.com` / `admin123`
- **Usuario normal:** regístrate desde la pantalla de registro.

---

## 🧮 Reglas de puntuación

| Acierto                                   | Puntos |
|-------------------------------------------|:------:|
| Marcador exacto                           |   3    |
| Solo el resultado (ganador o empate)      |   1    |
| Fallado                                   |   0    |

La clasificación de cada grupo ordena a los participantes por sus puntos acumulados.

---

## 🔌 Endpoints principales (API REST)

| Método | Ruta                              | Descripción                          | Acceso  |
|--------|-----------------------------------|--------------------------------------|---------|
| POST   | `/api/auth/register`              | Registrarse                          | Público |
| POST   | `/api/auth/login`                 | Iniciar sesión (devuelve token JWT)  | Público |
| GET/PUT| `/api/perfil`                     | Ver / editar perfil                  | Usuario |
| POST   | `/api/grupos`                     | Crear grupo                          | Usuario |
| GET    | `/api/grupos`                     | Mis grupos                           | Usuario |
| POST   | `/api/grupos/unirse`              | Unirse con código                    | Usuario |
| GET    | `/api/grupos/:id/participantes`   | Participantes                        | Usuario |
| GET    | `/api/grupos/:id/clasificacion`   | Clasificación                        | Usuario |
| GET    | `/api/partidos`                   | Calendario (filtros fase/fecha/estado)| Usuario |
| GET    | `/api/partidos/:id`               | Detalle de un partido                | Usuario |
| POST   | `/api/partidos`                   | Registrar partido                    | Admin   |
| PUT    | `/api/partidos/:id`               | Editar partido (sin tocar marcador)  | Admin   |
| GET/POST/PUT | `/api/pronosticos`          | Ver / crear / editar pronósticos     | Usuario |
| GET    | `/api/dashboard`                  | Resumen del usuario                  | Usuario |
| GET    | `/api/sedes`                      | Sedes oficiales (mapa)               | Usuario |

Todas las rutas de usuario requieren el header `Authorization: Bearer <token>`.

---

## 🔄 Sincronización con thesportsdb

El proceso (`src/services/sincronizacion.js`) se ejecuta **cada 20 minutos**: busca los
partidos del día que tengan `id_api` y actualiza su marcador y estado desde la API.
Cuando un partido finaliza, recalcula automáticamente los puntos de los pronósticos.

Para probarlo, edita un partido desde el panel admin y ponle un `id_api` real de
thesportsdb. Si no hay internet o no hay partidos vinculados, la app sigue funcionando
con los datos sembrados.
