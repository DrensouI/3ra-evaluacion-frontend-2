Descripción
Proyecto frontend para la 3ra evaluación: una pequeña herramienta de gestión de obras, personal y reportes con autenticación local y persistencia en el navegador.
Problema a resolver
La empresa no cuenta con un sistema para digitalizar y organizar expedientes de obras y reportes diarios; la solución propone un portal con login, CRUD de obras y gestión de reportes y personal.

Cómo ejecutar localmente
Requisitos: Node.js, npm install y npm run dev
Abrir cmd
Una vez adentro
ir al directorio de la carpeta y ejecutar cd con la ubicacion de donde esta la carpeta con el codigp

Instalar dependencias:

npm install y npm run dev


Abrir en el navegador: http://localhost:3000

Credenciales de prueba
Usuario por defecto para prueba:

- Correo: `admin@admin.com`
- Contraseña: `123456`

Estructura y archivos relevantes
`src/context/AuthContext.tsx`: manejo de sesión, `login`/`logout` y persistencia en `localStorage`.
`src/componentes/Login.tsx`: formulario de inicio de sesión y validaciones locales. 
`src/componentes/Dashboard.tsx`: vista principal con KPIs y distribución de estados.
`src/componentes/ObrasYProyectos.tsx`: CRUD de obras (crear, editar, eliminar, buscar).
`src/componentes/Personal.tsx`: (gestión de empleados) — lista, filtros y edición.
`src/componentes/Reportes.tsx`: registro y listado de reportes vinculados a obras.
`public/`: assets y recursos estáticos.

Módulos implementados

Login con sesión y persistencia en `localStorage` (`CLAVE_SESION: hexacall_sesion`).
Rutas protegidas / redirección al dashboard si existe sesión activa.
CRUD de obras/proyectos con campos `nombre`, `ubicación`, `presupuesto` y `estado`.
Detalle de obra y edición inline desde el listado.
Gestión básica de personal (crear/editar/eliminar y filtros por cargo/obra).
Módulo de reportes: crear registros diarios vinculados a una obra, editar y eliminar.
Sidebar de navegación y cierre de sesión (limpia la sesión y redirige al login).

