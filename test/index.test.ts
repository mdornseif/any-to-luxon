/*
 * index.test.ts
 *
 * Created by Dr. Maximillian Dornseif 2023-01-31 in any-to-luxon 0.1.0
 * Copyright (c) 2023 HUDORA GmbH
 */

import { DateTime } from 'luxon'
import { dateTimeify, dateTimeifyTyped } from '../src/index'

describe('dateTimeify', () => {
  it('handles Strings', () => {
    expect(dateTimeify('2010-11-01')).toMatchInlineSnapshot(`"2010-11-01T00:00:00.000+00:00"`)
    expect(dateTimeify('2010-11-01 23:22:21.456789')).toMatchInlineSnapshot(`"2010-11-01T23:22:21.456+00:00"`)
    expect(dateTimeify('2010-11-01T23:22:21')).toMatchInlineSnapshot(`"2010-11-01T23:22:21.000+00:00"`)
    expect(dateTimeify('2010-11-01T23:22:21Z')).toMatchInlineSnapshot(`"2010-11-01T23:22:21.000+00:00"`)
    expect(dateTimeify('2022-02-01T15:53:43.388Z')).toMatchInlineSnapshot(`"2022-02-01T15:53:43.388+00:00"`)
    expect(dateTimeify('2021-04-21 11:06:39.814722+00:00')).toMatchInlineSnapshot(
      `"2021-04-21T11:06:39.814+00:00"`
    )
  })
  it('handles moment.js', () => {
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
  it('handles luxon', () => {
    expect(dateTimeify(DateTime.fromISO('2020-01-11T10:09:08.000+00:00'))).toMatchInlineSnapshot(
      `"2020-01-11T10:09:08.000+00:00"`
    )
  })
})

describe('dateTimeifyTyped', () => {
  it('handles new Date()', () => {
    expect(dateTimeifyTyped(new Date(2019, 10, 1))).toMatchInlineSnapshot(`"2019-11-01T00:00:00.000+00:00"`)
  })
  it('handles new Date()', () => {
    expect(dateTimeifyTyped('2030-40-50T:60:70:80')).toMatchInlineSnapshot(`null`)
  })

  it('handles null', () => {
    expect(dateTimeifyTyped(null)).toMatchInlineSnapshot(`null`)
  })
  it('handles undefined', () => {
    expect(dateTimeifyTyped(undefined)).toMatchInlineSnapshot(`null`)
  })
})
