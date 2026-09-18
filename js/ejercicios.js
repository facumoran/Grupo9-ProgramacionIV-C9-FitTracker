'use strict';
(() => {
    const A = window.FitApp;
    const { D, C, $, esc, formato, fechaLarga, datos, boton, vacio, titulo, avisar, guardar, actualizar, abrirDialogo, cerrarDialogo, rutinaPorId, completada } = A;

    let filtros = { texto: '', grupo: '', equipo: '', favoritos: false };
    const limiteCatalogo = 8;
    let catalogoExpandido = false;

    $('#ejercicios .container').innerHTML = `${titulo('Ejercicios', 'Buscá, descubrí y elegí ejercicios para tus rutinas.')}
        <form id="filtros" class="row g-3 mb-4" role="search">
            <div class="col-12 col-md-4"><label for="buscar" class="form-label">Buscar ejercicio</label><input id="buscar" name="texto" type="search" class="form-control" placeholder="Ej. press, remo, sentadilla" maxlength="100"></div>
            <div class="col-6 col-md-3"><label for="grupo" class="form-label">Grupo muscular</label><select id="grupo" name="grupo" class="form-select"><option value="">Todos</option>${C.grupos.map(g => `<option>${esc(g)}</option>`).join('')}</select></div>
            <div class="col-6 col-md-3"><label for="equipo" class="form-label">Equipamiento</label><select id="equipo" name="equipo" class="form-select"><option value="">Todos</option>${[...new Set(C.ejercicios.map(e => e.equipo))].map(e => `<option>${esc(e)}</option>`).join('')}</select></div>
            <div class="col-12 col-md-2 d-flex align-items-end"><label class="form-check mb-2"><input name="favoritos" type="checkbox" class="form-check-input"> Solo favoritos</label></div>
        </form><p id="conteo-ejercicios" class="small text-body-secondary" aria-live="polite"></p><div id="catalogo" class="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4"></div>
        <div class="text-center mt-4"><button id="alternar-catalogo" type="button" class="btn btn-outline-primary rounded-pill" data-action="alternar-catalogo" aria-controls="catalogo" aria-expanded="false" hidden>Ver todos</button></div>`;

    function renderCatalogo() {
        const normal = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        const encontrados = C.ejercicios.filter(e => normal(e.nombre).includes(normal(filtros.texto)) && (!filtros.grupo || e.grupo === filtros.grupo) && (!filtros.equipo || e.equipo === filtros.equipo) && (!filtros.favoritos || datos.favoritos.includes(e.id)));
        const visibles = catalogoExpandido ? encontrados : encontrados.slice(0, limiteCatalogo);
        $('#conteo-ejercicios').textContent = `Mostrando ${visibles.length} de ${encontrados.length} ejercicios encontrados · ${C.ejercicios.length} en el catálogo`;
        const desplegar = $('#alternar-catalogo');
        desplegar.hidden = encontrados.length <= limiteCatalogo;
        desplegar.setAttribute('aria-expanded', String(catalogoExpandido));
        desplegar.textContent = catalogoExpandido ? 'Ver menos ↑' : `Ver todos (${encontrados.length}) ↓`;
        $('#catalogo').innerHTML = visibles.length ? visibles.map(e => `<div class="col"><article class="card h-100 card-resaltada">
            ${e.imagen ? `<img src="${e.imagen}" class="card-img-top imagen-ejercicio p-3 object-fit-contain" alt="Ilustración de ${esc(e.nombre)}" loading="lazy" width="320" height="230">` : `<div class="ejercicio-sin-imagen d-flex flex-column justify-content-center align-items-center" aria-hidden="true"><span class="grupo-ilustracion">${esc(e.grupo)}</span><span class="small">Ilustración pendiente</span></div>`}
            <div class="card-body d-flex flex-column"><div class="d-flex justify-content-between gap-2"><h3 class="h5">${esc(e.nombre)}</h3><button type="button" class="favorito" data-action="favorito" data-id="${e.id}" aria-label="Favorito: ${esc(e.nombre)}" aria-pressed="${datos.favoritos.includes(e.id)}">${datos.favoritos.includes(e.id) ? '★' : '☆'}</button></div>
            <p><span class="badge text-bg-primary">${esc(e.grupo)}</span> <span class="badge text-bg-secondary">${esc(e.equipo)}</span></p><p class="small text-body-secondary">${esc(e.descripcion)}</p><div class="d-flex flex-wrap gap-2 mt-auto">${boton('Ver detalle', 'detalle', e.id)}${boton('+ A rutina', 'agregar-catalogo', e.id, 'btn-primary')}</div></div></article></div>`).join('') : `<div class="col-12">${vacio('No hay resultados. Probá otro nombre o cambiá los filtros.')}</div>`;
    }

    function manejarClick(accion, id) {
        switch (accion) {
            case 'alternar-catalogo': {
                catalogoExpandido = !catalogoExpandido;
                renderCatalogo();
                if (!catalogoExpandido) $('#ejercicios').scrollIntoView({ block: 'start' });
                break;
            }
            case 'agregar-catalogo': {
                abrirDialogo('Agregar a una rutina', `<p>Elegí una rutina para agregar <strong>${esc(C.ejercicios.find(e => e.id === id).nombre)}</strong>, o creá una nueva.</p><div class="d-grid gap-3">${datos.rutinas.map(r => boton(esc(r.nombre), 'agregar-existente', `${r.id}|${id}`)).join('')}${boton('+ Nueva rutina', 'agregar-nueva', id, 'btn-primary')}</div>`);
                break;
            }
            case 'agregar-existente': {
                const [r, e] = id.split('|'); cerrarDialogo(); A.rutinas.editar(rutinaPorId(r), e);
                break;
            }
            case 'agregar-nueva': {
                cerrarDialogo(); A.rutinas.editar(null, id);
                break;
            }
            case 'favorito': {
                datos.favoritos = datos.favoritos.includes(id) ? datos.favoritos.filter(e => e !== id) : [...datos.favoritos, id];
                actualizar('Favoritos actualizados.');
                break;
            }
            case 'detalle': {
                const e = C.ejercicios.find(x => x.id === id);
                abrirDialogo(e.nombre, `${e.imagen ? `<img class="detalle-imagen d-block w-100 object-fit-contain mb-3" src="${e.imagen}" alt="Ilustración de ${esc(e.nombre)}">` : ''}<p><strong>${esc(e.grupo)}</strong> · ${esc(e.equipo)}</p><p>${esc(e.descripcion)}</p><h3 class="h5">Referencia de ejecución</h3><p>${esc(e.tecnica)}</p><p class="small text-body-secondary">Usá una carga que puedas controlar. Esta descripción no reemplaza la orientación de un profesional. Los videos se incorporarán en una próxima etapa.</p>${boton('Agregar a una rutina', 'agregar-catalogo', id, 'btn-primary')}`);
                break;
            }
        }
    }

    $('#filtros').addEventListener('input', () => {
        catalogoExpandido = false;
        filtros = { texto: $('#buscar').value.trim(), grupo: $('#grupo').value, equipo: $('#equipo').value, favoritos: $('#filtros [name="favoritos"]').checked };
        renderCatalogo();
    });

    A.registrar({
        nombre: 'leandro',
        acciones: ["alternar-catalogo","favorito","detalle","agregar-catalogo","agregar-existente","agregar-nueva"],
        manejarClick,
        vistas: { catalogo: renderCatalogo }
    });
})();