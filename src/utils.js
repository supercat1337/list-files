// @ts-check

/**
 *
 * @param {*} e
 * @returns {Error}
 */
export function getError(e) {
    let err = e instanceof Error ? e : new Error(String(e));
    return err;
}
