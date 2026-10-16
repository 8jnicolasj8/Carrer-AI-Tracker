# INFORME: Career AI Tracker — Beta 0.1 (App de escritorio)

**Versión:** Beta 0.1 (sin IA)  
**Rama:** `app/beta-0.1`  
**Fecha:** 16/10/2026  
**Responsable:** Antigravity  

---

## 1. Qué se hizo

Se desarrolló y verificó la aplicación de escritorio completa de **Career AI Tracker** cumpliendo todas las especificaciones de `ESPECIFICACION_APP_BETA_0_1.md`:

1. **Arquitectura y Stack:**
   - Electron 32 + React 18 + TypeScript + Vite en `apps/desktop/`.
   - Compilación optimizada: Vite para renderer, esbuild para procesos `main` y `preload`.
   - Empaquetador para Windows con `electron-builder` (NSIS target).

2. **Contratos de Datos y Robustez (`src/contracts/`):**
   - Esquemas TypeScript y validadores para `partidos.jsonl`, `noticias.jsonl`, `50_estado_mundo.json`, `plantel.json` y `estado_actual.json`.
   - Modo Demo por defecto utilizando datos de muestra completamente ficticios y anonimizados en `fixtures/`.
   - Manejo estricto de banderas de confianza:
     - `no_disponible`: campos descartados sin inventar valores.
     - `goleadores_confiable = false`: mensaje informativo sin lista de goleadores.
     - `competicion.fuente = "heuristica"` y `*_estado = "HIPÓTESIS"`: badge visual discreto "estimado" con tooltip.
     - `tipo = "multiples_partidos"`: tarjeta unificada de totales con aviso explícito.

3. **Pantallas (`src/renderer/pages/`):**
   - **Dashboard:** Cabecera con escudo genérico SVG, nombre del club, récord (PJ, G, E, P, GF, GC, PTS), presupuesto de fichajes con variación, ticker de noticias reales con pausa al hover, match feed expandible (con minutos y notas) y quick stats. Excluye deliberadamente "Position", "Live" y contadores no respaldados.
   - **Squad:** Tabla completa de plantel con ordenación por columnas, buscador de jugadores, filtros por posición y drawer lateral con historial de minutos, notas de partido e insignia de lesión (solo si existe noticia de lesión para ese jugador).
   - **Staff:** 4 contactos (Assistant Manager, Youth Scout con datos reales de `estado_actual.ojeador`, Club President y Press Officer). Chat con respuestas rápidas y plantillas deterministas, fichas de miembro, y tarjetas modales para eventos de club con indicadores propios (`team_morale`, `media_pressure`, `board_confidence`).
   - **Settings:** Selector de carpeta de datos con botón de recarga e indicador de última lectura; sliders de personalidad de staff persistidos que modulan las plantillas; conmutador de idioma en vivo (inglés y español); sección de IA visible pero deshabilitada con aviso "AI arrives in Beta 0.3".

4. **Motor Determinista y Eventos (`src/engine/`, `src/data/`):**
   - Catálogo de más de 12 plantillas en `messages.en.json` y `messages.es.json` moduladas por la racha reciente y los sliders de personalidad.
   - Motor de eventos en `events.json` con los 4 tipos especificados (disciplinario con decisiones, lesión, conferencia de prensa y mensaje de fin de mes de la directiva).
   - Módulo de verificación de cumplimiento de sanción (`bench_player`), cubriendo con tests unitarios los 3 casos: **violado**, **cumplido** y **no verificable**.

5. **Calidad, Pruebas y Seguridad:**
   - 16 pruebas unitarias automáticas con Vitest (5 suites) pasando al 100%: contratos, confianza, cumplimiento, plantillas deterministas y garantía de solo lectura.
   - Prueba estricta de aislamiento de lectura: garantiza que ningún proceso escribe dentro de la carpeta de datos del usuario.
   - Seguridad de Electron: `contextIsolation: true`, `nodeIntegration: false`, CSP estricta `default-src 'self'`.
   - Cero dependencias de red en runtime.

6. **Higiene Open Source y Herramientas:**
   - Licencia MIT, `README.md`, `CONTRIBUTING.md`, issue templates, `.gitignore` exhaustivo.
   - Script `tools/anonymize-fixtures.js` para anonimizar fixtures reales de forma determinista.
   - Verificación de ausencia total de datos personales o rutas de usuario locales (`git grep`).
   - 4 capturas reales de alta fidelidad en `apps/desktop/screenshots/` (`dashboard.png`, `squad.png`, `staff.png`, `settings.png`).

---

## 2. Qué NO se hizo (Delimitaciones de la Beta 0.1)

- **Sin Inteligencia Artificial:** No se integraron llamadas a APIs ni modelos de lenguaje; las interfaces `AiProvider` y `StaffMessageSource` quedaron definidas para la Beta 0.3.
- **Sin lector de guardados integrado:** La app lee archivos JSON/JSONL ya extraídos; el motor de lectura nativa de saves de FIFA 16 corresponde a la Beta 0.2.
- **Sin datos no disponibles en el guardado:** No se muestran tablas de posiciones de otros equipos, alineaciones tácticas del rival ni contadores globales de lesionados/sancionados, preservando la honestidad de datos.
- **Sin telemetría ni peticiones de red:** Operación 100% local y offline.

---

## 3. Decisiones tomadas

1. **Diseño Visual:**
   - Paleta táctica oscura inspirada en los mockups: fondos `#0b1320` y `#0d1929`, bordes de vidrio `#1e293b` con brillo sutil y acentos verde/cian (`#10b981` y `#06b6d4`).
   - Totalmente libre de activos de EA Sports o marcas registradas (escudo vectorial genérico y nombres de ejemplo como "Atlético Meridian").
2. **Arquitectura de IPC:**
   - Canales IPC tipados en `preload.ts` con whitelist estricta para lectura de archivos, guardado de configuración de usuario en `userData` y apertura de diálogo nativo de Windows.
3. **Persistencia Local:**
   - Configuración de usuario (idioma, carpeta seleccionada, sliders de personalidad) almacenada limpiamente en `userData/settings.json`.

---

## 4. Problemas conocidos

1. **SmartScreen de Windows:**
   - El instalador generado con `npm run dist` no está firmado digitalmente con un certificado comercial EV/OV, por lo que Windows SmartScreen puede mostrar una advertencia estándar al ejecutarlo.
2. **Partidos simulados en bloque (`multiples_partidos`):**
   - Cuando en FIFA 16 se avanza el calendario sin jugar partido a partido, el juego acumula estadísticas sin desgloses individuales. La app maneja esto agrupando la información en una sola tarjeta de totales.

---

## 5. Qué falta para la Beta 0.2

1. **Motor de lectura integrado (`reader/`):** Incorporar la descompresión y parseo directo de los archivos de guardado `.sav` de FIFA 16 sin depender de scripts externos.
2. **Vigilante en tiempo real (file watcher):** Detección automática en segundo plano cuando el usuario guarda la partida en FIFA 16 para refrescar los datos al instante.
3. **Asistente de primer uso:** Detección automática del directorio de instalación de FIFA 16 y de la carpeta de guardados en `Documentos\FIFA 16`.
