import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const newArtist = await prisma.user.create({
    data: {
      username: 'test',
      email: 'test@nuttd.com',
      password: 'test'
    },
  })
  console.log('Created new user: ', newArtist)

  const allArtists = await prisma.user.findMany({
    include: { nuts: true },
  })
  console.log('All users: ')
  console.dir(allArtists, { depth: null })
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())