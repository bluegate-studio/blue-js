# blue-js

A zero-dependency\* utility library for JavaScript. Safe type coercion, text sanitisation, i18n, structured logging, and server-side file operations — all in one import.

Works in **browsers** (SvelteKit, SPAs, any frontend) and **servers** (Node.js, Bun).

\*The only dependency is [chalk](https://github.com/chalk/chalk) for coloured terminal output.

---

## Install

Install directly from the git repository:

```bash
# HTTPS
bun add git+https://github.com/bluegate-studio/blue-js.git
```

```bash
# SSH
bun add git+ssh://git@github.com:bluegate-studio/blue-js.git
```

Or, if you have the repo cloned locally:

```bash
bun add /path/to/blue-js
```

## Import

```js
import * as utils from 'blue-js';
```

Everything is available under four namespaces:

| Namespace | Environment | Purpose |
|-----------|-------------|---------|
| `utils.hench` | Universal | Type safety, coercion, and general utilities |
| `utils.linguist` | Universal | i18n, latinisation, text sanitisation |
| `utils.console` | Universal | Structured dev logging with chalk |
| `utils.shell` | **Server-only** | File operations and shell commands |

> ⚠️ `utils.shell` uses Node.js built-ins (`node:fs`, `node:child_process`) and is only available in server environments (Node.js, Bun). **Importing `blue-js` in the browser is safe** — `utils.shell` gracefully resolves to an empty object, so shell functions simply won't be available. All other namespaces work in both environments.

---

## Core Pattern: `valid()` and `fathom()`

Most type modules follow the same two-function contract:

- **`valid( input )`** — Safe coercion. Always returns the expected type, or a sensible fallback (empty string, empty array, `0`, etc.). Never throws.
- **`fathom( input )`** — Type check. Returns `true` if the input matches the type, `false` otherwise.

```js
utils.hench.string.valid( anything )   // → always a string, '' if not
utils.hench.string.fathom( anything )  // → true if it's a string

utils.hench.array.valid( anything )    // → always an array, [] if not
utils.hench.object.valid( anything )   // → always an object, {} if not
utils.hench.number.valid( anything )   // → always a number, 0 if not
utils.hench.bool.valid( anything )     // → always a boolean
utils.hench.url.valid( anything )      // → valid URL string or ''
```

---

# API Reference

## `utils.hench` — Type Safety & Utilities

### `hench.string`

#### `string.valid( input )`

Coerces any input to a string. Numbers are converted via `.toString()`. Everything else returns `''`.

```js
string.valid( 'hello' )   // → 'hello'
string.valid( 42 )        // → '42'
string.valid( null )       // → ''
string.valid( undefined )  // → ''
```

#### `string.fathom( input )`

Returns `true` if the input is a string.

```js
string.fathom( 'hello' )  // → true
string.fathom( 42 )       // → false
```

#### `string.random({ len, type, seed })`

Generates a random string.

- **`len`** — Length of the string. Default: `8`.
- **`type`** — Character pool, pipe-separated: `'numeric'`, `'lower'`, `'upper'`, `'symbol'`, `'space'`. Default: `'numeric|lower|upper'`. Pass `'uuid'` to generate a UUID via `crypto.randomUUID()`.
- **`seed`** — Custom character pool (overrides `type`).

```js
string.random({ len: 12, type: 'numeric' })           // → '849173625481'
string.random({ len: 6, type: 'lower|upper' })         // → 'kQzBmT'
string.random({ type: 'uuid' })                        // → '550e8400-e29b-41d4-a716-446655440000'
string.random({ len: 4, seed: 'ABCD' })                // → 'BDAC'
```

#### `string.minify( input )`

Collapses all whitespace (newlines, tabs, non-breaking spaces, multiple spaces) into single spaces and trims.

```js
string.minify( '  hello\n\t  world  ' )  // → 'hello world'
```

#### `string.from_textarea( input )`

Converts a multiline string for storage: replaces newlines with `<br>`, tabs with spaces.

```js
string.from_textarea( 'line one\nline two' )  // → 'line one<br>line two'
```

#### `string.to_textarea( input )`

Reverses `from_textarea`: converts `<br>` and `<br />` back to newlines.

```js
string.to_textarea( 'line one<br>line two' )  // → 'line one\nline two'
```

#### `string.trim_to_words( input, max_word_count )`

Trims a string to the first N words. Appends `...` if truncated.

```js
string.trim_to_words( 'one two three four five', 3 )  // → 'one two three...'
string.trim_to_words( 'one two', 5 )                   // → 'one two'
```

#### `string.templify( template, obj )`

Replaces `{{key}}`, `%%key%%`, or `%key%` placeholders with values from an object. Unreplaced `{{key}}` placeholders are cleaned up (removed).

```js
string.templify( 'Hello {{name}}, you have {{count}} items', { name: 'Zeus', count: 5 } )
// → 'Hello Zeus, you have 5 items'
```

---

### `hench.array`

#### `array.valid( input, clone )`

Coerces to an array. Returns `[]` if input is not an array. Pass `true` or `'clone'` as the second argument to get a shallow copy.

```js
array.valid( [1, 2, 3] )          // → [1, 2, 3] (same reference)
array.valid( [1, 2, 3], true )    // → [1, 2, 3] (new array)
array.valid( 'not an array' )     // → []
```

#### `array.fathom( input )`

Returns `true` if the input is an array.

#### `array.empty( input )` / `array.not_empty( input )`

Checks if the array is empty or not. Safe on any input.

```js
array.empty( [] )           // → true
array.not_empty( [1, 2] )   // → true
array.empty( 'not array' )  // → true  (non-arrays are treated as empty)
```

#### `array.clone( input )`

Deep clone via `JSON.parse(JSON.stringify(...))`.

```js
const original = [{ a: 1 }, { b: 2 }];
const cloned = array.clone( original );
// cloned is a completely independent copy
```

#### `array.are_equal( a, b, sort )`

Compares two arrays element-by-element. By default, both arrays are sorted before comparison. Pass `sort: false` to compare in original order.

```js
array.are_equal( [1, 2, 3], [3, 2, 1] )         // → true  (sorted)
array.are_equal( [1, 2, 3], [3, 2, 1], false )   // → false (order matters)
```

#### `array.to_obj({ items, by })`

Converts an array of objects into a keyed object. Each item is stored under the value of its `by` property.

```js
const users = [
  { id: 'a1', name: 'Alice' },
  { id: 'b2', name: 'Bob' }
];
array.to_obj({ items: users, by: 'id' })
// → { a1: { id: 'a1', name: 'Alice' }, b2: { id: 'b2', name: 'Bob' } }
```

#### `array.filter( input, by )`

Token-based search filter. `by` is an array of filter descriptors, each with `keys` (which object properties to search) and `val` (the search string). The search string is tokenised and all tokens must be present.

```js
const items = [
  { name: 'John Doe', city: 'Istanbul' },
  { name: 'Jane Smith', city: 'Berlin' }
];
array.filter( items, [{ keys: ['name', 'city'], val: 'john istanbul' }] )
// → [{ name: 'John Doe', city: 'Istanbul' }]
```

#### `array.random( input )`

Returns a random element from the array.

```js
array.random( ['a', 'b', 'c'] )  // → 'b' (random)
```

#### `array.shuffle( input )`

Returns a new array with elements in random order (Fisher-Yates shuffle).

```js
array.shuffle( [1, 2, 3, 4, 5] )  // → [3, 1, 5, 2, 4] (random order)
```

#### `array.chunk( input, count )`

Splits an array into chunks of `count` elements each.

```js
array.chunk( [1, 2, 3, 4, 5], 2 )  // → [[1, 2], [3, 4], [5]]
```

#### `array.merge( arrays )`

Flattens an array of arrays into a single array. Optimised for large arrays.

```js
array.merge( [[1, 2], [3, 4], [5]] )  // → [1, 2, 3, 4, 5]
```

#### `array.append( that, to_this )`

Pushes all elements of `that` into `to_this` (mutates `to_this`). Elements are appended in reverse order.

```js
const target = [1, 2];
array.append( [3, 4], target );  // target is now [1, 2, 4, 3]
```

#### `array.unique({ list, by })`

Removes duplicates. For primitives, pass just `list`. For objects, pass `by` to deduplicate by a specific key.

```js
array.unique({ list: [1, 2, 2, 3, 3] })
// → [1, 2, 3]

array.unique({ list: users, by: 'id' })
// → deduplicated by id, sorted by the key
```

#### `array.to_json( input, indent )` / `array.from_json( input )`

Serialise an array to a JSON string, or parse a JSON string back to an array. Returns `''` or `[]` on failure.

```js
array.to_json( [1, 2, 3] )        // → '[1,2,3]'
array.to_json( [1, 2, 3], 2 )     // → '[\n  1,\n  2,\n  3\n]'
array.from_json( '[1,2,3]' )      // → [1, 2, 3]
```

#### `array.from_db( input )` / `array.to_db( input )`

Automatic type coercion for database rows based on column name suffixes. See [DB Serialisation](#db-serialisation) below.

#### `array.from_csv( input )`

> ⚠️ Currently disabled (returns `[]`). Will be re-enabled with a vanilla implementation.

---

### `hench.object`

#### `object.valid( input, clone )`

Coerces to a plain object. Returns `{}` if input is not an object. Pass `true` to get a shallow copy.

```js
object.valid( { a: 1 } )        // → { a: 1 }
object.valid( { a: 1 }, true )  // → { a: 1 } (shallow clone via spread)
object.valid( 'nope' )          // → {}
```

#### `object.fathom( input )`

Returns `true` if the input is a plain object.

#### `object.empty( input )` / `object.not_empty( input )`

Checks if the object has keys or not.

```js
object.empty( {} )           // → true
object.not_empty( { a: 1 })  // → true
```

#### `object.keys( input )` / `object.values( input )`

Safe wrappers around `Object.keys()` and `Object.values()`. Filters out falsy keys/values.

```js
object.keys( { a: 1, b: 2 } )    // → ['a', 'b']
object.values( { a: 1, b: 2 } )  // → [1, 2]
```

#### `object.values_empty( input )` / `object.values_not_empty( input )`

Checks if the object has any truthy values.

#### `object.nested({ of, from })`

Safe deep access into nested objects. `of` can be a dot-separated string or an array of keys.

```js
const data = { user: { profile: { name: 'Zeus' } } };

object.nested({ of: 'user.profile.name', from: data })  // → 'Zeus'
object.nested({ of: 'user.missing.path', from: data })   // → null
object.nested({ of: ['user', 'profile'], from: data })   // → { name: 'Zeus' }
```

#### `object.to_json( input, indent )` / `object.from_json( input )`

Serialise an object to a JSON string, or parse a JSON string back to an object. Returns `''` or `{}` on failure. If the input is already the target type, it's returned as-is.

```js
object.to_json( { a: 1 } )      // → '{"a":1}'
object.to_json( { a: 1 }, 2 )   // → '{\n  "a": 1\n}'
object.from_json( '{"a":1}' )   // → { a: 1 }
object.from_json( { a: 1 } )    // → { a: 1 } (already an object, returned as-is)
```

#### `object.are_equal( a, b )`

Deep equality check via JSON serialisation.

```js
object.are_equal( { a: 1 }, { a: 1 } )  // → true
object.are_equal( { a: 1 }, { a: 2 } )  // → false
```

#### `object.to_array( input )`

Converts an object to an array of its values. Each value gets a `__key` property with its original key name.

```js
object.to_array({ foo: { name: 'Foo' }, bar: { name: 'Bar' } })
// → [{ name: 'Foo', __key: 'foo' }, { name: 'Bar', __key: 'bar' }]
```

#### `object.from_xml( input )`

> ⚠️ Currently disabled (returns `{}`). Will be re-enabled with a vanilla implementation.

#### `object.compare_to_sort( a, b, criteria )`

Multi-criteria comparator for sorting arrays of objects. `criteria` is an array of key names. Append `:::desc` for descending order.

```js
const items = [
  { name: 'Charlie', age: 30 },
  { name: 'Alice',   age: 25 },
  { name: 'Bob',     age: 30 }
];
items.sort(( a, b ) => object.compare_to_sort( a, b, ['age:::desc', 'name'] ));
// → sorted by age descending, then name ascending
```

---

### `hench.number`

#### `number.valid( input, type )`

Coerces to a number. Returns `0` if the input can't be parsed. The `type` parameter controls parsing: `'int'` (default) uses `parseInt`, `'float'` uses `parseFloat`.

```js
number.valid( '42' )             // → 42
number.valid( '3.14', 'float' )  // → 3.14
number.valid( 'abc' )            // → 0
number.valid( NaN )              // → 0
number.valid( Infinity )         // → 0
```

#### `number.fathom( input, type )`

Returns `true` if the input can be parsed as a valid, finite number. Respects `type` (`'int'` or `'float'`).

#### `number.int( input )` / `number.float( input )`

Shorthand for `number.valid( input, 'int' )` and `number.valid( input, 'float' )`.

```js
number.int( '3.7' )    // → 3
number.float( '3.7' )  // → 3.7
```

#### `number.random( min, max )`

Returns a random integer between `min` and `max` (inclusive).

```js
number.random( 1, 10 )  // → 7 (random)
```

#### `number.nearest_in_array({ needle, haystack })`

Finds the element in `haystack` closest to `needle` by absolute difference.

```js
number.nearest_in_array({ needle: 7, haystack: [1, 5, 10, 15] })  // → 5
number.nearest_in_array({ needle: 12, haystack: [1, 5, 10, 15] }) // → 10
number.nearest_in_array({ needle: 7, haystack: [] })              // → undefined
```

#### `number.nearest_next({ needle, haystack })` / `number.nearest_prev({ needle, haystack })`

Finds the nearest element that is greater than (`nearest_next`) or less than (`nearest_prev`) the needle. Falls back to the closest element if no strictly greater/lesser value exists.

```js
number.nearest_next({ needle: 7, haystack: [1, 5, 10, 15] })  // → 10
number.nearest_prev({ needle: 7, haystack: [1, 5, 10, 15] })  // → 5
```

---

### `hench.bool`

#### `bool.valid( input )`

Coerces to a boolean. Returns `true` for `true`, `1`, or `'true'`. Everything else returns `false`.

```js
bool.valid( true )     // → true
bool.valid( 1 )        // → true
bool.valid( 'true' )   // → true
bool.valid( 'yes' )    // → false
bool.valid( 0 )        // → false
```

#### `bool.random()`

Returns a random boolean.

```js
bool.random()  // → true or false
```

---

### `hench.url`

#### `url.valid( input )`

Validates and normalises a URL string. Returns `''` if invalid. Strips trailing slashes. Passes through `mailto:` links as-is.

```js
url.valid( 'https://example.com/' )  // → 'https://example.com'
url.valid( 'not a url' )             // → ''
url.valid( 'mailto:hi@test.com' )    // → 'mailto:hi@test.com'
```

#### `url.fathom( input )`

Returns `true` if the input is a valid URL.

#### `url.query( input )`

Parses query parameters from a URL into an object.

```js
url.query( 'https://example.com?page=2&sort=name' )
// → { page: '2', sort: 'name' }

url.query( 'https://example.com' )   // → {}
url.query( 'not a url' )             // → {}
```

---

### `hench.regex`

#### `regex.escape( input )`

Escapes special regex characters in a string so it can be used safely in a `RegExp` constructor.

```js
regex.escape( 'price is $5.00 (USD)' )
// → 'price is \\$5\\.00 \\(USD\\)'
```

---

### `hench.currency`

#### `currency.to_display({ input, locale, currency })`

Converts an integer amount (in cents) to a locale-formatted currency string.

```js
currency.to_display({ input: 123456, locale: 'en-US', currency: 'USD' })
// → '$1,234.56'

currency.to_display({ input: 99900, locale: 'tr', currency: 'TRY' })
// → '₺999,00'
```

#### `currency.from_display({ input, accuracy })`

Converts a display string back to an integer. The `accuracy` parameter sets the decimal multiplier (default: 4).

```js
currency.from_display({ input: '$1,234.56', accuracy: 2 })  // → 123456
```

#### `currency.with_tax({ input, tax })`

Adds a tax percentage to an amount. `tax` is an integer (e.g., `20` for 20%). Default: `20`.

```js
currency.with_tax({ input: 10000, tax: 18 })  // → 11800
```

---

### `hench.moment`

Date/time utilities using timestamps (milliseconds since epoch) and a dash-separated format (`YYYY-MM-DD-HH-mm-ss-SSS`).

#### `moment.shift_zone({ timestamp, shift_by })`

Shifts a timestamp by a number of hours.

```js
moment.shift_zone({ timestamp: 1700000000000, shift_by: 3 })  // → shifts +3 hours
```

#### `moment.to_dash({ timestamp, shift_by })`

Converts a timestamp to the dash-separated format `YYYY-MM-DD-HH-mm-ss-SSS`. Optionally shifts the timezone first.

```js
moment.to_dash({ timestamp: 1700000000000 })
// → '2023-11-14-22-13-20-000'
```

#### `moment.from_dash({ timestamp, shift_by })`

Parses a dash-separated date string back to a timestamp.

```js
moment.from_dash({ timestamp: '2023-11-14-22-13-20-000' })
// → 1700000000000
```

#### `moment.from_string( input )`

Parses any date string into a timestamp via `new Date()`.

```js
moment.from_string( '2023-11-14T22:13:20.000Z' )  // → 1700000000000
moment.from_string( 'invalid' )                     // → 0
```

#### `moment.to_comps({ timestamp, shift_by })`

Breaks a timestamp into individual components.

```js
moment.to_comps({ timestamp: 1700000000000 })
// → { year: '2023', month: '11', day: '14', hour: '22', minute: '13', second: '20', millisecond: '000' }
```

---

### Top-Level `hench` Utilities

These are available directly on `utils.hench.*`:

#### `hench.type_of( input )`

Returns the constructor of the input (`String`, `Array`, `Object`, `Number`, etc.). Returns `''` on failure.

```js
hench.type_of( 'hello' )   // → String
hench.type_of( [1, 2] )    // → Array
hench.type_of( {} )         // → Object
hench.type_of( null )       // → ''
```

#### `hench.sleep( ms )`

Promise-based delay.

```js
await hench.sleep( 500 );  // waits 500ms
```

#### `hench.name_join( input )`

Joins `name_first` and `name_last` from an object. Falls back to `name` if present.

```js
hench.name_join({ name_first: 'John', name_last: 'Doe' })  // → 'John Doe'
hench.name_join({ name: 'Zeus' })                            // → 'Zeus'
hench.name_join({})                                          // → ''
```

#### `hench.id_from( input )`

Generates a URL/slug-safe ID from any string. Latinises, lowercases, replaces spaces with dashes, and strips non-alphanumeric characters.

```js
hench.id_from( 'Café Müller' )  // → 'cafe-muller'
hench.id_from( 'Hello World!' ) // → 'hello-world_'
```

#### `hench.tokenise( input )`

Generates comma-separated search tokens from any input (string or object). Latinises and lowercases.

```js
hench.tokenise( 'Hello World' )                 // → 'hello,world'
hench.tokenise({ name: 'Zeus', city: 'Istanbul' })  // → comma-separated tokens from JSON
```

#### `hench.compare_to_sort( l, r, desc )`

Universal comparator for `.sort()`. Handles strings (with latinisation) and numbers. Pass `true` or `'desc'` for descending order.

```js
['ç', 'a', 'b'].sort(( l, r ) => hench.compare_to_sort( l, r ))
// → ['a', 'b', 'ç'] (ç is latinised to c for comparison)
```

#### `hench.compare_to_filter({ tokens, obj })`

Returns `true` if all tokens are found within the object's search tokens. Used internally by `array.filter()`.

```js
hench.compare_to_filter({
  tokens: ['john', 'istanbul'],
  obj: { search_tokens: 'john,doe,istanbul' }
})
// → true
```

---

## `utils.linguist` — i18n & Sanitisation

### `linguist.latinise( input )`

Replaces accented/non-ASCII characters with their ASCII equivalents. Covers 500+ character mappings.

```js
linguist.latinise( 'çığöşüÇİĞÖŞÜ' )  // → 'cigosuCIGOSU'
linguist.latinise( 'crème brûlée' )     // → 'creme brulee'
```

### `linguist.latinise( input )`

Alias for `latinise`.

### `linguist.is_latin( input )`

Returns `true` if the string contains only ASCII characters (i.e., latinisation doesn't change it).

```js
linguist.is_latin( 'hello' )  // → true
linguist.is_latin( 'héllo' )  // → false
```

### `linguist.title_case( input, locale )`

Locale-aware title casing. Capitalises the first letter of each word, splitting on spaces, dots, hyphens, and apostrophes. Default locale: `'tr'`.

```js
linguist.title_case( 'hello world', 'en' )  // → 'Hello World'
linguist.title_case( 'istanbul', 'tr' )     // → 'İstanbul'
```

### `linguist.sanitise( input, criteria )`

Composable sanitisation pipeline. Pass an array of operation strings. Parameters within an operation are separated by `:::`.

```js
linguist.sanitise( input, ['clean:::minify', 'latinise', 'lower:::en'] )
linguist.sanitise( input, ['phone'] )
linguist.sanitise( input, ['search'] )
linguist.sanitise( input, ['substr:::0:::255', 'upper:::tr'] )
linguist.sanitise( input, ['float:::0:::100'] )
```

**Available operations:**

| Operation | Description |
|-----------|-------------|
| `email` | Minify, strip spaces/newlines, latinise, lowercase. Max 255 chars. |
| `subject` | Minify and strip email forwarding prefixes (Re:, Fwd:, etc.). |
| `search` | Minify, allow single spaces, strip newlines, latinise, lowercase. Max 255 chars. |
| `sql` | Strip SQL comments, collapse whitespace. |
| `url` | Minify, strip spaces/newlines, latinise, lowercase. Max 2048 chars. |
| `phone` | Keep only digits, spaces, parentheses, dashes. Preserves leading `+`. Max 24 chars. |
| `currency` | Keep only digits, spaces, `$`, commas, dots, dashes. Max 24 chars. |
| `numeric` | Parse to numeric string, preserving decimals and negative sign. |
| `float:::min:::max` | Parse to float, clamp to min/max if provided. |
| `int:::min:::max` | Parse to integer, clamp to min/max if provided. |
| `latinise` | Replace accented characters with ASCII equivalents. |
| `upper:::locale` | Uppercase with locale (default: `'tr'`). |
| `lower:::locale` | Lowercase with locale (default: `'tr'`). |
| `title:::locale` | Title case with locale (default: `'tr'`). |
| `trim` | Trim whitespace from both ends. |
| `substr:::start:::length` | Substring by start index and length. |
| `substring:::start:::end` | Substring by start and end index. |
| `space:::n` | Collapse runs of more than N spaces. |
| `white:::n` | Collapse runs of more than N whitespace characters. |
| `line:::n` | Collapse runs of more than N newlines. |
| `tab:::n` | Collapse runs of more than N tabs. |
| `clean:::minify` | Replace non-breaking spaces, collapse whitespace, trim. |
| `clean:::tags` | Strip HTML tags, replace with spaces. |

You can also pass **regex pairs** as `[pattern, replacement]` within the criteria array for custom replacements.

### `linguist.sanitise_input( el )`

DOM utility. Reads the `data-sanitisation` attribute from an input element (or its ancestor), sanitises the element's value, and writes it back. Preserves caret position.

```html
<input type="text" data-sanitisation="phone" />
```

### `linguist.listen_to_sanitise()`

DOM utility. Attaches a global `input` event listener to `document.body` that auto-sanitises any input element with a `data-sanitisation` attribute.

```js
linguist.listen_to_sanitise();  // call once on page load
```

### `linguist.get( input, locale, prefix )`

Looks up a localisation string from the built-in dictionary. Falls back through: prefixed key → unprefixed key → default locale → returns the input as-is.

```js
linguist.get( 'password', 'tr' )           // → 'Şifre'
linguist.get( 'password', 'en' )           // → 'Password'
linguist.get( 'unknown_key', 'en' )        // → 'unknown_key' (returned as-is)
linguist.get( 'submit', 'tr', 'form' )     // → looks up 'form--submit' first
```

### `linguist.current_locale( input )`

Detects or validates the current locale. Checks in order: the provided input → `navigator.language` → first available locale.

```js
linguist.current_locale( 'en' )  // → 'en' (if available)
linguist.current_locale()        // → detected from browser/system
```

---

## `utils.console` — Structured Logging

Timed, chalk-coloured structured logging with start/log/end lifecycle.

### `console.start({ id, title })`

Begins a new logging session with a unique `id` and display `title`. Records the start time.

### `console.log({ id, message, payload })`

Logs a message within an active session. Shows elapsed time since `start()`. Optionally prints a payload object.

### `console.end({ id })`

Ends the session, prints total elapsed time, and cleans up.

```js
const log_id = 'fetch_users';
utils.console.start({ id: log_id, title: 'Fetch Users' });
utils.console.log({ id: log_id, message: 'querying database', payload: { limit: 100 } });
utils.console.end({ id: log_id });
// Output:
// Fetch Users: started
// Fetch Users: 12ms passed
// querying database { limit: 100 }
// Fetch Users: completed in 15ms
```

### `console.silence( silent )`

Suppresses all structured logging when called with `true`. In browser environments, this also disables all `window.console` methods and `alert`.

```js
import * as utils from 'blue-js';
utils.console.silence( true );  // done — all logging suppressed
```

**Silencing on the server:** Set `BLUE_CONSOLE_SILENT=true` in your environment. Logging is silenced automatically at import time — no API call needed.

---

## `utils.shell` — Server-Only Utilities

> 🚨 **Server-only.** Uses `node:fs` and `node:child_process`. Importing `blue-js` in the browser is safe — `utils.shell` resolves to an empty object — but shell functions are only available in Node.js/Bun.

### `shell.base64_to_file({ base64, filename, folder, base_path, base_url })`

Saves a base64-encoded image to disk. Supports JPEG, PNG, and GIF. Returns `{ url, path }` on success.

```js
await shell.base64_to_file({
  base64: 'data:image/png;base64,iVBOR...',
  filename: 'avatar',
  folder: 'uploads',
  base_path: '/var/www/static',
  base_url: 'https://cdn.example.com/static'
});
// → { url: 'https://cdn.example.com/static/uploads/avatar.png', path: '/var/www/static/uploads/avatar.png' }
```

If the input is already a URL (starts with `http`), it returns `{ url: input }` without saving.

### `shell.move({ from, to })` / `shell.rename({ from, to })`

Move or rename a file. `rename` is an alias for `move`.

```js
await shell.move({ from: '/tmp/file.txt', to: '/data/file.txt' });
```

### `shell.copy({ from, to })`

Copy a file.

```js
await shell.copy({ from: '/data/original.txt', to: '/data/backup.txt' });
```

### `shell.files_in({ folder, filter, recursive })`

Lists files in a directory. Uses the `find` command. Returns a sorted array of file paths.

```js
await shell.files_in({ folder: '/uploads', filter: '*.png', recursive: true })
// → ['/uploads/avatar.png', '/uploads/photos/cover.png']
```

### `shell.node( cmd )`

Executes a shell command and returns stdout as a string.

```js
const result = await shell.node( 'whoami' );  // → 'zeus'
```

### `shell.background( cmd )`

Spawns a detached background process. The process runs independently and is not awaited.

```js
shell.background( 'node long-running-task.js' );
```

### `shell.dir( path )`

Ensures a directory exists. Creates it recursively if needed. Returns the path on success, `''` on failure.

```js
shell.dir( '/data/uploads/2024' );  // creates all intermediate directories
```

---

## DB Serialisation

`array.from_db()` and `array.to_db()` automatically coerce values based on column name suffixes:

| Suffix | Type | `from_db` | `to_db` |
|--------|------|-----------|---------|
| `__s` | string | `string.valid()` | `string.valid()` |
| `__n` | number | `number.valid()` | `number.valid()` |
| `__i` | integer | `number.int()` | `number.int()` |
| `__f` | float | `number.float()` | `number.float()` |
| `__b` | boolean | `bool.valid()` | `0` or `1` |
| `__j` | JSON | `object.from_json()` | `object.to_json()` |
| `__a` | array | parsed from JSON | serialised to JSON |
| `__o` | object | parsed from JSON | serialised to JSON |
| `__u` | URL | `url.valid()` | `url.valid()` |
| `__` prefix | passthrough | as-is | as-is |

```js
// Database rows come in with string values:
const rows = [{ name__s: 'Zeus', age__i: '30', active__b: '1', config__j: '{"theme":"dark"}' }];

array.from_db( rows )
// → [{ name__s: 'Zeus', age__i: 30, active__b: true, config__j: { theme: 'dark' } }]

array.to_db( rows )
// → [{ name__s: 'Zeus', age__i: 30, active__b: 1, config__j: '{"theme":"dark"}' }]
```

---

## License

MIT
