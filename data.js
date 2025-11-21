// Datos de logros
const achievementsData = [
    {
        id: 1,
        titulo: "Protector del Ahorro",
        descripcion: "Por no gastar en compras innecesarias.",
        icono: "fas fa-shield-alt",
        estado: "Desbloqueado",
        puntos: 100,
        categoria: "Consumo Responsable",
        requisitos: "Evitar compras impulsivas por 7 días consecutivos"
    },
    {
        id: 2,
        titulo: "Primer Paso",
        descripcion: "Por lograr el primer objetivo de ahorro.",
        icono: "fas fa-flag",
        estado: "Desbloqueado",
        puntos: 50,
        categoria: "Ahorro",
        requisitos: "Completar tu primera meta de ahorro"
    },
    {
        id: 3,
        titulo: "Ahorrista Estrella",
        descripcion: "Por cumplir metas semanales de ahorro.",
        icono: "fas fa-star",
        estado: "Desbloqueado",
        puntos: 150,
        categoria: "Ahorro",
        requisitos: "Cumplir 4 metas semanales consecutivas"
    },
    {
        id: 4,
        titulo: "Cazador de Gastos",
        descripcion: "Por identificar y eliminar gastos hormiga.",
        icono: "fas fa-binoculars",
        estado: "En progreso",
        puntos: 200,
        categoria: "Control de Gastos",
        requisitos: "Identificar y eliminar 5 gastos hormiga"
    },
    {
        id: 5,
        titulo: "Salud Financiera",
        descripcion: "Por mantener un ahorro constante durante un mes.",
        icono: "fas fa-heartbeat",
        estado: "En progreso",
        puntos: 300,
        categoria: "Ahorro",
        requisitos: "Ahorrar consistentemente por 30 días"
    },
    {
        id: 6,
        titulo: "Maestro del Ahorro",
        descripcion: "Por alcanzar la meta principal de ahorro.",
        icono: "fas fa-graduation-cap",
        estado: "Bloqueado",
        puntos: 500,
        categoria: "Ahorro",
        requisitos: "Alcanzar tu meta principal de ahorro"
    },
    {
        id: 7,
        titulo: "Planificador Financiero",
        descripcion: "Por crear y seguir un presupuesto mensual.",
        icono: "fas fa-chart-pie",
        estado: "Bloqueado",
        puntos: 150,
        categoria: "Presupuesto",
        requisitos: "Crear y seguir un presupuesto por 2 meses"
    },
    {
        id: 8,
        titulo: "Inversor Novato",
        descripcion: "Por realizar tu primera inversión.",
        icono: "fas fa-chart-line",
        estado: "Bloqueado",
        puntos: 250,
        categoria: "Inversión",
        requisitos: "Realizar tu primera inversión"
    },
    {
        id: 9,
        titulo: "Libre de Deudas",
        descripcion: "Por eliminar todas tus deudas de alto interés.",
        icono: "fas fa-money-bill-wave",
        estado: "Bloqueado",
        puntos: 400,
        categoria: "Deudas",
        requisitos: "Eliminar todas las deudas con interés mayor al 10%"
    },
    {
        id: 10,
        titulo: "Ahorro Colectivo",
        descripcion: "Por invitar a 3 amigos a usar la app.",
        icono: "fas fa-users",
        estado: "Bloqueado",
        puntos: 100,
        categoria: "Social",
        requisitos: "Invitar a 3 amigos que se registren en la app"
    }
];

