export type Success<T> = { success: true; failure: false; data: T; };
export type Failure = { success: false; failure: true; error: Error };

/**
 * creates a Success object
 * 
 * @param data result from a successful function
 * @returns a Success object
 */
export function Success<T>(data: T): Success<T> {
	return { success: true, failure: false, data };
}

/**
 * creates a Failure object
 * 
 * @param error result from a failed function
 * @returns a Failure object
 */
export function Failure(error: unknown): Failure {
	return {
		success: false,
		failure: true,
		error: error instanceof Error ? error :
			new Error(typeof error === 'string' ? error : JSON.stringify(error))
	};
}

/**
* Executes a function and returns a result object indicating success or failure.
*
* @param fn - The function to be executed.
* @returns A result object indicating success (with data) or failure (with error).
*/
export function Try<T>(fn: () => T): Extract<T, Promise<unknown>> extends never ? Failure | Success<T> : Promise<Failure | Success<Awaited<T>>>;
/**
* Executes a function and returns a result object indicating success or failure.
*
* @param fn - The function to be executed.
* @returns A result object indicating success (with data) or failure (with error).
*/
export function Try<T>(fn: () => T): Failure | Success<T> | Promise<Failure | Success<T>> {
	try {
		const result = fn();
		if (result instanceof Promise) return result.then(Success, Failure)

		return Success(result);
	} catch (error: unknown) {
		return Failure(error);
	}
}
