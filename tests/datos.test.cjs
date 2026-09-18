
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const contexto = { window: {}, console, Date, Math, globalThis: {} };
vm.createContext(contexto);
for (const archivo of ['catalogo.js', 'datos.js']) vm.runInContext(readFileSync(path.join(__dirname, '../js', archivo), 'utf8'), contexto);
const C = contexto.window.FitCatalogo;
const D = contexto.window.FitDatos;
const memoria = () => { let valor = null; return { getItem: () => valor, setItem: (_, v) => { valor = v; } }; };

test('Catálogo: 48 IDs únicos y 6 ejercicios por grupo', () => {
    assert.equal(C.ejercicios.length, 48);
    assert.equal(new Set(C.ejercicios.map(e => e.id)).size, 48);
    C.grupos.forEach(g => assert.equal(C.ejercicios.filter(e => e.grupo === g).length, 6));
    C.plantillas.forEach(p => p.ids.forEach(id => assert.ok(C.ejercicios.some(e => e.id === id))));
});
test('Persistencia: ida y vuelta de un estado vacío', () => {
    const storage = memoria();
    assert.equal(D.guardar(D.nuevo(), storage), true);
    assert.equal(D.cargar(storage).error, null);
    assert.equal(D.valido(D.cargar(storage).datos), true);
});
test('Datos corruptos y almacenamiento bloqueado no provocan una excepción', () => {
    assert.ok(D.cargar({ getItem: () => '{no-json' }).error);
    assert.ok(D.cargar({ getItem: () => JSON.stringify({ version: 1, sesiones: [{}] }) }).error);
    assert.equal(D.guardar(D.nuevo(), { setItem: () => { throw Error('Sin espacio'); } }), false);
});
test('Validación de números: vacíos, negativos, NaN y fracciones indebidas', () => {
    for (const v of ['', '   ', -1, 'texto', NaN, Infinity, true]) assert.equal(D.numero(v, 0, 100), false);
    assert.equal(D.numero(2.5, 1, 10, true), false);
    assert.equal(D.numero(0, 0, 100), true);
});
function sesion() {
    return D.iniciar({ id: 'r1', nombre: 'Prueba', ejercicios: [
        { ejercicioId: 'press-banca', series: 2, reps: 10, peso: 20, descanso: 60 },
        { ejercicioId: 'plancha', series: 1, reps: 30, peso: 0, descanso: 30 }
    ] }, C.ejercicios, '2026-09-17');
}
test('Las sesiones conservan una copia de la rutina y excluyen series pendientes y tiempo', () => {
    const s = sesion();
    s.ejercicios[0].series[0].hecha = true;
    s.ejercicios[1].series[0].hecha = true;
    assert.equal(D.volumen(s), 200);
    assert.equal(s.ejercicios[0].nombre, 'Press de banca');
    assert.equal(D.valido({ ...D.nuevo(), activa: s }), true);
});
test('Semanas, rachas, volumen y récords se calculan desde las sesiones', () => {
    const datos = D.nuevo();
    const s1 = sesion(); s1.ejercicios[0].series[0].hecha = true;
    const s2 = sesion(); s2.fecha = '2026-09-10'; s2.ejercicios[0].series[0] = { reps: 5, peso: 40, hecha: true };
    datos.sesiones.push(s1, s2);
    const e = D.estadisticas(datos, '2026-09-17');
    assert.equal(e.total, 2); assert.equal(e.mes, 2); assert.equal(e.semana, 1);
    assert.equal(e.volumen, 400); assert.equal(e.racha, 2); assert.equal(e.records[0].peso, 40);
    assert.equal(D.lunes('2026-09-20'), '2026-09-14');
    assert.equal(D.estadisticas(datos, '2026-10-01').racha, 0);
});