// Datos de beneficios
const benefitsData = [
    {
        id: 1,
        titulo: "Café Gratis",
        descripcion: "Disfruta de un café gratis en Starbucks con esta recompensa.",
        puntos: 500,
        icono: "fas fa-coffee",
        disponibilidad: "1 por mes",
        terminos: "Válido solo en tiendas participantes. No acumulable con otras promociones."
    },
    {
        id: 2,
        titulo: "Gift Card Amazon",
        descripcion: "Obtén una gift card de $10 para usar en Amazon.",
        puntos: 1000,
        icono: "fas fa-shopping-bag",
        disponibilidad: "Ilimitado",
        terminos: "El código se enviará por correo electrónico en un plazo de 24 horas."
    },
    {
        id: 3,
        titulo: "Entrada de Cine",
        descripcion: "Canjea puntos por una entrada gratis al cine.",
        puntos: 800,
        icono: "fas fa-film",
        disponibilidad: "2 por mes",
        terminos: "Válido para cualquier película en cartelera. No incluye combos."
    },
    {
        id: 4,
        titulo: "Descuento en Libros",
        descripcion: "Obtén un 20% de descuento en tu próxima compra de libros.",
        puntos: 300,
        icono: "fas fa-book",
        disponibilidad: "Ilimitado",
        terminos: "Válido en librerías asociadas. Presentar código en caja."
    },
    {
        id: 5,
        titulo: "Suscripción a Spotify",
        descripcion: "Un mes gratis de Spotify Premium.",
        puntos: 1200,
        icono: "fas fa-music",
        disponibilidad: "1 por usuario",
        terminos: "Solo para nuevos usuarios de Spotify Premium."
    },
    {
        id: 6,
        titulo: "Curso de Finanzas",
        descripcion: "Acceso a un curso online de educación financiera.",
        puntos: 1500,
        icono: "fas fa-graduation-cap",
        disponibilidad: "Ilimitado",
        terminos: "Acceso de por vida al curso seleccionado."
    }
];

// Datos de amigos
const friendsData = [
    {
        id: 1,
        nombre: "Carlos",
        meta: 1000,
        progreso: 800
    },
    {
        id: 2,
        nombre: "María",
        meta: 800,
        progreso: 360
    },
    {
        id: 3,
        nombre: "Luis",
        meta: 1500,
        progreso: 1050
    }
];

