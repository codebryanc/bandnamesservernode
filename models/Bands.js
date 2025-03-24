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

module.exports = Bands;