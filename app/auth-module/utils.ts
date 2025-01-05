// utils functions

/**
 * Updates the search parameters of a URL based on the provided changes and returns
 * a new query string.
 *
 * This function creates a new `URLSearchParams` instance, applies the modifications
 * from the `changes` object, and returns the updated query string.
 * - If a parameter value is `undefined`, it will be removed.
 * - If a value is a `number`, it will be converted to a string.
 * - Special characters in values are URL-encoded to ensure proper formatting.
 *
 * @param {URLSearchParams} searchParams - The current search parameters to be updated.
 * @param {Record<string, string | number | undefined>} changes - An object containing the changes to apply.
 *    - The keys represent the parameter names.
 *    - The values can be:
 *        - `string` or `number` (the new value to set).
 *        - `undefined` (to remove the parameter).
 * @returns {string} The updated query string, URL-encoded and ready to be appended to a URL.
 *
 * @example
 * const currentParams = new URLSearchParams('foo=1&bar=2');
 * const changes = { foo: 10, baz: 3, bar: undefined };
 * const newQueryString = setSearchParamsString(currentParams, changes);
 * console.log(newQueryString); // Output: "foo=10&baz=3"
 *
 * @example
 * const currentParams = new URLSearchParams('name=John&age=30');
 * const changes = { name: undefined, age: 40 };
 * const newQueryString = setSearchParamsString(currentParams, changes);
 * console.log(newQueryString); // Output: "age=40"
 */
export function setSearchParamsString(
  searchParams: URLSearchParams,
  changes: Record<string, string | number | undefined>
) {
  const newSearchParams = new URLSearchParams(searchParams);

  for (const [key, value] of Object.entries(changes)) {
    if (value === undefined) {
      newSearchParams.delete(key);
      continue;
    }

    newSearchParams.set(key, String(value));
  }

  // Print string manually to avoid over-encoding the URL
  // Browsers are ok with $ nowadays
  return Array.from(newSearchParams.entries())
    .map(([key, value]) =>
      value ? `${key}=${encodeURIComponent(value)}` : key
    )
    .join("&");
}
