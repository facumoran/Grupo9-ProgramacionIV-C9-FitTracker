'use strict';
window.FitCatalogo = (() => {
    const grupos = {
        Pecho: [
            ['press-banca', 'Press de banca', 'Barra', 'Empuje horizontal sobre un banco.', 'Mantené los pies apoyados y descendé la barra de forma controlada.', 'mascota-press-banca.png'],
            ['press-inclinado', 'Press inclinado con mancuernas', 'Mancuernas', 'Empuje sobre un banco inclinado.', 'Apoyá la espalda y evitá golpear las mancuernas al subir.', 'mascota-press-inclinado.png'],
            ['aperturas', 'Aperturas con mancuernas', 'Mancuernas', 'Apertura de brazos sobre banco.', 'Conservá una leve flexión de codos durante el recorrido.', 'mascota-aperturas.png'],
            ['flexiones', 'Flexiones de brazos', 'Peso corporal', 'Empuje con el cuerpo apoyado en manos y pies.', 'Mantené el cuerpo alineado y bajá de manera controlada.', 'mascota-flexiones.png'],
            ['cruces', 'Cruces en polea', 'Polea', 'Acercamiento de brazos delante del torso.', 'Evitá balancear el tronco para mover la carga.', 'mascota-cruces.png'],
            ['press-maquina', 'Press de pecho en máquina', 'Máquina', 'Empuje sentado con resistencia guiada.', 'Ajustá el asiento para alinear las empuñaduras con el pecho.', 'mascota-press-maquina.png']
        ],
        Espalda: [
            ['remo-mancuerna', 'Remo con mancuerna', 'Mancuernas', 'Tracción de una mancuerna hacia el torso.', 'Apoyá el cuerpo de forma estable y evitá girar el tronco.', 'mascota-remo-mancuerna.png'],
            ['dominadas', 'Dominadas', 'Barra de dominadas', 'Tracción del cuerpo hacia una barra fija.', 'Subí sin impulso y descendé de manera controlada.', 'mascota-dominadas.png'],
            ['jalon', 'Jalón al pecho', 'Polea', 'Tracción vertical hacia la parte alta del pecho.', 'No lleves la barra por detrás de la cabeza.', 'mascota-jalon.png'],
            ['remo-barra', 'Remo con barra', 'Barra', 'Tracción horizontal con el tronco inclinado.', 'Sostené una posición estable sin redondear la espalda.', 'mascota-remo-barra.png'],
            ['remo-polea', 'Remo sentado en polea', 'Polea', 'Tracción horizontal desde una posición sentada.', 'Evitá tirar mediante balanceos del torso.', 'mascota-remo-polea.png'],
            ['pullover', 'Pullover en polea', 'Polea', 'Descenso de brazos desde una polea alta.', 'Mantené una ligera flexión de codos y controlá el regreso.', 'mascota-pullover.png']
        ],
        Piernas: [
            ['sentadilla', 'Sentadilla con barra', 'Barra', 'Flexión y extensión de piernas con barra.', 'Mantené los pies apoyados y las rodillas alineadas con ellos.', 'mascota-sentadilla.png'],
            ['prensa', 'Prensa de piernas', 'Máquina', 'Empuje de plataforma con ambas piernas.', 'Mantené la espalda apoyada y evitá bloquear las rodillas.', 'mascota-prensa.png'],
            ['zancadas', 'Zancadas', 'Mancuernas', 'Paso y descenso alternado de piernas.', 'Conservá el equilibrio y controlá el descenso.', 'mascota-zancadas.png'],
            ['extension-piernas', 'Extensión de piernas', 'Máquina', 'Extensión de rodillas en posición sentada.', 'Alineá la rodilla con el eje de la máquina.', 'mascota-extension-piernas.png'],
            ['curl-femoral', 'Curl femoral', 'Máquina', 'Flexión de rodillas contra resistencia.', 'Ajustá los apoyos y evitá levantar la cadera.', 'mascota-curl-femoral.png'],
            ['gemelos', 'Elevación de talones', 'Peso corporal', 'Elevación y descenso de talones.', 'Realizá el recorrido sin rebotes.', 'mascota-gemelos.png']
        ],
        Glúteos: [
            ['hip-thrust', 'Hip thrust', 'Barra', 'Extensión de cadera con espalda apoyada en banco.', 'Evitá terminar el movimiento arqueando la zona lumbar.', 'mascota-hip-thrust.png'],
            ['puente', 'Puente de glúteos', 'Peso corporal', 'Elevación de cadera desde el suelo.', 'Apoyá los pies y levantá la cadera de forma controlada.', 'mascota-puente.png'],
            ['peso-muerto', 'Peso muerto', 'Barra', 'Levantamiento mediante extensión de cadera y piernas.', 'Mantené la carga cerca del cuerpo y evitá tirones.', 'mascota-peso-muerto.png'],
            ['peso-rumano', 'Peso muerto rumano', 'Mancuernas', 'Bisagra de cadera con rodillas ligeramente flexionadas.', 'Llevá la cadera hacia atrás manteniendo la espalda estable.', 'mascota-peso-rumano.png'],
            ['patada-gluteo', 'Patada de glúteo en polea', 'Polea', 'Extensión de cadera con tobillera.', 'Evitá arquear la espalda para ampliar el recorrido.', 'mascota-patada-gluteo.png'],
            ['abduccion', 'Abducción de cadera', 'Máquina', 'Separación de piernas contra resistencia.', 'Mantené el torso estable y controlá el regreso.', 'mascota-abduccion.png']
        ],
        Hombros: [
            ['press-militar', 'Press militar', 'Barra', 'Empuje de barra por encima de la cabeza.', 'Mantené el abdomen firme y evitá arquear la espalda.', 'mascota-press-militar.png'],
            ['press-hombros', 'Press de hombros con mancuernas', 'Mancuernas', 'Empuje vertical sentado.', 'Controlá el descenso y mantené la espalda apoyada.', 'mascota-press-hombros.png'],
            ['laterales', 'Elevaciones laterales', 'Mancuernas', 'Elevación de brazos hacia los lados.', 'Evitá balanceos y mantené los codos ligeramente flexionados.', 'mascota-elevaciones-laterales.png'],
            ['frontales', 'Elevaciones frontales', 'Mancuernas', 'Elevación de brazos hacia delante.', 'Subí de forma controlada sin impulsar el torso.', 'mascota-elevaciones-frontales.png'],
            ['pajaros', 'Aperturas posteriores', 'Mancuernas', 'Apertura lateral con torso inclinado.', 'Mantené una posición estable durante el recorrido.', 'mascota-aperturas-posteriores.png'],
            ['face-pull', 'Face pull', 'Polea', 'Tracción de cuerda hacia el rostro.', 'Controlá la carga y evitá mover la cabeza hacia delante.', 'mascota-face-pull.png']
        ],
        Bíceps: [
            ['curl-barra', 'Curl con barra', 'Barra', 'Flexión de codos con barra.', 'Mantené los codos cerca del torso sin balancearte.', 'mascota-curl-barra.png'],
            ['curl-mancuerna', 'Curl alternado', 'Mancuernas', 'Flexión alternada de codos.', 'Controlá tanto la subida como la bajada.', 'mascota-curl-mancuerna.png'],
            ['curl-martillo', 'Curl martillo', 'Mancuernas', 'Flexión de codos con agarre neutro.', 'Mantené las palmas enfrentadas y el torso estable.', 'mascota-curl-martillo.png'],
            ['curl-inclinado', 'Curl inclinado', 'Mancuernas', 'Flexión de codos en banco inclinado.', 'Apoyá la espalda y evitá adelantar los codos.', 'mascota-curl-inclinado.png'],
            ['curl-polea', 'Curl en polea', 'Polea', 'Flexión de codos con resistencia de cable.', 'Mantené los hombros estables durante el recorrido.', 'mascota-curl-polea.png'],
            ['curl-predicador', 'Curl predicador', 'Máquina', 'Flexión de codos sobre apoyo.', 'No fuerces la extensión completa del codo.', 'mascota-curl-predicador.png']
        ],
        Tríceps: [
            ['triceps-polea', 'Extensión de tríceps en polea', 'Polea', 'Extensión de codos desde una polea alta.', 'Mantené los codos junto al torso.', 'mascota-triceps-polea.png'],
            ['triceps-cuerda', 'Extensión con cuerda', 'Polea', 'Extensión de codos con agarre de cuerda.', 'Evitá usar el peso del cuerpo para bajar la carga.', 'mascota-triceps-cuerda.png'],
            ['triceps-cabeza', 'Extensión sobre la cabeza', 'Mancuernas', 'Extensión de codos con carga elevada.', 'Mantené el abdomen firme y controlá el descenso.', 'mascota-triceps-cabeza.png'],
            ['press-frances', 'Press francés', 'Barra', 'Extensión de codos sobre banco.', 'Mantené los brazos estables y mové principalmente los antebrazos.', 'mascota-press-frances.png'],
            ['press-cerrado', 'Press de banca cerrado', 'Barra', 'Empuje horizontal con agarre más estrecho.', 'Conservá las muñecas alineadas y evitá un agarre excesivamente estrecho.', 'mascota-press-cerrado.png'],
            ['patada-triceps', 'Patada de tríceps', 'Mancuernas', 'Extensión de codo con torso inclinado.', 'Sostené el brazo estable y evitá lanzar la carga.', 'mascota-patada-triceps.png']
        ],
        Abdomen: [
            ['plancha', 'Plancha', 'Peso corporal', 'Sostén del cuerpo sobre antebrazos y pies.', 'Mantené el cuerpo alineado. En la rutina, usá segundos en lugar de repeticiones.', null, 'segundos'],
            ['crunch', 'Crunch abdominal', 'Peso corporal', 'Flexión corta del tronco desde el suelo.', 'No tires del cuello con las manos.'],
            ['elevacion-rodillas', 'Elevación de rodillas', 'Barra de dominadas', 'Elevación de rodillas en suspensión.', 'Evitá balancear el cuerpo para iniciar el movimiento.'],
            ['dead-bug', 'Dead bug', 'Peso corporal', 'Extensión alternada de brazo y pierna contrarios.', 'Controlá el movimiento manteniendo el tronco estable.'],
            ['crunch-polea', 'Crunch en polea', 'Polea', 'Flexión del tronco con resistencia de cable.', 'Evitá convertir el recorrido en un tirón de brazos.'],
            ['plancha-lateral', 'Plancha lateral', 'Peso corporal', 'Sostén lateral sobre antebrazo y pies.', 'Mantené la cadera alineada. Registrá el tiempo en segundos.', null, 'segundos']
        ]
    };
    const ejercicios = Object.entries(grupos).flatMap(([grupo, filas]) => filas.map(([id, nombre, equipo, descripcion, tecnica, imagen, unidad]) => ({
        id, nombre, grupo, equipo, descripcion, tecnica,
        imagen: imagen ? `img/${imagen}` : null, videoUrl: null, unidad: unidad || 'repeticiones'
    })));
    const plantillas = [
        { id: 'full-body', nombre: 'Full Body · Base', ids: ['sentadilla', 'press-banca', 'remo-mancuerna', 'plancha'] },
        { id: 'empuje', nombre: 'Empuje · Pecho y brazos', ids: ['press-banca', 'press-hombros', 'laterales', 'triceps-polea'] },
        { id: 'torso', nombre: 'Torso · Tracción y empuje', ids: ['jalon', 'remo-mancuerna', 'press-inclinado', 'curl-martillo'] },
        { id: 'pierna', nombre: 'Piernas y glúteos', ids: ['sentadilla', 'peso-rumano', 'hip-thrust', 'gemelos'] }
    ];
    return { ejercicios, plantillas, grupos: Object.keys(grupos) };
})();