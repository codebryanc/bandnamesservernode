const { io } = require('../index');

class Bands {
    constructor() {
        this.bands = [];
    }

    addBand(band = new band) {
        this.bands.push(band);
        return true;
    }

    getBands() {
        return this.bands;
    }

    deleteBand(id = '') {
        this.bands = this.bands.filter(bnd => bnd.id !== id);
        return this.bands;
    }

    voteBand(id = '') {
        // Recuerda que maps interactua con los registros
        // Lo que hace es transformar la el registro que recibe por eso el else
        this.bands = this.bands.map(band => {
            if(band.id == id) {
                band.votes ++;
                return band;
            }
            else {
                return band;
            }
        });
    }
}

const { v4: uuidV4 } = require('uuid');

class Band {
    constructor(name = 'no-name') {
        this.id = uuidV4(); // Identificador único
        this.name = name;
        this.votes = 0;
    }
}

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
