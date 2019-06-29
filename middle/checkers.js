module.exports = {
    point(p) {
        let okay = false;
        if (p) {
            const tokens = p.split(',');
            if (tokens.length == 2) {
                let [lat, lng] = tokens.map(x => Number(x));
                if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
                    okay = (Math.abs(lat) <= 90 && Math.abs(lng) <= 180);
                }
            }

        }
        return okay;
    }
};