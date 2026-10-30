/**
 * Decompress JSON from a gzipped tarball (.tar.gz).
 * 
 * Reads a gzipped tarball:
 * 1. Unzip it
 * 2. Convert to utf-8
 * 3. Split files using the \0star separator
 * 4. Trim files until JSON markup start/end ({})
 * 5. JSON parse
 * 
 * @param raw The gzipped tarball buffer
 * @returns An array of parsed JSON objects from the tarball
 * 
 * @example
 * ```ts
 * import { utils } from 'lambda-toolkit';
 * const { untarJsonGz } = utils;
 * 
 * const buffer = await readFile('archive.tar.gz');
 * const data = untarJsonGz(buffer);
 * ```
 */
export function untarJsonGz(raw: Buffer): unknown[];
