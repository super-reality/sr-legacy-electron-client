/**
 * This file basically swaps the index depending on the context
 * Mainly because for web builds we dont require anything from background/electron/nodejs.
 *
 * See module-resolver-file.js
 */
import "./electronIndex";
import "./webIndex";
