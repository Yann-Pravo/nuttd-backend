import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

export const getErrorMessage = (err: any) => {
  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return `${err.meta?.target} already exists`
    }
  }

    return "Something went wrong"
}