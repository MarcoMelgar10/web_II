Proyecto: Quiniela Mundial 2026
Descripción
Quiniela Mundial 2026 es una aplicación web Full Stack desarrollada con React y Node.js
(Express o NestJS) que permite a los usuarios crear grupos privados de quiniela del
Mundial de Fútbol, registrar pronósticos, consultar resultados oficiales y competir con
otros participantes mediante un sistema de puntuación.
La aplicación deberá consumir una API REST, utilizar una base de datos relacional y
mostrar las sedes oficiales del torneo mediante un mapa interactivo.
Roles del sistema
Visitante
1. Un visitante podrá registrarse proporcionando nombre, correo electrónico y
contraseña.
2. Un visitante podrá iniciar sesión utilizando sus credenciales.
3. Un visitante no autenticado solo podrá acceder a las páginas públicas de
autenticación.
Usuario
Perfil
4. Un usuario podrá consultar y modificar su información personal.
5. Un usuario podrá cerrar sesión en cualquier momento.
Grupos
6. Un usuario podrá crear un grupo de quiniela indicando un nombre.
7. Un usuario podrá obtener el código de invitación de un grupo creado.
8. Un usuario podrá unirse a un grupo utilizando un código de invitación válido.
9. Un usuario podrá visualizar todos los grupos a los que pertenece.
10.Un usuario podrá consultar la lista de participantes de un grupo.
11.Un usuario podrá visualizar la clasificación actualizada del grupo. La clasificación
será definida por los desarrolladores, cada acierto cuenta con un puntaje
específico. Por ejemplo si se acertó con el score completo se tiene 3 puntos, si se
acertó solo ganador, tiene 1 punto y depende de uds si hubiera más reglas.
Partidos
12.Un usuario podrá consultar el calendario completo del Mundial.
13.Un usuario podrá filtrar partidos por fase, fecha o estado.
14.Un usuario podrá consultar el detalle de un partido.
15.Un usuario podrá visualizar la ciudad del estadio donde se disputará un partido.
Pronósticos
16.Un usuario podrá registrar un pronóstico antes del inicio de un partido.
17.Un usuario podrá modificar un pronóstico únicamente mientras el partido no haya
comenzado.
18.Un usuario podrá consultar todos sus pronósticos realizados.
19.Un usuario podrá visualizar los puntos obtenidos por cada pronóstico.
20.Un usuario podrá consultar su posición dentro de cada grupo.
Dashboard
25.Un usuario podrá visualizar un resumen con:
• cantidad de grupos a los que pertenece;
• próximos partidos pendientes de pronóstico;
• posición en cada grupo;
• puntaje acumulado.
Administrador
Gestión de partidos
26.Un administrador podrá registrar partidos.
27.Un administrador podrá modificar la información de un partido. No se podrá
modificar el resultado, se debería obtener de la API de thesportsdb.com
Sincronización
31. Se ejecutará un proceso automático que actualice los marcadores de los partidos
del día cada 20 minutos.
32. Los datos se obtendrán de la API gratuita de thesportsdb.com
Requerimientos no funcionales
• El frontend deberá desarrollarse utilizando React y JavaScript.
• El backend deberá desarrollarse utilizando Node.js con Express o NestJS.
• La comunicación entre frontend y backend deberá realizarse mediante una API
REST.
• La aplicación deberá utilizar JWT para la autenticación.
• La aplicación deberá almacenar la información en una base de datos relacional.
• La aplicación deberá implementar relaciones entre usuarios, grupos, partidos,
pronósticos.
• La aplicación deberá validar la información recibida antes de almacenarla.
• La aplicación deberá devolver respuestas utilizando códigos HTTP apropiados.
• La aplicación deberá organizar el backend utilizando una arquitectura por capas o
módulos.
• La aplicación deberá organizar el frontend utilizando componentes reutilizables,
páginas y servicios.
• La aplicación deberá implementar navegación sin recargar completamente la
página.
• La aplicación deberá mostrar estados de carga y mensajes de error durante las
operaciones.
• La aplicación deberá implementar formularios con validaciones del lado del
cliente.
• La configuración de la aplicación deberá realizarse mediante variables de entorno.