// Datos de retos
const challengesData = [
    {
        id: 1,
        titulo: "Cazador de Gastos Hormiga",
        descripcion: "Identifica y elimina 5 gastos hormiga esta semana.",
        icono: "fas fa-search-dollar",
        tipo: "semanal",
        estado: "activo",
        progreso: 3,
        total: 5,
        puntos: 150,
        fechaInicio: "2023-06-01",
        fechaLimite: "2023-06-07",
        dificultad: "media",
        categoria: "Control de Gastos",
        detalles: "Los gastos hormiga son esos pequeños gastos diarios que suman mucho al final del mes. Identifica al menos 5 y elimínalos."
    },
    {
        id: 2,
        titulo: "Ahorro Express",
        descripcion: "Ahorra $20 en 24 horas.",
        icono: "fas fa-bolt",
        tipo: "diario",
        estado: "disponible",
        progreso: 0,
        total: 20,
        puntos: 50,
        fechaInicio: "",
        fechaLimite: "",
        dificultad: "baja",
        categoria: "Ahorro Rápido",
        detalles: "Encuentra la manera de ahorrar $20 en un día. Puede ser evitando una compra innecesaria o encontrando una alternativa más económica."
    },
    {
        id: 3,
        titulo: "Meta Mensual",
        descripcion: "Cumple tu meta de ahorro mensual.",
        icono: "fas fa-bullseye",
        tipo: "mensual",
        estado: "activo",
        progreso: 65,
        total: 100,
        puntos: 200,
        fechaInicio: "2023-06-01",
        fechaLimite: "2023-06-30",
        dificultad: "alta",
        categoria: "Ahorro",
        detalles: "Sigue tu plan de ahorro y alcanza tu meta mensual. Revisa tu progreso regularmente para mantenerte en el camino correcto."
    },
    {
        id: 4,
        titulo: "7 Días de Ahorro",
        descripcion: "Ahorra algo de dinero durante 7 días consecutivos.",
        icono: "fas fa-calendar-day",
        tipo: "semanal",
        estado: "completado",
        progreso: 7,
        total: 7,
        puntos: 100,
        fechaInicio: "2023-05-25",
        fechaLimite: "2023-05-31",
        dificultad: "media",
        categoria: "Constancia",
        detalles: "El ahorro consistente es clave para el éxito financiero. Ahorra aunque sea una pequeña cantidad cada día durante una semana."
    },
    {
        id: 5,
        titulo: "Presupuesto Perfecto",
        descripcion: "Crea y sigue un presupuesto por 2 semanas.",
        icono: "fas fa-chart-pie",
        tipo: "semanal",
        estado: "activo",
        progreso: 5,
        total: 14,
        puntos: 180,
        fechaInicio: "2023-06-01",
        fechaLimite: "2023-06-14",
        dificultad: "media",
        categoria: "Presupuesto",
        detalles: "Un presupuesto bien planificado es la base de unas finanzas saludables. Crea tu presupuesto y síguelo durante dos semanas completas."
    },
    {
        id: 6,
        titulo: "Reto del Almuerzo",
        descripcion: "Prepara tu almuerzo en casa 4 días esta semana.",
        icono: "fas fa-utensils",
        tipo: "semanal",
        estado: "disponible",
        progreso: 0,
        total: 4,
        puntos: 120,
        fechaInicio: "",
        fechaLimite: "",
        dificultad: "baja",
        categoria: "Alimentación",
        detalles: "Preparar tu almuerzo en casa puede ahorrarte mucho dinero. Intenta hacerlo al menos 4 días esta semana."
    },
    {
        id: 7,
        titulo: "Transporte Económico",
        descripcion: "Usa transporte público o comparte viaje 3 veces esta semana.",
        icono: "fas fa-bus",
        tipo: "semanal",
        estado: "activo",
        progreso: 1,
        total: 3,
        puntos: 80,
        fechaInicio: "2023-06-01",
        fechaLimite: "2023-06-07",
        dificultad: "baja",
        categoria: "Transporte",
        detalles: "El transporte alternativo puede ahorrarte dinero en gasolina y mantenimiento del vehículo."
    },
    {
        id: 8,
        titulo: "Sin Compras Impulsivas",
        descripcion: "Evita las compras impulsivas por 10 días consecutivos.",
        icono: "fas fa-shopping-cart",
        tipo: "mensual",
        estado: "activo",
        progreso: 4,
        total: 10,
        puntos: 150,
        fechaInicio: "2023-06-01",
        fechaLimite: "2023-06-30",
        dificultad: "alta",
        categoria: "Autocontrol",
        detalles: "Las compras impulsivas pueden arruinar tu presupuesto. Mantén el control y evita estas compras durante 10 días seguidos."
    },
    {
        id: 9,
        titulo: "Revisión de Suscripciones",
        descripcion: "Revisa y cancela al menos 2 suscripciones innecesarias.",
        icono: "fas fa-file-invoice-dollar",
        tipo: "mensual",
        estado: "disponible",
        progreso: 0,
        total: 2,
        puntos: 100,
        fechaInicio: "",
        fechaLimite: "",
        dificultad: "media",
        categoria: "Gastos Fijos",
        detalles: "Muchas veces pagamos por servicios que no usamos. Revisa tus suscripciones y cancela las que no sean esenciales."
    },
    {
        id: 10,
        titulo: "Ahorro por Objetivo",
        descripcion: "Establece y alcanza un objetivo de ahorro específico.",
        icono: "fas fa-flag-checkered",
        tipo: "mensual",
        estado: "activo",
        progreso: 40,
        total: 100,
        puntos: 250,
        fechaInicio: "2023-06-01",
        fechaLimite: "2023-06-30",
        dificultad: "alta",
        categoria: "Planificación",
        detalles: "Establece un objetivo claro de ahorro y trabaja consistentemente para alcanzarlo antes de fin de mes."
    }
];