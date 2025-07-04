/*
 * index.test.ts
 *
 * Created by Dr. Maximillian Dornseif 2023-01-31 in any-to-luxon 0.1.0
 * Copyright (c) 2023 HUDORA GmbH
 */

import { DateTime } from 'luxon'
import { describe, expect, it } from 'vitest'
import { dateTimeify, dateTimeifyTyped } from '../src/index'

describe('dateTimeify', () => {
  it('handles Strings', () => {
    expect(dateTimeify('2010-11-01')).toMatchInlineSnapshot(`"2010-11-01T00:00:00.000Z"`)
    expect(dateTimeify('2010-11-01 23:22:21.456789')).toMatchInlineSnapshot(`"2010-11-01T23:22:21.456Z"`)
    expect(dateTimeify('2010-11-01T23:22:21')).toMatchInlineSnapshot(`"2010-11-01T23:22:21.000Z"`)
    expect(dateTimeify('2010-11-01T23:22:21Z')).toMatchInlineSnapshot(`"2010-11-01T23:22:21.000Z"`)
    expect(dateTimeify('2022-02-01T15:53:43.388Z')).toMatchInlineSnapshot(`"2022-02-01T15:53:43.388Z"`)
    expect(dateTimeify('2021-04-21 11:06:39.814722+00:00')).toMatchInlineSnapshot(
      `"2021-04-21T11:06:39.814Z"`
    )
  })

  it('handles string timestamps - milliseconds', () => {
    // Test 13-digit millisecond timestamps as strings
    expect(dateTimeify('1314748800000')).toMatchInlineSnapshot(`"2011-08-31T00:00:00.000+00:00"`)
    expect(dateTimeify('1234567890123')).toMatchInlineSnapshot(`"2009-02-13T23:31:30.123+00:00"`)
    // Test 14-digit millisecond timestamps as strings
    expect(dateTimeify('12345678901234')).toMatchInlineSnapshot(`"2361-03-21T19:15:01.234+00:00"`)
  })

  it('handles string timestamps - seconds', () => {
    // Test 10-digit second timestamps as strings
    expect(dateTimeify('1314748800')).toMatchInlineSnapshot(`"2011-08-31T00:00:00.000+00:00"`)
    expect(dateTimeify('1234567890')).toMatchInlineSnapshot(`"2009-02-13T23:31:30.000+00:00"`)
    // Test 11-digit second timestamps as strings
    expect(dateTimeify('12345678901')).toMatchInlineSnapshot(`"2361-03-21T19:15:01.000+00:00"`)
    // Test 12-digit second timestamps as strings
    expect(dateTimeify('123456789012')).toMatchInlineSnapshot(`"5882-03-11T00:30:12.000+00:00"`)
  })

  it('handles moment.js objects', () => {
    const val = { toDate: () => new Date(2019, 12, 11, 10, 9, 8) }
    expect(dateTimeify(val)).toMatchInlineSnapshot(`"2020-01-11T10:09:08.000+00:00"`)
  })

  it('handles new Date()', () => {
    expect(dateTimeify(new Date(2019, 12, 1))).toMatchInlineSnapshot(`"2020-01-01T00:00:00.000+00:00"`)
  })

  it('handles null', () => {
    expect(dateTimeify(null)).toMatchInlineSnapshot(`null`)
  })

  it('handles undefined', () => {
    expect(dateTimeify(undefined)).toMatchInlineSnapshot(`undefined`)
  })

  it('handles luxon DateTime objects', () => {
    expect(dateTimeify(DateTime.fromISO('2020-01-11T10:09:08.000+00:00'))).toMatchInlineSnapshot(
      `"2020-01-11T10:09:08.000+00:00"`
    )
  })

  it('handles numbers - milliseconds', () => {
    // Large numbers (> 2^31) are treated as milliseconds
    expect(dateTimeify(1314748800000)).toMatchInlineSnapshot(`"2011-08-31T00:00:00.000+00:00"`)
    expect(dateTimeify(1234567890123)).toMatchInlineSnapshot(`"2009-02-13T23:31:30.123+00:00"`)
  })

  it('handles numbers - seconds', () => {
    // Small numbers (<= 2^31) are treated as seconds
    expect(dateTimeify(1314748800)).toMatchInlineSnapshot(`"2011-08-31T00:00:00.000+00:00"`)
    expect(dateTimeify(1234567890)).toMatchInlineSnapshot(`"2009-02-13T23:31:30.000+00:00"`)
  })

  it('handles objects with nested value property', () => {
    const nestedValue = { value: '2020-01-11T10:09:08.000+00:00' }
    expect(dateTimeify(nestedValue)).toMatchInlineSnapshot(`"2020-01-11T10:09:08.000Z"`)
    
    // Test deeply nested
    const deeplyNested = { value: { value: new Date(2019, 12, 1) } }
    expect(dateTimeify(deeplyNested)).toMatchInlineSnapshot(`"2020-01-01T00:00:00.000+00:00"`)
  })

  it('handles unknown types by returning them as-is', () => {
    const symbol = Symbol('test')
    expect(dateTimeify(symbol)).toBe(symbol)
    
    const func = () => 'test'
    expect(dateTimeify(func)).toBe(func)
    
    const arr = [1, 2, 3]
    expect(dateTimeify(arr)).toBe(arr)
    
    const plainObj = { foo: 'bar' }
    expect(dateTimeify(plainObj)).toBe(plainObj)
  })

  it('handles empty strings and invalid dates', () => {
    expect(dateTimeify('')).toBeInstanceOf(DateTime)
    expect(dateTimeify('invalid-date')).toBeInstanceOf(DateTime)
  })

  it('handles edge cases with numbers', () => {
    // Test boundary value around 2^31
    const maxInt32 = 2147483647
    expect(dateTimeify(maxInt32)).toMatchInlineSnapshot(`"2038-01-19T03:14:07.000+00:00"`)
    expect(dateTimeify(maxInt32 + 1)).toMatchInlineSnapshot(`"2038-01-19T03:14:08.000+00:00"`)
  })
})

