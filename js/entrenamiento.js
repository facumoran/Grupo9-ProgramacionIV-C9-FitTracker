'use strict';
(() => {
    const A = window.FitApp;
    const { D, C, $, esc, formato, fechaLarga, datos, boton, vacio, titulo, avisar, guardar, actualizar, abrirDialogo, cerrarDialogo, rutinaPorId, completada } = A;

    let seleccion = D.fecha();
    let mes = D.dia(seleccion);
    let temporizador = { restante: 60, duracion: 60, fin: null };

    $('#calendario .container').innerHTML = `${titulo('Calendario', 'Programá tus rutinas y registrá las sesiones realizadas.')}
        <div class="d-flex justify-content-center align-items-center gap-3 mb-4">${boton('←', 'mes-anterior')}<h3 id="nombre-mes" class="h4 mb-0" aria-live="polite"></h3>${boton('→', 'mes-siguiente')}${boton('Hoy', 'hoy')}</div>
        <div class="calendario-app mx-auto"><div class="calendario-header text-center fw-semibold text-primary mb-2"><span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span></div><div id="dias" class="calendario-grid"></div>
        <p class="small text-body-secondary mt-3">Naranja: programado · Verde: realizado · El borde claro indica el día seleccionado.</p><div id="agenda-dia" class="card p-3 mt-3"></div></div>`;

    function renderCalendario() {
        $('#nombre-mes').textContent = mes.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
        const inicio = new Date(mes.getFullYear(), mes.getMonth(), 1, 12);
        const offset = (inicio.getDay() + 6) % 7;
        const cantidad = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();
        let html = '<span aria-hidden="true"></span>'.repeat(offset);
        for (let n = 1; n <= cantidad; n++) {
            const f = D.fecha(new Date(mes.getFullYear(), mes.getMonth(), n, 12));
            const pendientes = datos.agenda.filter(a => a.fecha === f && !completada(a.id)).length;
            const hechas = datos.sesiones.filter(s => s.fecha === f).length;
            html += `<button type="button" class="dia-calendario d-flex flex-column align-items-center justify-content-start ${pendientes ? 'con-entreno' : ''} ${hechas ? 'dia-completado' : ''} ${f === D.fecha() ? 'dia-hoy' : ''} ${f === seleccion ? 'dia-seleccionado' : ''}" data-action="dia" data-id="${f}" aria-label="${fechaLarga(f)}: ${pendientes} pendientes, ${hechas} realizados" aria-pressed="${f === seleccion}"><span>${n}</span>${pendientes ? `<span class="badge text-bg-primary badge-dia">${pendientes} pend.</span>` : ''}${hechas ? `<span class="badge text-bg-success badge-dia">${hechas} ✓</span>` : ''}</button>`;
        }
        $('#dias').innerHTML = html;
        const agenda = datos.agenda.filter(a => a.fecha === seleccion);
        const sesiones = datos.sesiones.filter(s => s.fecha === seleccion);
        $('#agenda-dia').innerHTML = `<h3 class="h4">${fechaLarga(seleccion)}</h3><div class="d-grid gap-3">${agenda.map(a => `<div class="item-app d-flex flex-wrap align-items-center justify-content-between gap-3 border-bottom"><span>${esc(rutinaPorId(a.rutinaId)?.nombre || 'Rutina eliminada')} · ${completada(a.id) ? 'Realizado ✓' : 'Pendiente'}</span><div class="d-flex flex-wrap gap-2">${!completada(a.id) && a.fecha <= D.fecha() ? boton('Registrar', 'entrenar-agenda', a.id, 'btn-primary') : ''}${!completada(a.id) ? boton('Quitar', 'quitar-agenda', a.id, 'btn-outline-danger') : ''}</div></div>`).join('')}${sesiones.filter(s => !agenda.some(a => a.id === s.agendaId)).map(s => `<p class="mb-1">✓ ${esc(s.nombre)} · Sesión realizada</p>`).join('')}${!agenda.length && !sesiones.length ? vacio('No hay entrenamientos para este día.') : ''}</div><div class="mt-3">${boton('+ Programar rutina', 'programar')}</div>`;
    }

    function renderSesion() {
        const s = datos.activa;
        if (!s) { $('#sesion').innerHTML = ''; return; }
        $('#sesion').innerHTML = `<div class="card p-4 sesion-activa"><div class="d-flex flex-wrap justify-content-between gap-2"><h3 class="h3">Sesión · ${esc(s.nombre)}</h3><p class="text-body-secondary">${fechaLarga(s.fecha)} · Borrador guardado</p></div><p class="small text-body-secondary">Registrá lo que realmente hiciste y marcá las series completadas. Podés finalizar una sesión parcial; las series sin marcar no contarán.</p>
            ${s.ejercicios.map((e, i) => `<fieldset class="mb-4"><legend class="h5">${esc(e.nombre)}</legend><div class="table-responsive"><table class="table align-middle tabla-series"><thead><tr><th>Serie</th><th>${e.unidad === 'segundos' ? 'Segundos' : 'Repeticiones'}</th><th>Peso (kg)</th><th>Realizada</th></tr></thead><tbody>${e.series.map((v, j) => `<tr><td>${j + 1}</td><td><input type="number" class="form-control" min="1" max="600" step="1" value="${v.reps}" data-serie="${i}:${j}" data-field="reps" aria-label="${esc(e.nombre)}, serie ${j + 1}, ${e.unidad}" required></td><td><input type="number" class="form-control" min="0" max="1000" step="0.5" value="${v.peso}" data-serie="${i}:${j}" data-field="peso" aria-label="${esc(e.nombre)}, serie ${j + 1}, peso en kg" required ${e.unidad === 'segundos' ? 'disabled' : ''}></td><td><input class="form-check-input" type="checkbox" data-serie="${i}:${j}" data-field="hecha" aria-label="${esc(e.nombre)}, serie ${j + 1} realizada" ${v.hecha ? 'checked' : ''}></td></tr>`).join('')}</tbody></table></div>${boton(`Descanso ${e.descanso} s`, 'descanso', String(e.descanso))}</fieldset>`).join('')}
            <div class="temporizador-app d-flex flex-column align-items-center gap-2 border-top pt-4"><h4 class="h5">Temporizador de descanso</h4><label for="duracion" class="small">Duración en segundos</label><input id="duracion" class="form-control" type="number" min="1" max="600" step="1" value="${temporizador.duracion}"><output id="reloj" aria-label="Tiempo restante"></output><div class="d-flex flex-wrap gap-2">${boton('Iniciar / continuar', 'timer-iniciar')}${boton('Pausar', 'timer-pausar')}${boton('Reiniciar', 'timer-reset')}</div><p id="timer-estado" class="small mt-2 mb-0" role="status"></p></div>
            <div class="d-flex flex-wrap gap-2 mt-4">${boton('Finalizar y guardar sesión', 'finalizar', '', 'btn-primary')}${boton('Descartar sesión', 'descartar', '', 'btn-outline-danger')}</div></div>`;
        renderReloj();
    }

    function programar(rutinaId = '') {
        if (!datos.rutinas.length) { avisar('Primero creá una rutina para programar.', true); return; }
        abrirDialogo('Programar entrenamiento', `<form id="form-agenda"><label class="form-label" for="agenda-rutina">Rutina</label><select id="agenda-rutina" name="rutina" class="form-select mb-3" required>${datos.rutinas.map(r => `<option value="${r.id}" ${r.id === rutinaId ? 'selected' : ''}>${esc(r.nombre)}</option>`).join('')}</select><label class="form-label" for="agenda-fecha">Fecha</label><input id="agenda-fecha" name="fecha" type="date" class="form-control mb-3" value="${seleccion}" min="${D.fecha()}" required><button type="submit" class="btn btn-primary rounded-pill">Programar</button><p class="small text-body-secondary mt-3 mb-0">Los días anteriores se registran como sesiones realizadas, no como planes pendientes.</p></form>`);
    }

    function entrenar(rutinaId, agendaId = null) {
        if (datos.activa) { avisar('Tenés una sesión en curso. Finalizala o descartala antes de empezar otra.', true); $('#sesion').scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
        const rutina = rutinaPorId(rutinaId);
        if (!rutina || !rutina.ejercicios.length || rutina.ejercicios.some(e => !C.ejercicios.some(c => c.id === e.ejercicioId))) { avisar('Esta rutina no tiene ejercicios válidos. Editala primero.', true); return; }
        const cita = datos.agenda.find(a => a.id === agendaId);
        if (cita && (cita.fecha > D.fecha() || completada(cita.id))) return;
        const f = cita?.fecha || D.fecha();
        datos.activa = D.iniciar(rutina, C.ejercicios, f, agendaId);
        temporizador = { restante: 60, duracion: 60, fin: null };
        actualizar('Sesión iniciada. Registrá tus series.');
        $('#sesion').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function renderReloj() {
        if (!$('#reloj')) return;
        const restante = temporizador.fin ? Math.max(0, Math.ceil((temporizador.fin - Date.now()) / 1000)) : temporizador.restante;
        $('#reloj').textContent = `${String(Math.floor(restante / 60)).padStart(2, '0')}:${String(restante % 60).padStart(2, '0')}`;
        $('#timer-estado').textContent = temporizador.fin ? 'Descanso en curso' : restante === 0 ? 'Descanso terminado' : 'Temporizador pausado';
        if (temporizador.fin && restante === 0) { temporizador.fin = null; temporizador.restante = 0; avisar('Terminó el descanso.'); }
    }

    setInterval(renderReloj, 250); // El tiempo real depende de Date.now().

    function manejarClick(accion, id) {
        switch (accion) {
            case 'programar': {
                programar(id);
                break;
            }
            case 'dia': {
                seleccion = id; renderCalendario();
                break;
            }
            case 'hoy': {
                seleccion = D.fecha(); mes = D.dia(seleccion); renderCalendario();
                break;
            }
            case 'mes-anterior':
            case 'mes-siguiente': {
                mes = new Date(mes.getFullYear(), mes.getMonth() + (accion === 'mes-anterior' ? -1 : 1), 1, 12);
                renderCalendario();
                break;
            }
            case 'quitar-agenda': {
                if (datos.activa?.agendaId === id) { avisar('Hay una sesión en curso para este entrenamiento.', true); return; }
                if (!confirm('¿Quitar este entrenamiento programado?')) return;
                datos.agenda = datos.agenda.filter(a => a.id !== id); actualizar('Entrenamiento quitado.');
                break;
            }
            case 'entrenar': {
                entrenar(id);
                break;
            }
            case 'entrenar-agenda': {
                const cita = datos.agenda.find(a => a.id === id); entrenar(cita.rutinaId, id);
                break;
            }
            case 'finalizar': {
                const inputs = [...$('#sesion').querySelectorAll('input[type="number"]')];
                if (inputs.some(i => !i.reportValidity())) return;
                const hecha = datos.activa.ejercicios.some(e => e.series.some(s => s.hecha));
                if (!hecha) { avisar('Marcá al menos una serie realizada para guardar la sesión.', true); return; }
                if (datos.activa.ejercicios.some(e => e.series.some(s => !s.hecha)) && !confirm('Hay series sin completar. ¿Guardar solo las realizadas?')) return;
                datos.activa.fin = new Date().toISOString();
                datos.sesiones.push(datos.activa); datos.activa = null; temporizador.fin = null;
                actualizar('Sesión guardada. Tu calendario y progreso ya están actualizados.');
                break;
            }
            case 'descartar': {
                if (!confirm('¿Descartar la sesión en curso? Se perderán las series de este borrador.')) return;
                datos.activa = null; temporizador.fin = null; actualizar('Sesión descartada.');
                break;
            }
            case 'descanso': {
                const segundos = Number(id);
                temporizador = { duracion: segundos, restante: segundos, fin: segundos ? Date.now() + segundos * 1000 : null };
                $('#duracion').value = segundos || 1; renderReloj();
                break;
            }
            case 'timer-iniciar': {
                if (temporizador.fin) return;
                if (!temporizador.restante) temporizador.restante = temporizador.duracion;
                temporizador.fin = Date.now() + temporizador.restante * 1000; renderReloj();
                break;
            }
            case 'timer-pausar': {
                if (temporizador.fin) temporizador.restante = Math.max(0, Math.ceil((temporizador.fin - Date.now()) / 1000));
                temporizador.fin = null; renderReloj();
                break;
            }
            case 'timer-reset': {
                temporizador.restante = temporizador.duracion; temporizador.fin = null; renderReloj();
                break;
            }
        }
    }

    function manejarSubmit(form) {
        switch (form.id) {
            case 'form-agenda': {
                const f = form.elements.fecha.value;
                const rutinaId = form.elements.rutina.value;
                if (f < D.fecha() || !rutinaPorId(rutinaId)) { avisar('Elegí una fecha de hoy en adelante y una rutina válida.', true); return; }
                if (datos.agenda.some(a => a.fecha === f && a.rutinaId === rutinaId)) { avisar('Esta rutina ya está programada para ese día.', true); return; }
                datos.agenda.push({ id: D.id(), fecha: f, rutinaId }); seleccion = f; mes = D.dia(f);
                cerrarDialogo(); actualizar('Entrenamiento programado.');
                break;
            }
        }
    }

    document.addEventListener('change', event => {
        const input = event.target;
        if (input.matches('[data-serie]')) {
            const [i, j] = input.dataset.serie.split(':').map(Number);
            if (!datos.activa) return;
            const campo = input.dataset.field;
            if (campo !== 'hecha' && !input.reportValidity()) return;
            datos.activa.ejercicios[i].series[j][campo] = campo === 'hecha' ? input.checked : Number(input.value);
            guardar(); // No recreamos el formulario: conservamos el foco del usuario.
        }
        if (input.id === 'duracion' && input.reportValidity()) {
            temporizador.duracion = Number(input.value); temporizador.restante = Number(input.value); temporizador.fin = null; renderReloj();
        }
    });

    A.registrar({
        nombre: 'fabricio',
        acciones: ["programar","dia","hoy","mes-anterior","mes-siguiente","quitar-agenda","entrenar","entrenar-agenda","finalizar","descartar","descanso","timer-iniciar","timer-pausar","timer-reset"],
        manejarClick,
        vistas: { calendario: renderCalendario, sesion: renderSesion },
        formularios: ['form-agenda'],
        manejarSubmit
    });
})();