// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    snacks: {
      id: string
      session_id?: string
      name: string
      description: string
      is_on_diet: number
      created_at: string
    }
  }
}
