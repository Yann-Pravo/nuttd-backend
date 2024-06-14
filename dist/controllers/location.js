"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNutCountByLocation = void 0;
const date_fns_1 = require("date-fns");
const client_1 = require("../libs/client");
const errors_1 = require("../utils/errors");
const getNutCountByLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { geoScope } = req.query;
    try {
        const startOfCurrentYear = (0, date_fns_1.startOfYear)(new Date());
        const endOfCurrentYear = (0, date_fns_1.endOfYear)(new Date());
        const locations = yield client_1.client.location.findMany({
            where: {
                NOT: {
                    longitude: null,
                    latitude: null,
                },
            },
            include: {
                nuts: {
                    where: {
                        createdAt: {
                            gte: startOfCurrentYear,
                            lte: endOfCurrentYear,
                        },
                    },
                },
            },
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let citiesWithNutCount = [];
        let countriesWithNutCount = {};
        if (geoScope === 'countries') {
            countriesWithNutCount = locations.reduce((acc, location) => {
                if (!location.countryCode)
                    return;
                if (!acc[location.countryCode]) {
                    acc[location.countryCode] = {
                        countryCode: location.countryCode,
                        country: location.country,
                        nutCount: 0,
                    };
                }
                acc[location.countryCode].nutCount += location.nuts.length;
                return acc;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }, {});
            // locationsWithNutCount = Object.keys(countryNutCounts).map(
            //   (key) => countryNutCounts[key]
            // )
        }
        else {
            citiesWithNutCount = locations
                .map((location) => ({
                id: location.id,
                city: location.city,
                country: location.country,
                latitude: location.latitude,
                longitude: location.longitude,
                nutCount: location.nuts.length,
            }))
                .sort((locationA, locationB) => locationB.nutCount > locationA.nutCount ? 1 : -1);
        }
        res
            .status(200)
            .json({ cities: citiesWithNutCount, countries: countriesWithNutCount });
    }
    catch (err) {
        (0, errors_1.handleError)(err, res);
    }
});
exports.getNutCountByLocation = getNutCountByLocation;
//# sourceMappingURL=location.js.map