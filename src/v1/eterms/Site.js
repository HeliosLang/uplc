/**
 * Originating source position of a term
 *   - file: as number index so that code-mapping can easily be inlined
 *   - line: a number index so that code-mapping can easily be inlined
 *   - column: a number index so that code-mapping can easily be inlined
 *   - toString: string representation of a Site, eg. <file>:<line>:<col>
 * @typedef {{
 *   file: number
 *   line: number
 *   column: number
 *   toString: () => string
 * }} Site
 */