describe('dateTimeifyTyped', () => {
  it('handles new Date()', () => {
    expect(dateTimeifyTyped(new Date(2019, 10, 1))).toMatchInlineSnapshot(`"2019-11-01T00:00:00.000+00:00"`)
  })

  it('handles valid Strings', () => {
    expect(dateTimeifyTyped('1234-05-06T07:08:09.123')).toMatchInlineSnapshot(`"1234-05-06T07:08:09.123Z"`)
    expect(dateTimeifyTyped('1234-05-06T07:08:09.123Z')).toMatchInlineSnapshot('"1234-05-06T07:08:09.123Z"')
    expect(dateTimeifyTyped('1234-05-06T07:08:09.123+00:00')).toMatchInlineSnapshot(
      '"1234-05-06T07:08:09.123Z"'
    )
    expect(dateTimeifyTyped('1234-05-06T07:08:09.123')).toMatchInlineSnapshot(`"1234-05-06T07:08:09.123Z"`)
    expect(dateTimeifyTyped('1234-05-06T07:08:09.123').toJSDate()).toMatchInlineSnapshot(
      `1234-05-06T07:08:09.123Z`
    )
  })

  it('handles timestamp strings', () => {
    // Test millisecond timestamps as strings
    expect(dateTimeifyTyped('1314748800000')).toMatchInlineSnapshot(`"2011-08-31T00:00:00.000+00:00"`)
    // Test second timestamps as strings
    expect(dateTimeifyTyped('1314748800')).toMatchInlineSnapshot(`"2011-08-31T00:00:00.000+00:00"`)
  })

  it('handles numbers', () => {
    // Test millisecond timestamps
    expect(dateTimeifyTyped(1314748800000)).toMatchInlineSnapshot(`"2011-08-31T00:00:00.000+00:00"`)
    // Test second timestamps
    expect(dateTimeifyTyped(1314748800)).toMatchInlineSnapshot(`"2011-08-31T00:00:00.000+00:00"`)
  })

  it('handles luxon DateTime objects', () => {
    const dt = DateTime.fromISO('2020-01-11T10:09:08.000+00:00')
    expect(dateTimeifyTyped(dt)).toMatchInlineSnapshot(`"2020-01-11T10:09:08.000+00:00"`)
  })

  it('handles moment.js objects', () => {
    const val = { toDate: () => new Date(2019, 12, 11, 10, 9, 8) }
    expect(dateTimeifyTyped(val)).toMatchInlineSnapshot(`"2020-01-11T10:09:08.000+00:00"`)
  })

  it('handles objects with nested value property', () => {
    const nestedValue = { value: '2020-01-11T10:09:08.000+00:00' }
    expect(dateTimeifyTyped(nestedValue)).toMatchInlineSnapshot(`"2020-01-11T10:09:08.000Z"`)
  })

  it('handles invalid Strings', () => {
    expect(dateTimeifyTyped('2030-40-50T:60:70:80')).toMatchInlineSnapshot(`null`)
    expect(dateTimeifyTyped('invalid-date')).toMatchInlineSnapshot(`null`)
    expect(dateTimeifyTyped('')).toMatchInlineSnapshot(`null`)
  })

  it('handles null', () => {
    expect(dateTimeifyTyped(null)).toMatchInlineSnapshot(`null`)
  })

  it('handles undefined', () => {
    expect(dateTimeifyTyped(undefined)).toMatchInlineSnapshot(`null`)
  })

  it('handles unparseable values', () => {
    expect(dateTimeifyTyped({ foo: 'bar' })).toMatchInlineSnapshot(`null`)
    expect(dateTimeifyTyped([1, 2, 3])).toMatchInlineSnapshot(`null`)
    expect(dateTimeifyTyped(Symbol('test'))).toMatchInlineSnapshot(`null`)
    expect(dateTimeifyTyped(() => 'test')).toMatchInlineSnapshot(`null`)
  })

  it('returns invalid DateTime for unparseable values', () => {
    const result = dateTimeifyTyped({ foo: 'bar' })
    expect(result).toBeInstanceOf(DateTime)
    expect(result.isValid).toBe(false)
    expect(result.invalidReason).toBe('unparsable')
  })

  it('handles objects that throw when converted to string', () => {
    const problematicObject = {
      toString: () => {
        throw new Error('Cannot convert to string')
      },
      valueOf: () => {
        throw new Error('Cannot convert to primitive')
      }
    }
    
    const result = dateTimeifyTyped(problematicObject)
    expect(result).toBeInstanceOf(DateTime)
    expect(result.isValid).toBe(false)
    expect(result.invalidReason).toBe('unparsable')
    expect(result.invalidExplanation).toContain('[object]')
  })
})
