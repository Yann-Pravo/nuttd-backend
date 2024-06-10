import { client } from '../libs/client'

export const getUserRankByCityForCurrentMonth = async (
  locationId: string,
  userId: string
): Promise<{ user_rank: number }[]> =>
  await client.$queryRaw`
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
  `

export const getUserRankByCityForCurrentYear = async (
  locationId: string,
  userId: string
): Promise<{ user_rank: number }[]> =>
  await client.$queryRaw`
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
  `

export const getUserRankByCountryForCurrentMonth = async (
  countryCode: string,
  userId: string
): Promise<{ user_rank: number }[]> =>
  await client.$queryRaw`
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
  `

export const getUserRankByCountryForCurrentYear = async (
  countryCode: string,
  userId: string
): Promise<{ user_rank: number }[]> =>
  await client.$queryRaw`
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
  `
