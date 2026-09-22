
'use strict';
(() => {
    const D = window.FitDatos;
    const C = window.FitCatalogo;
    const $ = selector => document.querySelector(selector);
    const esc = texto => String(texto ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const formato = n => Number(n).toLocaleString('es-AR', { maximumFractionDigits: 1 });
    const fechaLarga = f => D.dia(f).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
    const inicial = D.cargar();
    let datos = inicial.datos;
    let bloquearGuardado = Boolean(inicial.error);
    const boton = (texto, accion, id = '', clase = 'btn-outline-primary') => `<button type="button" class="btn ${clase} btn-sm rounded-pill" data-action="${accion}" data-id="${esc(id)}">${texto}</button>`;
    const vacio = texto => `<p class="estado-vacio text-body-secondary py-3 mb-0">${texto}</p>`;
    const titulo = (nombre, descripcion) => `<div class="text-center mb-4"><h2 class="section-title d-inline-block border-start border-5 border-primary ps-3 fs-2">${nombre}</h2><p class="lead text-body-secondary mt-2">${descripcion}</p></div>`;
    function avisar(texto, error = false) {
        const aviso = $('#aviso');
        aviso.textContent = texto;
        aviso.classList.toggle('aviso-error', error);
        aviso.hidden = false;
        const avisoDialogo = $('#dialogo-aviso');
        if ($('#dialogo').open) { avisoDialogo.textContent = texto; avisoDialogo.hidden = false; }
        clearTimeout(avisar.timeout);
        avisar.timeout = setTimeout(() => { aviso.hidden = true; avisoDialogo.hidden = true; }, 6000);
    }
    function guardar() {
        const ok = !bloquearGuardado && D.guardar(datos);
        $('#estado-guardado').textContent = ok ? 'Datos guardados en este navegador.' : 'Sin guardado persistente: los cambios podrían perderse al cerrar. Descargá una copia desde Perfil.';
        if (!ok) avisar(bloquearGuardado ? 'El guardado está bloqueado para proteger los datos anteriores. Revisá Perfil.' : 'El navegador no permitió guardar. Descargá una copia desde Perfil.', true);
        return ok;
    }
    function actualizar(texto) {
        const ok = guardar();
        renderizar();
        if (texto && ok) avisar(texto);
    }
    function abrirDialogo(tituloDialogo, contenido) {
        $('#dialogo-titulo').textContent = tituloDialogo;
        $('#dialogo-contenido').innerHTML = contenido;
        $('#dialogo-aviso').hidden = true;
        $('#dialogo').showModal();
        const foco = $('#dialogo-contenido').querySelector('input:not([type="hidden"]), select, button');
        foco?.focus();
    }
    function cerrarDialogo() { $('#dialogo').close(); }
    function rutinaPorId(id) { return datos.rutinas.find(r => r.id === id); }
    function completada(id) { return datos.sesiones.some(s => s.agendaId === id); }

    const acciones = new Map();
    const formularios = new Map();
    const vistas = new Map();
    const integrantes = new Set();
    function registrar(modulo) {
        if (integrantes.has(modulo.nombre)) throw new Error('Módulo duplicado: ' + modulo.nombre);
        integrantes.add(modulo.nombre);
        for (const accion of modulo.acciones) {
            if (acciones.has(accion)) throw new Error('Acción duplicada: ' + accion);
            acciones.set(accion, modulo.manejarClick);
        }
        for (const id of modulo.formularios || []) {
            if (formularios.has(id)) throw new Error('Formulario duplicado: ' + id);
            formularios.set(id, modulo.manejarSubmit);
        }
        for (const [nombre, render] of Object.entries(modulo.vistas)) {
            if (vistas.has(nombre)) throw new Error('Vista duplicada: ' + nombre);
            vistas.set(nombre, render);
        }
    }
    function renderizar() {
        for (const nombre of ['resumen', 'catalogo', 'rutinas', 'calendario', 'sesion', 'progreso']) vistas.get(nombre)?.();
    }
    const A = window.FitApp = { D, C, $, esc, formato, fechaLarga, datos, boton, vacio, titulo, avisar, guardar, actualizar, abrirDialogo, cerrarDialogo, rutinaPorId, completada, registrar };

    document.body.insertAdjacentHTML('beforeend', `
        <div id="aviso" role="status" class="aviso-app position-fixed bottom-0 start-50 translate-middle-x border border-primary rounded-3 shadow p-3 mb-3 text-white" hidden></div>
        <dialog class="p-3 p-sm-4 border border-primary rounded-4 bg-body-tertiary text-body" id="dialogo" aria-labelledby="dialogo-titulo">
            <div class="d-flex align-items-center justify-content-between gap-3 mb-4"><h2 id="dialogo-titulo" class="h3 mb-0"></h2><button type="button" class="btn btn-outline-primary btn-sm rounded-pill" data-action="cerrar" aria-label="Cerrar ventana">Cerrar ✕</button></div>
            <div id="dialogo-contenido"></div>
            <p id="dialogo-aviso" role="alert" class="text-warning mt-3" hidden></p>
        </dialog>`);
    $('.navbar-nav').insertAdjacentHTML('beforeend', '<li class="nav-item"><button type="button" class="nav-link py-2 mx-auto" data-action="perfil">Perfil local</button></li>');
    $('.navbar-nav').addEventListener('click', event => {
        if (!event.target.closest('a, button')) return;
        const menu = $('#navPrincipal');
        if (window.bootstrap?.Collapse) window.bootstrap.Collapse.getOrCreateInstance(menu, { toggle: false }).hide();
        else { menu.classList.remove('show'); $('.navbar-toggler').setAttribute('aria-expanded', 'false'); }
    });
    $('.navbar-toggler').addEventListener('click', () => {
        if (window.bootstrap?.Collapse) return;
        const abierto = $('#navPrincipal').classList.toggle('show');
        $('.navbar-toggler').setAttribute('aria-expanded', String(abierto));
    });
    $('.hero-descripcion').insertAdjacentHTML('afterend', '<p id="saludo" class="text-primary fw-semibold"></p>');
    $('footer').insertAdjacentHTML('beforeend', '<p id="estado-guardado" class="small text-body-secondary mt-2 mb-0">Los datos se guardan solo en este navegador, sin sincronización ni autenticación.</p>');
    $('#progreso .container').innerHTML = `${titulo('Progreso', 'Tu evolución a partir de sesiones realmente completadas.')}
        <div id="metricas" class="row g-3 mb-4"></div><div class="row g-4"><div class="col-12 col-lg-7"><div class="card p-4 h-100"><h3 class="h4">Volumen de las últimas 4 semanas</h3><p class="small text-body-secondary">Suma de carga registrada × repeticiones. No incluye ejercicios por tiempo ni estima el peso corporal.</p><div id="grafico"></div></div></div><div class="col-12 col-lg-5"><div class="card p-4 h-100"><h3 class="h4">Récords de carga</h3><div id="records"></div></div></div></div>
        <div class="card p-4 mt-4"><h3 class="h4">Historial de entrenamientos</h3><div id="historial" class="d-grid gap-3"></div></div>`;

    function renderResumen() {
        const stats = D.estadisticas(datos);
        const proxima = datos.agenda.filter(a => a.fecha >= D.fecha() && !completada(a.id)).sort((a, b) => a.fecha.localeCompare(b.fecha))[0];
        const ultima = [...datos.sesiones].sort((a, b) => b.fecha.localeCompare(a.fecha) || b.inicio.localeCompare(a.inicio))[0];
        const resumen = [
            ['Próximo entrenamiento', proxima ? `${fechaLarga(proxima.fecha)} · ${rutinaPorId(proxima.rutinaId)?.nombre || 'Rutina eliminada'}` : 'Sin entrenamientos programados', 'calendar-event'],
            ['Entrenamiento más reciente', ultima ? `${ultima.nombre} · ${fechaLarga(ultima.fecha)}` : 'Todavía no registraste sesiones', 'clock-history'],
            ['Racha de actividad', `${stats.racha} ${stats.racha === 1 ? 'semana' : 'semanas'} con al menos una sesión`, 'fire'],
            ['Resumen de actividad', `${stats.mes} sesiones este mes · ${stats.semana}/${datos.perfil?.meta || 3} esta semana`, 'graph-up-arrow']
        ];
        $('#resumen .container').innerHTML = `${titulo('Resumen', 'Tu entrenamiento, de un vistazo.')}<div class="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">${resumen.map(([nombre, valor, icono]) => `<div class="col"><div class="card h-100 text-center card-resaltada border border-primary border-opacity-50 p-3"><i class="bi bi-${icono} display-6 text-primary" aria-hidden="true"></i><h3 class="h6 text-body-secondary mt-3">${nombre}</h3><p class="fw-semibold mb-0">${esc(valor)}</p></div></div>`).join('')}</div>`;
        $('#saludo').textContent = datos.perfil ? `Hola, ${datos.perfil.nombre}. Tu meta es de ${datos.perfil.meta} sesiones por semana.` : 'Tu plan, a tu ritmo. Configurá tu nombre y tu meta desde Perfil local.';
    }

    function renderProgreso() {
        const stats = D.estadisticas(datos);
        $('#metricas').innerHTML = [['Sesiones realizadas', stats.total], ['Volumen acumulado', `${formato(stats.volumen)} kg`], ['Sesiones esta semana', `${stats.semana} / ${datos.perfil?.meta || 3}`]].map(([n, v]) => `<div class="col-12 col-md-4"><div class="card card-resaltada border border-primary border-opacity-50 text-center p-4"><h3 class="h5">${n}</h3><p class="fs-4 text-primary fw-semibold mb-0">${v}</p></div></div>`).join('');
        const semanas = Array.from({ length: 4 }, (_, i) => {
            const f = D.dia(D.lunes(D.fecha()));
            f.setDate(f.getDate() - (3 - i) * 7);
            const clave = D.fecha(f);
            return { fecha: clave, volumen: datos.sesiones.filter(s => D.lunes(s.fecha) === clave).reduce((n, s) => n + D.volumen(s), 0) };
        });
        const maximo = Math.max(...semanas.map(s => s.volumen), 1);
        $('#grafico').innerHTML = semanas.map(s => `<div class="mb-3"><div class="d-flex justify-content-between small mb-1"><span>Desde ${fechaLarga(s.fecha)}</span><strong>${formato(s.volumen)} kg</strong></div><div class="progress" role="progressbar" aria-label="Volumen semanal desde ${fechaLarga(s.fecha)}" aria-valuenow="${s.volumen}" aria-valuemin="0" aria-valuemax="${maximo}"><div class="progress-bar" style="width:${s.volumen / maximo * 100}%"></div></div></div>`).join('');
        $('#records').innerHTML = stats.records.length ? `<ul class="list-group list-group-flush">${stats.records.map(r => `<li class="list-group-item bg-transparent d-flex justify-content-between gap-2"><span>${esc(r.nombre)}</span><strong>${formato(r.peso)} kg</strong></li>`).join('')}</ul>` : vacio('Registrá series con carga para ver tus récords.');
        $('#historial').innerHTML = datos.sesiones.length ? [...datos.sesiones].sort((a, b) => b.fecha.localeCompare(a.fecha)).map(s => `<div class="item-app py-3 d-flex flex-wrap align-items-center justify-content-between gap-3 border-bottom"><div><strong>${esc(s.nombre)}</strong><p class="small text-body-secondary mb-0">${fechaLarga(s.fecha)} · ${s.ejercicios.reduce((n, e) => n + e.series.filter(v => v.hecha).length, 0)} series · ${formato(D.volumen(s))} kg de volumen</p></div><div class="d-flex flex-wrap gap-2">${boton('Detalle', 'detalle-sesion', s.id)}${boton('Eliminar', 'eliminar-sesion', s.id, 'btn-outline-danger')}</div></div>`).join('') : vacio('Todavía no registraste entrenamientos. Iniciá una sesión desde Mis rutinas.');
    }

    function perfil() {
        abrirDialogo('Perfil local', `<p class="small text-body-secondary">No es un login real: no usamos contraseñas ni protegemos los datos con una cuenta. El perfil y tus registros quedan en este navegador.</p><form id="form-perfil"><label for="perfil-nombre" class="form-label">Tu nombre</label><input id="perfil-nombre" name="nombre" class="form-control mb-3" value="${esc(datos.perfil?.nombre || '')}" maxlength="50" required><label for="perfil-meta" class="form-label">Meta de sesiones semanales</label><input id="perfil-meta" name="meta" class="form-control mb-3" type="number" min="1" max="7" step="1" value="${datos.perfil?.meta || 3}" required><button class="btn btn-primary rounded-pill" type="submit">Guardar perfil</button></form><hr><div class="d-flex flex-wrap gap-2">${boton('Descargar mis datos', 'exportar')}${datos.perfil ? boton('Quitar perfil', 'quitar-perfil', '', 'btn-outline-danger') : ''}${bloquearGuardado ? boton('Descargar datos originales', 'exportar-original') + boton('Autorizar nuevo guardado', 'desbloquear', '', 'btn-outline-danger') : ''}</div>`);
    }

    function descargar(texto, nombre) {
        const url = URL.createObjectURL(new Blob([texto], { type: 'application/json' }));
        const a = document.createElement('a');
        a.href = url; a.download = nombre; a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function manejarClick(accion, id) {
        switch (accion) {
            case 'cerrar': {
                cerrarDialogo();
                break;
            }
            case 'perfil': {
                perfil();
                break;
            }
            case 'detalle-sesion': {
                const s = datos.sesiones.find(s => s.id === id);
                abrirDialogo(s.nombre, `<p>${fechaLarga(s.fecha)}</p>${s.ejercicios.map(e => `<h3 class="h5">${esc(e.nombre)}</h3><ul>${e.series.filter(v => v.hecha).map(v => `<li>${v.reps} ${e.unidad === 'segundos' ? 'segundos' : 'repeticiones'}${e.unidad === 'segundos' ? '' : ` · ${formato(v.peso)} kg`}</li>`).join('') || '<li>Sin series realizadas</li>'}</ul>`).join('')}`);
                break;
            }
            case 'eliminar-sesion': {
                if (!confirm('¿Eliminar este registro? Se recalcularán tus métricas y récords.')) return;
                datos.sesiones = datos.sesiones.filter(s => s.id !== id); actualizar('Registro eliminado.');
                break;
            }
            case 'exportar': {
                descargar(JSON.stringify(datos, null, 2), `fit-tracker-${D.fecha()}.json`);
                break;
            }
            case 'exportar-original': {
                try { descargar(localStorage.getItem(D.CLAVE) || '{}', 'fit-tracker-original.json'); } catch { avisar('No podemos acceder al almacenamiento del navegador.', true); }
                break;
            }
            case 'desbloquear': {
                if (!confirm('¿Autorizar el reemplazo de los datos anteriores? Descargá primero una copia de los originales.')) return;
                bloquearGuardado = false; actualizar('Nuevo guardado autorizado.'); perfil();
                break;
            }
            case 'quitar-perfil': {
                if (!confirm('¿Quitar el nombre y la meta del perfil? Tus rutinas y sesiones se conservarán.')) return;
                datos.perfil = null; cerrarDialogo(); actualizar('Perfil quitado.');
                break;
            }
        }
    }

    function manejarSubmit(form) {
        switch (form.id) {
            case 'form-perfil': {
                const nombre = form.elements.nombre.value.trim();
                const meta = Number(form.elements.meta.value);
                if (!nombre || !D.numero(meta, 1, 7, true)) { avisar('Ingresá un nombre y una meta de 1 a 7 sesiones.', true); return; }
                datos.perfil = { nombre, meta }; cerrarDialogo(); actualizar('Perfil actualizado.');
                break;
            }
        }
    }

    A.registrar({
        nombre: 'facundo',
        acciones: ["cerrar","perfil","detalle-sesion","eliminar-sesion","exportar","exportar-original","desbloquear","quitar-perfil"],
        manejarClick,
        vistas: { resumen: renderResumen, progreso: renderProgreso },
        formularios: ['form-perfil'],
        manejarSubmit
    });

    // Un solo listener delegado. Los demás registran sus acciones en SU archivo.
    document.addEventListener('click', event => {
        const target = event.target.closest('[data-action]');
        if (!target) return;
        const accion = target.dataset.action;
        acciones.get(accion)?.(accion, target.dataset.id);
    });
    document.addEventListener('submit', event => {
        const form = event.target;
        if (form.id === 'filtros') { event.preventDefault(); return; }
        const manejar = formularios.get(form.id);
        if (!manejar) return;
        event.preventDefault();
        manejar(form);
    });
    document.addEventListener('DOMContentLoaded', () => {
        if (integrantes.size !== 4) { avisar('Faltan partes del TP4. Reuní los archivos de los cuatro integrantes para usar la versión completa.', true); return; }
        renderizar();
        if (inicial.error) avisar(inicial.error, true);
    }, { once: true });
})();
