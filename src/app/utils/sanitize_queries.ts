/**
 * Sanitizes an object by extracting specific keys and returning a new object with only those keys.
 *
 * @param object - The input object to sanitize.
 * @param keys - The keys to extract from the object.
 *
 * @returns A new object containing only the specified keys from the input object.
 */
const sanitize_queries = <T extends Record<string, unknown>, k extends keyof T>(
  object: T,
  keys: k[]
): Partial<T> => {
  // Create an empty object to store the sanitized data
  const finalObject: Partial<T> = {};

  // Loop through the provided keys and add the corresponding values from the input object
  keys.forEach((key) => {
    // Check if the object has the key to avoid undefined or invalid values
    if (object && Object.hasOwnProperty.call(object, key)) {
      finalObject[key] = object[key];
    }
  });

  // Return the sanitized object containing only the desired keys
  return finalObject;
};

export default sanitize_queries;
