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
