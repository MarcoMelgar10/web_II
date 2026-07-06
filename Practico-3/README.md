# OnlyFlans

Plataforma web donde los creadores publican contenido y reciben apoyo simbolico ("flanes") de sus seguidores.

## Estructura del proyecto

```
Practico-3/
  backend/     Node.js + Express + Prisma + PostgreSQL (NeonDB)
  frontend/    React + Vite
```

## Requisitos previos

- Node.js 18 o superior
- npm

## Configuracion del backend

```bash
cd backend
npm install
```

El archivo `.env` ya contiene la cadena de conexion a NeonDB. El schema ya fue aplicado a la base de datos.

Para regenerar el cliente Prisma si es necesario:

```bash
npx prisma generate
```

## Ejecutar el backend

```bash
cd backend
npm run dev
```

El servidor corre en `http://localhost:3001`.

## Configuracion del frontend

```bash
cd frontend
npm install
```

## Ejecutar el frontend

```bash
cd frontend
npm run dev
```

La app corre en `http://localhost:5173`.

## Uso

1. Abrir `http://localhost:5173`
2. Registrar una cuenta como **Creador** o **Seguidor**

### Como Creador:
- Ir a **Perfil** para crear el perfil publico (nombre, foto, banner)
- Ir a **Perfil** para definir metas de apoyo
- Ir a **Nueva Publicacion** para publicar texto o texto + imagen
- Ir a **Ingresos** para ver el reporte filtrado por fecha

### Como Seguidor:
- Ir a **Creadores** para buscar y explorar perfiles publicos
- Entrar al perfil de un creador y donar flanes para desbloquear sus publicaciones
- Dejar comentarios en las publicaciones
- Marcar creadores como favoritos
- Ver el **Feed** con publicaciones de todos los creadores a los que apoyaste
- Ver el **Historial de Donaciones** filtrado por fecha y nombre de creador

## Arquitectura del backend

```
src/
  config/           Configuracion de base de datos y constantes
  middlewares/      authenticate, requireRole, errorHandler, validate, upload
  modules/
    auth/           Registro, login, logout
    creator-profile/ Perfil publico del creador
    goals/          Metas de apoyo
    posts/          Publicaciones
    donations/      Donaciones (flanes)
    comments/       Comentarios en publicaciones
    favorites/      Creadores favoritos
    creators/       Listado publico de creadores
    feed/           Feed del seguidor
  utils/            Helpers de respuesta, JWT
```

Cada modulo sigue la estructura: `routes -> controller -> service -> repository`.

## Base de datos

PostgreSQL alojado en NeonDB. Entidades:

- `users` - Usuarios con rol CREATOR o FOLLOWER
- `creator_profiles` - Perfil publico del creador
- `goals` - Metas de apoyo del creador
- `posts` - Publicaciones
- `comments` - Comentarios de seguidores en publicaciones
- `donations` - Donaciones de flanes (extensible via campo `type`)
- `favorites` - Creadores favoritos del seguidor

## Reglas de negocio

- Los seguidores deben donar al menos un flan para ver las publicaciones de un creador
- Los creadores no pueden acceder a funcionalidades de seguidores y viceversa
- Cada flan tiene un precio fijo de Bs. 10 (configurable en `.env` como `FLAN_PRICE`)
- El modelo de donaciones es extensible: el campo `type` permite futuros tipos de apoyo
