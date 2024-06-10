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
exports.getUserRankByCountryForCurrentYear = exports.getUserRankByCountryForCurrentMonth = exports.getUserRankByCityForCurrentYear = exports.getUserRankByCityForCurrentMonth = void 0;
const client_1 = require("../libs/client");
const getUserRankByCityForCurrentMonth = (locationId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.client.$queryRaw `
    WITH UserNutCounts AS (
      SELECT 
        "userId", 
        CAST(COUNT(*) AS INTEGER) AS nut_count,
        CAST(RANK() OVER (ORDER BY COUNT(*) DESC) AS INTEGER) AS user_rank
      FROM 
        "Nut" 
      WHERE 
        "locationId" = ${locationId}
        AND "date" >= DATE_TRUNC('month', CURRENT_DATE)
        AND "date" < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
      GROUP BY 
        "userId"
    )
    SELECT 
      user_rank
    FROM 
      UserNutCounts 
    WHERE 
      "userId" = ${userId};
  `;
});
exports.getUserRankByCityForCurrentMonth = getUserRankByCityForCurrentMonth;
const getUserRankByCityForCurrentYear = (locationId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.client.$queryRaw `
    WITH UserNutCounts AS (
        SELECT 
          "userId", 
          CAST(COUNT(*) AS INTEGER) AS nut_count,
          CAST(RANK() OVER (ORDER BY COUNT(*) DESC) AS INTEGER) AS user_rank
        FROM 
          "Nut" 
        WHERE 
          "locationId" = ${locationId}
          AND "date" >= DATE_TRUNC('year', CURRENT_DATE)
          AND "date" < DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year'
        GROUP BY 
          "userId"
      )
      SELECT 
        user_rank
      FROM 
        UserNutCounts 
      WHERE 
        "userId" = ${userId};
  `;
});
exports.getUserRankByCityForCurrentYear = getUserRankByCityForCurrentYear;
const getUserRankByCountryForCurrentMonth = (countryCode, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.client.$queryRaw `
    WITH UserNutCounts AS (
      SELECT 
        "User"."id" AS "userId",
        CAST(COUNT(*) AS INTEGER) AS nut_count,
        CAST(RANK() OVER (ORDER BY COUNT(*) DESC) AS INTEGER) AS user_rank
      FROM 
        "Nut" 
      JOIN 
        "Location" ON "Nut"."locationId" = "Location"."id"
      JOIN 
        "User" ON "Nut"."userId" = "User"."id"
      WHERE 
        "Location"."countryCode" = ${countryCode}
        AND "Nut"."date" >= DATE_TRUNC('month', CURRENT_DATE)
        AND "Nut"."date" < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
      GROUP BY 
        "User"."id"
    )
    SELECT 
      user_rank
    FROM 
      UserNutCounts 
    WHERE 
      "userId" = ${userId};
  `;
});
exports.getUserRankByCountryForCurrentMonth = getUserRankByCountryForCurrentMonth;
const getUserRankByCountryForCurrentYear = (countryCode, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client_1.client.$queryRaw `
    WITH UserNutCounts AS (
      SELECT 
        "User"."id" AS "userId",
        CAST(COUNT(*) AS INTEGER) AS nut_count,
        CAST(RANK() OVER (ORDER BY COUNT(*) DESC) AS INTEGER) AS user_rank
      FROM 
        "Nut" 
      JOIN 
        "Location" ON "Nut"."locationId" = "Location"."id"
      JOIN 
        "User" ON "Nut"."userId" = "User"."id"
      WHERE 
        "Location"."countryCode" = ${countryCode}
        AND "Nut"."date" >= DATE_TRUNC('year', CURRENT_DATE)
        AND "Nut"."date" < DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year'
      GROUP BY 
        "User"."id"
    )
    SELECT 
      user_rank
    FROM 
      UserNutCounts 
    WHERE 
      "userId" = ${userId};
  `;
});
exports.getUserRankByCountryForCurrentYear = getUserRankByCountryForCurrentYear;
//# sourceMappingURL=queries.js.map