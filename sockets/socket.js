const { io } = require('../index');

const Bands = require('../models/Bands');
const Band = require('../models/Band');

const bands = new Bands();

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Bad bunny'));
bands.addBand(new Band('Bon joví'));
bands.addBand(new Band('Metallica'));

// Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
    
    client.on('mensaje', ( payload ) => {
        console.log('Mensaje', payload);
        io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );
    });

    client.on('emitir-mensaje', (payload) => {
        // console.log(payload);
        // io.emit('nuevo-mensaje', payload); // Esto emite a todos
        client.broadcast.emit('nuevo-mensaje', payload); // Esto emite a todos, menos el que lo emitio
    });

    client.on('vote-band', (payload) => {
        bands.voteBand(payload.id);

        io.emit('active-bands', bands.getBands());
    });

    client.on('add-band', (payload) => {
        bands.addBand(new Band(payload.name));

        io.emit('active-bands', bands.getBands());
    })

    client.on('delete-band', (payload) => {
        bands.deleteBand(payload.id)

        io.emit('active-bands', bands.getBands());
    })
});
