/*
 * Career AI Tracker - landing translations.
 *
 * English is the base language. Every visible string lives here; nothing is
 * hard-coded in the HTML. The language switcher swaps these at runtime and
 * remembers the choice (see main.js).
 */
window.I18N = {
  en: {
    "meta.title": "Career AI Tracker - FIFA 16 Career Mode companion",
    "meta.description":
      "Free, open source desktop companion for FIFA 16 Career Mode. It reads your career save (read-only) and shows results, club record, squad, game news and a staff room.",

    "nav.home": "Home",
    "nav.features": "Features",
    "nav.how": "How it works",
    "nav.screenshots": "Screenshots",
    "nav.download": "Download",
    "nav.faq": "FAQ",
    "nav.github": "GitHub",
    "nav.menu": "Open menu",

    "lang.label": "Language",
    "lang.en": "EN",
    "lang.es": "ES",

    "a11y.skip": "Skip to content",
    "a11y.mainNav": "Main navigation",
    "a11y.footerNav": "Footer navigation",

    "hero.eyebrow": "AI-powered companion for FIFA 16 Career Mode",
    "hero.titleA": "Level Up Your",
    "hero.titleB": "FIFA\u00a016 Career Mode",
    "hero.sub":
      "A desktop app that reads your FIFA 16 career save and turns it into results, club record, squad detail, game news and a staff room. Read-only: it never writes to your saves.",
    "hero.ctaPrimary": "Download for Windows",
    "hero.ctaPrimarySoon": "Coming soon",
    "hero.ctaSecondary": "View on GitHub",
    "hero.badge.free": "Free & open source (MIT)",
    "hero.badge.readonly": "Read-only: never touches your saves",
    "hero.badge.key": "Bring your own AI key",
    "hero.badge.windows": "Windows",
    "hero.status": "Beta in development",
    "hero.alt":
      "Concept preview of the Career AI Tracker dashboard for a fictional club.",

    "features.title": "Everything your career mode needs, in one window",
    "features.sub":
      "The app reads your save and shows what the game already recorded, without touching it.",
    "features.c1.title": "Save-aware dashboard",
    "features.c1.desc":
      "Every time you save, your career updates. No live clock, no guessing.",
    "features.c1.b1": "Match results and minutes played after each save",
    "features.c1.b2": "Your club's record and squad stats",
    "features.c1.b3": "News from your own game: rumors and injuries",
    "features.c2.title": "Staff room",
    "features.c2.desc":
      "Your assistant manager, youth scout, club president and press officer react to what happens in your career.",
    "features.c2.b1": "Rule-based messages in the beta",
    "features.c2.b2": "AI from Beta 0.3, with your own key",
    "features.c3.title": "Club events with consequences",
    "features.c3.desc":
      "Disciplinary issues, injuries or board pressure, where your decisions matter.",
    "features.c3.b1":
      "The app can check your save to see if you honored a decision",
    "features.c3.b2":
      "For example, whether you kept a player on the bench for N matches",

    "how.title": "How it works",
    "how.sub": "Three steps, no account and no live connection.",
    "how.s1.title": "Play and save",
    "how.s1.desc":
      "Keep playing your career mode as usual and save when the game does.",
    "how.s2.title": "The app reads your save, read-only",
    "how.s2.desc":
      "It reads your career save to find results, minutes, record, budget, squad and news. Nothing is modified.",
    "how.s3.title": "Your staff and events react",
    "how.s3.desc":
      "Your staff room and club events update from what the save shows. Rules in Beta 0.1; AI in Beta 0.3.",

    "ai.eyebrow": "Bring your own AI key",
    "ai.title": "Use your own AI provider",
    "ai.sub":
      "From Beta 0.3, connect your preferred AI provider with your own key. No account, no telemetry, and your keys stay on your PC.",
    "ai.role1": "President",
    "ai.role2": "Assistant Manager",
    "ai.role3": "Scout",
    "ai.role4": "Press Officer",
    "ai.badge": "Coming in Beta 0.3",
    "ai.note":
      "In Beta 0.1 the staff room uses deterministic templates: no AI and no network.",
    "ai.keyLabel": "Your API key",
    "ai.providerNote": "OpenAI-compatible: local models and more",

    "roadmap.title": "Roadmap",
    "roadmap.sub": "Three betas, each one adding a layer.",
    "roadmap.p1.tag": "Beta 0.1",
    "roadmap.p1.title": "Dashboard, squad and staff room",
    "roadmap.p1.desc":
      "Rule-based messages and club events. No AI and no network.",
    "roadmap.p2.tag": "Beta 0.2",
    "roadmap.p2.title": "Save reading built in",
    "roadmap.p2.desc":
      "Automatic save reading integrated and a Windows installer.",
    "roadmap.p3.tag": "Beta 0.3",
    "roadmap.p3.title": "AI staff and events",
    "roadmap.p3.desc": "AI staff and club events, using your own key.",
    "roadmap.current": "Current",

    "shots.title": "Screenshots",
    "shots.sub":
      "Concept previews built with a fictional club and players. They will be replaced by real captures.",
    "shots.tag": "Concept preview",
    "shots.s1": "Dashboard",
    "shots.s2": "Squad",
    "shots.s3": "Staff room",
    "shots.s4": "Settings",
    "shots.s1.alt":
      "Concept preview: dashboard with club record, budget and match feed.",
    "shots.s2.alt": "Concept preview: squad table with player detail panel.",
    "shots.s3.alt":
      "Concept preview: staff room with conversations and events.",
    "shots.s4.alt": "Concept preview: settings with AI keys and save sync.",

    "download.title": "Download",
    "download.sub":
      "A free Windows app. It reads files from your own game installation; it does not include any EA content.",
    "download.req1": "Windows 10 or 11",
    "download.req2": "FIFA 16 for PC with Career Mode",
    "download.ctaPrimary": "Download for Windows",
    "download.ctaPrimarySoon": "Coming soon",
    "download.note":
      "Windows may show a SmartScreen warning because the app is not code-signed yet.",
    "download.build": "Build from source",
    "download.disclaimer":
      "The app reads the files of your own FIFA 16 installation. It never modifies your saves or the game, and it includes no files from EA.",

    "faq.title": "Frequently asked questions",
    "faq.q1": "Does it modify my saves?",
    "faq.a1":
      "No. It is read-only and never writes to your save folder or the game folder.",
    "faq.q2": "Does it work with other FIFA games or EA FC?",
    "faq.a2": "Only FIFA 16 for PC for now.",
    "faq.q3": "Do I need an AI key?",
    "faq.a3":
      "No. AI is optional and arrives in Beta 0.3; the beta uses deterministic templates.",
    "faq.q4": "Where are my keys stored?",
    "faq.a4": "On your PC, in your system's secure storage.",
    "faq.q5": "Is there live match coverage?",
    "faq.a5":
      "No. The save only changes when the game saves, so the app updates after each save.",
    "faq.q6": "Does it include game files?",
    "faq.a6": "No. It includes no files from EA or FIFA.",
    "faq.q7": "Is it affiliated with EA?",
    "faq.a7": "No. It is an independent community project.",
    "faq.q8": "How do I report a bug or contribute?",
    "faq.a8": "Through GitHub issues and pull requests.",

    "footer.github": "GitHub",
    "footer.issues": "Issues",
    "footer.license": "MIT license",
    "footer.versionLabel": "Version",
    "footer.legal":
      "Career AI Tracker is an independent community project. It is not affiliated with, endorsed or sponsored by Electronic Arts or FIFA. FIFA and FIFA 16 are trademarks of their respective owners and are mentioned only to indicate compatibility."
  },

  es: {
    "meta.title":
      "Career AI Tracker - compañero para el Modo Carrera de FIFA 16",
    "meta.description":
      "Compañero de escritorio gratis y open source para el Modo Carrera de FIFA 16. Lee el guardado de tu carrera (solo lectura) y muestra resultados, récord del club, plantilla, noticias del juego y una sala de staff.",

    "nav.home": "Inicio",
    "nav.features": "Funciones",
    "nav.how": "Cómo funciona",
    "nav.screenshots": "Capturas",
    "nav.download": "Descargar",
    "nav.faq": "Preguntas",
    "nav.github": "GitHub",
    "nav.menu": "Abrir menú",

    "lang.label": "Idioma",
    "lang.en": "EN",
    "lang.es": "ES",

    "a11y.skip": "Saltar al contenido",
    "a11y.mainNav": "Navegaci\u00f3n principal",
    "a11y.footerNav": "Navegaci\u00f3n del pie",

    "hero.eyebrow": "Compañero con IA para el Modo Carrera de FIFA 16",
    "hero.titleA": "Sube de nivel tu",
    "hero.titleB": "Modo Carrera de FIFA\u00a016",
    "hero.sub":
      "Una app de escritorio que lee el guardado de tu carrera de FIFA 16 y lo convierte en resultados, récord del club, detalle de plantilla, noticias del juego y una sala de staff. Solo lectura: nunca escribe en tus guardados.",
    "hero.ctaPrimary": "Descargar para Windows",
    "hero.ctaPrimarySoon": "Próximamente",
    "hero.ctaSecondary": "Ver en GitHub",
    "hero.badge.free": "Gratis y open source (MIT)",
    "hero.badge.readonly": "Solo lectura: nunca toca tus guardados",
    "hero.badge.key": "Trae tu propia clave de IA",
    "hero.badge.windows": "Windows",
    "hero.status": "Beta en desarrollo",
    "hero.alt":
      "Vista conceptual del panel de Career AI Tracker para un club ficticio.",

    "features.title":
      "Todo lo que tu Modo Carrera necesita, en una sola ventana",
    "features.sub":
      "La app lee tu guardado y muestra lo que el juego ya registró, sin tocarlo.",
    "features.c1.title": "Panel al día con tu guardado",
    "features.c1.desc":
      "Cada vez que guardas, tu carrera se actualiza. Sin reloj en vivo ni suposiciones.",
    "features.c1.b1": "Resultados y minutos jugados después de cada guardado",
    "features.c1.b2": "récord del club y estadísticas del plantel",
    "features.c1.b3": "Noticias de tu propio juego: rumores y lesiones",
    "features.c2.title": "Sala de staff",
    "features.c2.desc":
      "Tu asistente técnico, ojeador de juveniles, presidente y encargado de prensa reaccionan a lo que pasa en tu carrera.",
    "features.c2.b1": "Mensajes por reglas en la beta",
    "features.c2.b2": "Con IA desde la Beta 0.3, con tu propia clave",
    "features.c3.title": "Eventos de club con consecuencias",
    "features.c3.desc":
      "Problemas disciplinarios, lesiones o presión de la directiva, donde tus decisiones importan.",
    "features.c3.b1":
      "La app puede comprobar tu guardado para ver si cumpliste una decisión",
    "features.c3.b2":
      "Por ejemplo, si dejaste a un jugador en el banco durante N partidos",

    "how.title": "Cómo funciona",
    "how.sub": "Tres pasos, sin cuenta y sin conexión en vivo.",
    "how.s1.title": "Juega y guarda",
    "how.s1.desc":
      "Sigue jugando tu modo carrera como siempre y guarda cuando lo haga el juego.",
    "how.s2.title": "La app lee tu guardado, solo lectura",
    "how.s2.desc":
      "Lee el guardado de tu carrera para encontrar resultados, minutos, récord, presupuesto, plantilla y noticias. No modifica nada.",
    "how.s3.title": "Tu staff y los eventos reaccionan",
    "how.s3.desc":
      "Tu sala de staff y los eventos de club se actualizan con lo que muestra el guardado. Reglas en la Beta 0.1; IA en la Beta 0.3.",

    "ai.eyebrow": "Trae tu propia clave de IA",
    "ai.title": "Usa tu propio proveedor de IA",
    "ai.sub":
      "Desde la Beta 0.3, conecta el proveedor de IA que prefieras con tu propia clave. Sin cuenta ni telemetría, y tus claves se quedan en tu PC.",
    "ai.role1": "Presidente",
    "ai.role2": "Asistente técnico",
    "ai.role3": "Ojeador",
    "ai.role4": "Encargado de prensa",
    "ai.badge": "Llega en la Beta 0.3",
    "ai.note":
      "En la Beta 0.1 la sala de staff usa plantillas deterministas: sin IA y sin red.",
    "ai.keyLabel": "Tu clave de API",
    "ai.providerNote": "Compatible con OpenAI: modelos locales y más",

    "roadmap.title": "Hoja de ruta",
    "roadmap.sub": "Tres betas, cada una agrega una capa.",
    "roadmap.p1.tag": "Beta 0.1",
    "roadmap.p1.title": "Panel, plantilla y sala de staff",
    "roadmap.p1.desc":
      "Mensajes por reglas y eventos de club. Sin IA y sin red.",
    "roadmap.p2.tag": "Beta 0.2",
    "roadmap.p2.title": "Lectura del guardado integrada",
    "roadmap.p2.desc":
      "Lectura automática del guardado integrada y un instalador para Windows.",
    "roadmap.p3.tag": "Beta 0.3",
    "roadmap.p3.title": "Staff y eventos con IA",
    "roadmap.p3.desc":
      "Staff y eventos de club con IA, usando tu propia clave.",
    "roadmap.current": "Actual",

    "shots.title": "Capturas",
    "shots.sub":
      "Vistas conceptuales hechas con un club y jugadores ficticios. Se reemplazarán por capturas reales.",
    "shots.tag": "Vista conceptual",
    "shots.s1": "Panel",
    "shots.s2": "Plantilla",
    "shots.s3": "Sala de staff",
    "shots.s4": "Ajustes",
    "shots.s1.alt":
      "Vista conceptual: panel con récord del club, presupuesto y feed de partidos.",
    "shots.s2.alt":
      "Vista conceptual: tabla de plantilla con panel de detalle del jugador.",
    "shots.s3.alt":
      "Vista conceptual: sala de staff con conversaciones y eventos.",
    "shots.s4.alt":
      "Vista conceptual: ajustes con claves de IA y sincronización del guardado.",

    "download.title": "Descargar",
    "download.sub":
      "Una app gratis para Windows. Lee archivos de tu propia instalación del juego; no incluye nada de EA.",
    "download.req1": "Windows 10 u 11",
    "download.req2": "FIFA 16 para PC con Modo Carrera",
    "download.ctaPrimary": "Descargar para Windows",
    "download.ctaPrimarySoon": "Próximamente",
    "download.note":
      "Windows puede mostrar una advertencia de SmartScreen porque la app todavía no está firmada digitalmente.",
    "download.build": "Compilar desde el codigo fuente",
    "download.disclaimer":
      "La app lee los archivos de tu propia instalación de FIFA 16. Nunca modifica tus guardados ni el juego, y no incluye archivos de EA.",

    "faq.title": "Preguntas frecuentes",
    "faq.q1": "¿Modifica mis guardados?",
    "faq.a1":
      "No. Es de solo lectura y nunca escribe en tu carpeta de guardados ni en la del juego.",
    "faq.q2": "¿Funciona con otros FIFA o con EA FC?",
    "faq.a2": "Solo FIFA 16 para PC por ahora.",
    "faq.q3": "¿Necesito una clave de IA?",
    "faq.a3":
      "No. La IA es opcional y llega en la Beta 0.3; la beta usa plantillas deterministas.",
    "faq.q4": "¿Dónde se guardan mis claves?",
    "faq.a4": "En tu PC, en el almacenamiento seguro del sistema.",
    "faq.q5": "¿Hay partido en vivo?",
    "faq.a5":
      "No. El guardado solo cambia cuando el juego guarda, así que la app se actualiza después de cada guardado.",
    "faq.q6": "¿Incluye archivos del juego?",
    "faq.a6": "No. No incluye archivos de EA ni de FIFA.",
    "faq.q7": "¿Está afiliada a EA?",
    "faq.a7": "No. Es un proyecto comunitario independiente.",
    "faq.q8": "Cómo reporto un error o contribuyo?",
    "faq.a8": "A través de los issues y pull requests de GitHub.",

    "footer.github": "GitHub",
    "footer.issues": "Issues",
    "footer.license": "Licencia MIT",
    "footer.versionLabel": "Versión",
    "footer.legal":
      "Career AI Tracker es un proyecto comunitario independiente. No está afiliado, respaldado ni patrocinado por Electronic Arts ni por FIFA. FIFA y FIFA 16 son marcas de sus respectivos dueños y se mencionan solo para indicar compatibilidad."
  }
};
