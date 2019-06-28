import constants from "../../middle/apiConstants";

const apiPrefix = "api";

const commonOptions = {
    id: {
        name: "id",
        description: "driver id"
    },
    seen: {
        name: "seen",
        description: "last seen time (seconds since epoch)"
    },
    since: {
        name: "since",
        description: "the time after which he should've been active (seconds since epoch)"
    },
    from: {
        name: "from",
        description: "start point"
    },
    at: {
        name: "at",
        description: "driver location"
    },
    point1: {
        name: "point1",
        description: "1st coordinate point"
    },
    point2: {
        name: "point2",
        description: "2nd coordinate point"
    },
    to: {
        name: "to",
        description: "end point"
    },
    vehicle: {
        name: "vehicle",
        description: "type of vehicle in use, default is car"
    },
    local: {
        name: "local",
        description: "language used to describe roads"
    },
    key: {
        name: "key",
        description: "your api key"
    }
}


export default [
    {
        name: "Routing",
        description: "Returns a list of points and roads to go from [from] point to [to] point",
        methods: "get",
        options: [
            commonOptions.from,
            commonOptions.to,
            commonOptions.vehicle,
            commonOptions.local,
            commonOptions.key,
        ],
        example: `${apiPrefix}/route?from=30.06898,31.3558&to=30.06220,31.35159&vehicle=car&locale=us&key=[your api key]`,
        output: JSON.stringify({
            "time": 217582,
            "distance": 1580.92,
            "bbox": [
                31.351624,
                30.061367,
                31.358061,
                30.06912
            ],
            "points": [
                [
                    31.355761,
                    30.069043
                ],
                [
                    31.355926,
                    30.06912
                ],
                [
                    31.35621,
                    30.068718
                ],
                [
                    31.356746,
                    30.067844
                ],
                [
                    31.356898,
                    30.067553
                ],
                [
                    31.357386,
                    30.066462
                ],
                [
                    31.357573,
                    30.065856
                ],
                [
                    31.357705,
                    30.065356
                ],
                [
                    31.357954,
                    30.064122
                ],
                [
                    31.358061,
                    30.062663
                ],
                [
                    31.358023,
                    30.062071
                ],
                [
                    31.35797,
                    30.061641
                ],
                [
                    31.35712,
                    30.061711
                ],
                [
                    31.356981,
                    30.061709
                ],
                [
                    31.353674,
                    30.061367
                ],
                [
                    31.353552,
                    30.062158
                ],
                [
                    31.351624,
                    30.061949
                ]
            ],
            "instructions": [
                {
                    "time": 4062,
                    "distance": 18.053,
                    "name": "",
                    "text": "Continue",
                    "end_points": [
                        0,
                        1
                    ]
                },
                {
                    "time": 97988,
                    "distance": 871.05,
                    "name": "حسن المأمون",
                    "text": "Turn right onto حسن المأمون",
                    "end_points": [
                        1,
                        11
                    ]
                },
                {
                    "time": 53496,
                    "distance": 416.093,
                    "name": "شارع ابو داوود الظاهرى",
                    "text": "Turn right onto شارع ابو داوود الظاهرى",
                    "end_points": [
                        11,
                        14
                    ]
                },
                {
                    "time": 19964,
                    "distance": 88.731,
                    "name": "شارع ذكي شرف",
                    "text": "Turn right onto شارع ذكي شرف",
                    "end_points": [
                        14,
                        15
                    ]
                },
                {
                    "time": 42072,
                    "distance": 186.993,
                    "name": "شارع محمد كامل الحاروني",
                    "text": "Turn left onto شارع محمد كامل الحاروني",
                    "end_points": [
                        15,
                        16
                    ]
                },
                {
                    "time": 0,
                    "distance": 0,
                    "name": "",
                    "text": "Arrive at destination",
                    "end_points": [
                        16,
                        16
                    ]
                }
            ]
        }, null, 4)
    },
    {
        name: "Update Driver Location",
        description: "Updates driver's last saved location creating it if it doesn't exists",
        methods: "post",
        options: [
            commonOptions.id,
            commonOptions.at,
            commonOptions.key,
            commonOptions.seen,
        ],
        example: `${apiPrefix}/update_driver?id=lovelydriver7at=12.1561561,30.16514&seen=13203215&key=[your api key]`,
        output: JSON.stringify("sent", null, 4)
    },
    {
        name: "Get Driver",
        description: "Returns the data of a driver with some id",
        methods: "get",
        options: [
            commonOptions.id,
            commonOptions.key,
        ],
        example: `${apiPrefix}/get_driver?id=lovelydriver&key=[your api key]`,
        output: JSON.stringify({
            "_id": "5d14d2a7259fce8c82985996",
            "id": "lol",
            "__v": 0,
            "boss": "hossam",
            "latitude": 5,
            "longitude": 5,
            "seen": 1561645735.548
        }, null, 4)
    },
    {
        name: "Get All Drivers",
        description: "Returns a list of all recorded drivers",
        methods: "get",
        options: [
            commonOptions.key,
        ],
        example: `${apiPrefix}/get_all_drivers?key=[your api key]`,
        output: JSON.stringify([
            {
                "_id": "5d14d2a7259fce8c82985996",
                "id": "lol",
                "__v": 0,
                "boss": "hossam",
                "latitude": 5,
                "longitude": 5,
                "seen": 1561645735.548
            }
        ], null, 4)
    },
    {
        name: "Delete Driver",
        description: "Deletes a driver if it exists",
        methods: "delete",
        options: [
            commonOptions.id,
            commonOptions.key,
        ],
        example: `${apiPrefix}/delete_driver?id=lovelydriver&key=[your api key]`,
        output: JSON.stringify("deleted", null, 4)
    },
    {
        name: "Delete All Drivers",
        description: "Deletes all drivers",
        methods: "delete",
        options: [
            commonOptions.key,
        ],
        example: `${apiPrefix}/delete_all_drivers?key=[your api key]`,
        output: JSON.stringify("deleted", null, 4)
    }
];