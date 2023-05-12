`any-to-luxon.dateTimeify()` takes any value and tries to parse 
it into a [luxon](https://moment.github.io/luxon/#/) `DateTime` object.

If parsing fails, it returns the unchanged value. It is optimized for usage
with data returned by databases. First usecase was
data in Google Cloud Datastore where every generation of
client libraries messes up date objects in new and interesting ways.

any-to-luxon tries to follow modern (ES2020 etc.) practices and is Typescript and ESM friendly. 
No monkey-patching of built-in prototypes.

## See also

* https://github.com/kensnyder/luxon-parser
