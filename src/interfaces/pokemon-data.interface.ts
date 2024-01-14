/* Interfaces were created for another API but there was a problem with CORS policy

export interface Response {
  status: Status
  data: Data[]
}

export interface Status {
  timestamp: string
  error_code: number
  error_message: null | string
  elapsed: number
  credit_count: number
  notice: null | string
}

export interface Data {
  id: number
  rank: number
  name: string
  symbol: string
  slug: string
  is_active: number
  first_historical_data: string
  last_historical_data: string
  platform: null | string
}
*/
export interface Pokemon {
  name: string
  url: string
}
