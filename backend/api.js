const API_KEY = "9c86627a-3a79-45dc-a18b-573614db0d9c";
const axios = require("axios");
/**
 * Return a route from [from] to [to]
 *
 * @param {*} from [array] of [[latitude], [longitude]]
 * @param {*} to [array] of [[latitude], [longitude]]
 * @param {string} [local="us"]
 * @param {string} [vehicle="car"]
 * @returns
 */
async function getRoute({from, to, local = "us", vehicle = "car", key}) {
    const qString = `https://graphhopper.com/api/1/route?point=${from}&point=${to}&vehicle=${vehicle}&locale=${local}&calc_points=true&key=${API_KEY}&points_encoded=false`;
    const result = await axios.get(qString);
    const path = result.data.paths[0];
    const route = {
        time: path.time,
        distance: path.distance,
        bbox: path.bbox,
        points: path.points.coordinates,
        instructions: path.instructions.reduce((roads, ins) => {
            const road = {
                time: ins.time,
                distance: ins.distance,
                name: ins.street_name,
                text: ins.text,
                end_points: ins.interval
            };
            roads.push(road);
            return roads;
        }, [])
    };
    return route;
}

module.exports = function (database) {
    return { getRoute }
};