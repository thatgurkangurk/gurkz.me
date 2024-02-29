import type { inferAsyncReturnType } from '@trpc/server'
import { createSolidAPIHandlerContext } from '~/lib/mediakit/trpc/handler'

export const createContextInner = async (
    opts: createSolidAPIHandlerContext
) => {
    return {
        request: opts.req,
        response: opts.res
    }
}

export const createContext = async (opts: createSolidAPIHandlerContext) => {
    return await createContextInner(opts)
}

export type Context = inferAsyncReturnType<typeof createContext>