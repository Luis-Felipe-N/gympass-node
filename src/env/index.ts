import 'dotenv'
import z from 'zod'

const envShema = z.object({
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z.enum(['env', 'test', 'prod']).default('env'),
})

const _env = envShema.safeParse(process.env)

if (_env.success === false) {
  console.log('Invalid environments variables')

  throw new Error('Invalid environments variables')
}

export const env = _env.data
