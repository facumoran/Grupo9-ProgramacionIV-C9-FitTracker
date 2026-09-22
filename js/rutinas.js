'use strict';
(() => {
    const A = window.FitApp;
    const { D, C, $, esc, formato, fechaLarga, datos, boton, vacio, titulo, avisar, guardar, actualizar, abrirDialogo, cerrarDialogo, rutinaPorId, completada } = A;

    let borrador = null;

    $('#rutinas .container').innerHTML = `${titulo('Rutinas', 'Armá tu plan y personalizá cada ejercicio.')}
        <div class="row g-4"><div class="col-12 col-lg-5"><div class="card p-4 h-100"><h3 class="h4">Biblioteca de rutinas</h3><p class="small text-body-secondary">Plantillas editables de ejemplo, no una prescripción personalizada.</p><div id="plantillas" class="d-grid gap-3"></div></div></div>
        <div class="col-12 col-lg-7"><div class="card p-4 h-100"><div class="d-flex justify-content-between align-items-center gap-2 mb-3"><h3 class="h4 mb-0">Mis rutinas</h3>${boton('+ Crear rutina', 'nueva-rutina', '', 'btn-primary')}</div><div id="mis-rutinas" class="d-grid gap-3"></div></div></div></div>
        <div id="sesion" class="mt-4"></div>`;

    function renderRutinas() {
        $('#plantillas').innerHTML = C.plantillas.map(t => `<div class="item-app py-3 d-flex flex-wrap align-items-center justify-content-between gap-3 border-bottom"><div><strong>${esc(t.nombre)}</strong><p class="small text-body-secondary mb-0">${t.ids.length} ejercicios</p></div>${boton('Personalizar', 'plantilla', t.id, 'btn-primary')}</div>`).join('');
        $('#mis-rutinas').innerHTML = datos.rutinas.length ? datos.rutinas.map(r => `<article class="rutina-app border rounded-3 p-3"><h4 class="h5">${esc(r.nombre)}</h4><p class="small text-body-secondary">${esc(r.descripcion || `${r.ejercicios.length} ejercicios`)}</p><ul class="small">${r.ejercicios.map(e => `<li>${esc(C.ejercicios.find(x => x.id === e.ejercicioId)?.nombre || e.ejercicioId)} · ${e.series} × ${e.reps}${C.ejercicios.find(x => x.id === e.ejercicioId)?.unidad === 'segundos' ? ' s' : ''} · ${formato(e.peso)} kg</li>`).join('')}</ul><div class="d-flex flex-wrap gap-2">${boton('Entrenar', 'entrenar', r.id, 'btn-primary')}${boton('Programar', 'programar', r.id)}${boton('Editar', 'editar-rutina', r.id)}${boton('Duplicar', 'duplicar-rutina', r.id)}${boton('Eliminar', 'eliminar-rutina', r.id, 'btn-outline-danger')}</div></article>`).join('') : vacio('No tenés rutinas todavía. Creá una o personalizá una de la biblioteca.');
    }

    function editar(rutina = null, ejercicioId = null) {
        borrador = rutina ? JSON.parse(JSON.stringify(rutina)) : { id: null, nombre: '', descripcion: '', ejercicios: [] };
        if (ejercicioId) borrador.ejercicios.push(itemNuevo(ejercicioId));
        renderEditor();
    }

    function itemNuevo(ejercicioId) {
        return { ejercicioId, series: 3, reps: C.ejercicios.find(e => e.id === ejercicioId)?.unidad === 'segundos' ? 30 : 10, peso: 0, descanso: 60 };
    }

    function leerEditor() {
        const f = $('#form-rutina');
        if (!f) return;
        borrador.nombre = f.elements.nombre.value;
        borrador.descripcion = f.elements.descripcion.value;
        borrador.ejercicios = [...f.querySelectorAll('[data-item]')].map(row => ({ ejercicioId: row.dataset.item,
            ...Object.fromEntries(['series', 'reps', 'peso', 'descanso'].map(k => [k, row.querySelector(`[name="${k}"]`).value])) }));
    }

    function renderEditor() {
        const contenido = `<form id="form-rutina"><label for="rutina-nombre" class="form-label">Nombre de la rutina</label><input id="rutina-nombre" name="nombre" class="form-control mb-3" value="${esc(borrador.nombre)}" required maxlength="60"><label for="rutina-descripcion" class="form-label">Descripción opcional</label><textarea id="rutina-descripcion" name="descripcion" class="form-control mb-3" maxlength="200">${esc(borrador.descripcion)}</textarea>
            <div class="mb-3"><label for="agregar-ejercicio" class="form-label">Agregar ejercicio</label><div class="d-flex gap-2"><select id="agregar-ejercicio" class="form-select">${C.ejercicios.map(e => `<option value="${e.id}">${esc(e.nombre)} · ${esc(e.grupo)}</option>`).join('')}</select>${boton('Agregar', 'editor-agregar', '', 'btn-primary')}</div></div>
            <div class="d-grid gap-3">${borrador.ejercicios.map((item, i) => {
                const e = C.ejercicios.find(x => x.id === item.ejercicioId);
                return `<fieldset class="editor-item border rounded-3 p-3" data-item="${item.ejercicioId}"><legend class="h5">${i + 1}. ${esc(e?.nombre || item.ejercicioId)}</legend><div class="row g-2">${[['series', 'Series', 1, 10, 1], ['reps', e?.unidad === 'segundos' ? 'Segundos' : 'Repeticiones', 1, 600, 1], ['peso', 'Peso (kg)', 0, 1000, 0.5], ['descanso', 'Descanso (s)', 0, 600, 1]].map(([k, label, min, max, step]) => `<div class="col-6 col-sm-3"><label for="${k}-${i}" class="small form-label">${label}</label><input id="${k}-${i}" name="${k}" class="form-control" type="number" min="${min}" max="${max}" step="${step}" value="${esc(item[k])}" required ${k === 'peso' && e?.unidad === 'segundos' ? 'readonly' : ''}></div>`).join('')}</div><div class="d-flex gap-2 mt-3">${boton('↑', 'editor-arriba', String(i))}${boton('↓', 'editor-abajo', String(i))}${boton('Quitar', 'editor-quitar', String(i), 'btn-outline-danger')}</div></fieldset>`;
            }).join('')}</div><p id="rutina-error" class="text-danger mt-3" role="alert"></p><button type="submit" class="btn btn-primary rounded-pill">Guardar rutina</button></form>`;
        if ($('#dialogo').open) $('#dialogo-contenido').innerHTML = contenido;
        else abrirDialogo(borrador.id ? 'Editar rutina' : 'Crear rutina', contenido);
    }

    A.rutinas = { editar }; 

    function manejarClick(accion, id) {
        switch (accion) {
            case 'nueva-rutina': {
                editar();
                break;
            }
            case 'editar-rutina': {
                editar(rutinaPorId(id));
                break;
            }
            case 'plantilla': {
                const plantilla = C.plantillas.find(t => t.id === id);
                editar({ id: null, nombre: plantilla.nombre, descripcion: 'Plantilla personalizable de ejemplo.', ejercicios: plantilla.ids.map(itemNuevo) });
                break;
            }
            case 'editor-agregar':
            case 'editor-quitar':
            case 'editor-arriba':
            case 'editor-abajo': {
                leerEditor();
                const n = Number(id);
    
                switch (accion) {
                    case 'editor-agregar': {
                        const elegido = $('#agregar-ejercicio').value;
                        if (borrador.ejercicios.some(e => e.ejercicioId === elegido)) {
                            $('#rutina-error').textContent = 'El ejercicio ya está en la rutina. Editá sus series.';
                            return;
                        }
                        borrador.ejercicios.push(itemNuevo(elegido));
                        break;
                    }
                    case 'editor-quitar':
                        borrador.ejercicios.splice(n, 1);
                        break;
                    case 'editor-arriba':
                    case 'editor-abajo': {
                        const destino = accion === 'editor-arriba' ? n - 1 : n + 1;
                        if (destino >= 0 && destino < borrador.ejercicios.length) {
                            [borrador.ejercicios[n], borrador.ejercicios[destino]] =
                                [borrador.ejercicios[destino], borrador.ejercicios[n]];
                        }
                        break;
                    }
                }
    
                renderEditor();
                break;
            }
            case 'duplicar-rutina': {
                const copia = JSON.parse(JSON.stringify(rutinaPorId(id)));
                copia.id = null; copia.nombre = `${copia.nombre.slice(0, 50)} · Copia`; editar(copia);
                break;
            }
            case 'eliminar-rutina': {
                if (datos.activa?.rutinaId === id) { avisar('No podés eliminar la rutina de una sesión en curso.', true); return; }
                if (!confirm('¿Eliminar esta rutina y su planificación? Las sesiones realizadas se conservarán.')) return;
                datos.rutinas = datos.rutinas.filter(r => r.id !== id);
                datos.agenda = datos.agenda.filter(a => a.rutinaId !== id);
                actualizar('Rutina eliminada.');
                break;
            }
        }
    }

    function manejarSubmit(form) {
        switch (form.id) {
            case 'form-rutina': {
                leerEditor();
                if (!borrador.nombre.trim() || !borrador.ejercicios.length) { $('#rutina-error').textContent = 'Ingresá un nombre y agregá al menos un ejercicio.'; return; }
                if (borrador.ejercicios.some(e => !D.numero(e.series, 1, 10, true) || !D.numero(e.reps, 1, 600, true) || !D.numero(e.peso, 0, 1000) || !D.numero(e.descanso, 0, 600, true))) { $('#rutina-error').textContent = 'Revisá los valores de cada ejercicio.'; return; }
                const rutina = { ...borrador, id: borrador.id || D.id(), nombre: borrador.nombre.trim(), descripcion: borrador.descripcion.trim(), ejercicios: borrador.ejercicios.map(e => ({ ejercicioId: e.ejercicioId, series: Number(e.series), reps: Number(e.reps), peso: Number(e.peso), descanso: Number(e.descanso) })) };
                datos.rutinas = [...datos.rutinas.filter(r => r.id !== rutina.id), rutina];
                cerrarDialogo(); actualizar('Rutina guardada.');
                break;
            }
        }
    }

    A.registrar({
        nombre: 'santiago',
        acciones: ["nueva-rutina","editar-rutina","plantilla","editor-agregar","editor-quitar","editor-arriba","editor-abajo","duplicar-rutina","eliminar-rutina"],
        manejarClick,
        vistas: { rutinas: renderRutinas },
        formularios: ['form-rutina'],
        manejarSubmit
    });
})();
