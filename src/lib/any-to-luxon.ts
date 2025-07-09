/*
 * any-to-luxon.ts
 *
 * Created by Dr. Maximillian Dornseif 2019
 * Copyright (c) 2019-2023  Maximillian Dornseif
 */

import { DateTime } from 'luxon'

/** convert anything into a luxon.DateTime
 *  see https://moment.github.io/luxon/docs/class/src/datetime.js~DateTime.html
 */
export function dateTimeify<T>(val: T): DateTime | T {
  if (val instanceof DateTime || DateTime.isDateTime(val)) {
    // luxon.DateTime
    return val
  } else if (val instanceof Date) {
    // Javascript Date()
    return DateTime.fromJSDate(val)
  } else if (typeof val === 'string') {
    if (val.match(/\d{13,14}/)) {
      // legacy datastore (Python2, db module) sometimes stores milliseconds as string
      return DateTime.fromMillis(parseInt(val))
    } else if (val.match(/\d{10,12}/)) {
      // Unix epoch seconds
      return DateTime.fromSeconds(parseInt(val))
    } else {
      // (Hopefully) an ISO String
      return DateTime.fromISO(val.replace(' ', 'T'), { zone: 'UTC' })
    }
  } else if (typeof val === 'number') {
    if (val > 2 ** 31) {
      // legacy datastore (Python2, db module) sometimes stores milliseconds as numbers
      return DateTime.fromMillis(val)
    } else {
      return DateTime.fromSeconds(val)
    }
  } else if (val != null && typeof val === 'object' && 'toDate' in (val as object)) {
    // moment.js objects
    return DateTime.fromJSDate((val as any).toDate())
  } else if (val != null && typeof val === 'object' && 'value' in (val as object)) {
    // BigQuery and Datastore results sometimes are nested
    // eslint-disable-next-line @typescript-eslint/dot-notation
    return dateTimeify<T>((val as any)['value'])
  }
  return val
}

export function dateTimeifyTyped(val: any): DateTime {
  const ret = dateTimeify(val)
  if (val instanceof DateTime || DateTime.isDateTime(val)) {
    return ret
  }
  // Handle cases where val might not be stringifiable (like Symbol)
  let valStr: string
  try {
    valStr = typeof val === 'symbol' ? val.toString() : String(val)
  } catch {
    valStr = `[${typeof val}]`
  }
  return DateTime.invalid('unparsable', `the input "${valStr}" can't be parsed as DateTime`)
  // or: throw new Error(`unknown Date Value: ${JSON.stringify(val)} (${typeof val})`)
}
