/*
 * any-to-luxon.ts
 * 
 * Created by Dr. Maximillian Dornseif 2023-01-31 in any-to-luxon 0.1.0
 * Copyright (c) 2023 Dr. Maximillian Dornseif
 */

import { DateTime } from 'luxon'

/** convert anything into a luxon.DateTime
 *  see https://moment.github.io/luxon/docs/class/src/datetime.js~DateTime.html
 */
export function dateTimeify<T>(val: T): T | DateTime {
  if (typeof val === 'string') {
    if (val.match(/\d{13,14}/)) {
      // legacy datastore
      return DateTime.fromSeconds(parseInt(val) / 1000)
    }
    return DateTime.fromISO(val.replace(' ', 'T'))
  } else if (val && 'toDate' in (val as object)) {
    // moment.js objects
    return DateTime.fromJSDate((val as any).toDate())
  } else if (Object.prototype.toString.call(val) === "[object Date]") {
    // plain Javascript Dates
    return DateTime.fromJSDate(val as Date)
  }
  return val
}
