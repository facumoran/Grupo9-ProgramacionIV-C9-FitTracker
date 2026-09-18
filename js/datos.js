
'use strict';
window.FitDatos = (() => {
    const CLAVE = 'fit-tracker-v1';
    const nuevo = () => ({ version: 1, perfil: null, favoritos: [], rutinas: [], agenda: [], sesiones: [], activa: null });
    const id = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const fecha = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dia = texto => new Date(`${texto}T12:00:00`);
    const lunes = texto => {
        const d = dia(texto);
        d.setDate(d.getDate() - (d.getDay() + 6) % 7);
        return fecha(d);
    };
    const numero = (valor, min, max, entero = false) => {
        if ((typeof valor === 'string' && !valor.trim()) || valor == null || typeof valor === 'boolean') return false;
        const n = Number(valor);
        return Number.isFinite(n) && n >= min && n <= max && (!entero || Number.isInteger(n));
    };
    const volumen = sesion => sesion.ejercicios.reduce((total, e) => total + e.series.filter(s => s.hecha).reduce((suma, s) => suma + (e.unidad === 'segundos' ? 0 : s.peso * s.reps), 0), 0);
    function valido(s) {
        const lista = (v, comprobar) => Array.isArray(v) && v.every(comprobar);
        const texto = v => typeof v === 'string';
        const item = e => e && texto(e.ejercicioId) && numero(e.series, 1, 10, true) && numero(e.reps, 1, 600, true) && numero(e.peso, 0, 1000) && numero(e.descanso, 0, 600, true);
        const sesion = x => x && texto(x.id) && texto(x.fecha) && /^\d{4}-\d{2}-\d{2}$/.test(x.fecha) && texto(x.nombre) && texto(x.inicio) && lista(x.ejercicios, e => e && texto(e.nombre) && texto(e.ejercicioId) && ['segundos', 'repeticiones'].includes(e.unidad) && numero(e.descanso, 0, 600, true) && lista(e.series, v => v && typeof v.hecha === 'boolean' && numero(v.reps, 1, 600, true) && numero(v.peso, 0, 1000)));
        return s && s.version === 1 && (s.perfil === null || (s.perfil && texto(s.perfil.nombre) && numero(s.perfil.meta, 1, 7, true))) && lista(s.favoritos, texto) && lista(s.rutinas, r => r && texto(r.id) && texto(r.nombre) && texto(r.descripcion) && lista(r.ejercicios, item)) && lista(s.agenda, a => a && texto(a.id) && texto(a.fecha) && /^\d{4}-\d{2}-\d{2}$/.test(a.fecha) && texto(a.rutinaId)) && lista(s.sesiones, sesion) && (s.activa === null || sesion(s.activa));
    }
    function cargar(storage) {
        try {
            storage = storage || window.localStorage;
            const contenido = storage.getItem(CLAVE);
            if (!contenido) return { datos: nuevo(), error: null };
            const datos = JSON.parse(contenido);
            if (!valido(datos)) throw new Error('Formato inválido');
            return { datos, error: null };
        } catch {
            return { datos: nuevo(), error: 'No pudimos leer los datos guardados. No se sobrescribirán automáticamente. Podés descargar el contenido original desde Perfil o autorizar un nuevo guardado.' };
        }
    }
    function guardar(datos, storage) {
        try { (storage || window.localStorage).setItem(CLAVE, JSON.stringify(datos)); return true; } catch { return false; }
    }
    function iniciar(rutina, catalogo, fechaSesion, agendaId = null) {
        return {
            id: id(), rutinaId: rutina.id, agendaId, nombre: rutina.nombre, fecha: fechaSesion, inicio: new Date().toISOString(),
            ejercicios: rutina.ejercicios.map(e => {
                const info = catalogo.find(x => x.id === e.ejercicioId);
                return { ejercicioId: e.ejercicioId, nombre: info.nombre, unidad: info.unidad, descanso: e.descanso,
                    series: Array.from({ length: e.series }, () => ({ reps: e.reps, peso: e.peso, hecha: false })) };
            })
        };
    }
    function estadisticas(datos, hoy = fecha()) {
        const sesiones = datos.sesiones;
        const semana = lunes(hoy);
        const esteMes = sesiones.filter(s => s.fecha.slice(0, 7) === hoy.slice(0, 7));
        const semanas = new Set(sesiones.map(s => lunes(s.fecha)));
        let racha = 0;
        const cursor = dia(semana);
        if (!semanas.has(fecha(cursor))) cursor.setDate(cursor.getDate() - 7);
        while (semanas.has(fecha(cursor))) { racha++; cursor.setDate(cursor.getDate() - 7); }
        const records = {};
        sesiones.forEach(s => s.ejercicios.forEach(e => {
            e.series.filter(v => v.hecha && v.peso > 0 && e.unidad !== 'segundos').forEach(v => {
                if (!records[e.ejercicioId] || records[e.ejercicioId].peso < v.peso) records[e.ejercicioId] = { nombre: e.nombre, peso: v.peso };
            });
        }));
        return { total: sesiones.length, mes: esteMes.length, semana: sesiones.filter(s => lunes(s.fecha) === semana).length,
            volumen: sesiones.reduce((suma, s) => suma + volumen(s), 0), racha, records: Object.values(records) };
    }
    return { CLAVE, nuevo, id, fecha, dia, lunes, numero, volumen, cargar, guardar, iniciar, estadisticas, valido };
})();
