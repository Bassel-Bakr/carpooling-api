module.exports = {
    vehicleTypes: [
        {
            name: "car",
            description: "Car mode",
            restrictions: "car access"
        },
        {
            name: "small_truck",
            description: "Small truck like a Mercedes Sprinter, Ford Transit or Iveco Daily",
            restrictions: "height=2.7m, width=2+0.4m, length=5.5m, weight=2080+1400 kg"
        },
        {
            name: "truck",
            description: "Truck like a MAN or Mercedes-Benz Actros",
            restrictions: "height=3.7m, width=2.6+0.5m, length=12m, weight=13000 + 13000 kg, hgv=yes, 3 Axes"
        },
        {
            name: "scooter",
            description: "Moped mode",
            restrictions: "Fast inner city, often used for food delivery, is able to ignore certain bollards, maximum speed of roughly 50km/h"
        },
        {
            name: "foot",
            description: "Pedestrian or walking	",
            restrictions: "foot access"
        },
        {
            name: "hike",
            description: "Pedestrian or walking with priority for more beautiful hiking tours and potentially a bit longer than foot	",
            restrictions: "foot access"
        },
        {
            name: "bike",
            description: "Trekking bike avoiding hills",
            restrictions: "bike access"
        },
        {
            name: "mtb",
            description: "Mountainbike",
            restrictions: "bike access"
        },
        {
            name: "racingbike",
            description: "Bike preferring roads",
            restrictions: "bike access"
        }
    ]
};
