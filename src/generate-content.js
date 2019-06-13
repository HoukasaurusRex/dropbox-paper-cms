/**
 * @typedef {import('dropbox-paper-cms').DocWithContentAndLocation} Doc
 */

const { promises } = require('fs')

const { mkdir, writeFile } = promises

/**
 * JSON to Frontmatter
 *
 * @description converts json to frontmatter used in markdown headers
 * @param {JSON} json
 * @returns {String} Frontmatter String
 */
const jsonToFrontmatter = json => `---\n${JSON.stringify(json, null, 2)}\n---\n`

/**
 * Save Docs Locally
 *
 * @description Write docs to markdown files with JSON metaData frontmatter.
 * The docs will preserve their original file trees defined in Dropbox Paper.
 * @param {[Doc]} docs
 * @param {String} dir Path to content directory
 * @returns {[Doc]} Docs
 */
module.exports = (docs, dir) => {
  docs.forEach(doc => {
    mkdir(doc.directory, { recursive: true }).then(() =>
      writeFile(
        doc.location,
        `${jsonToFrontmatter(doc.metaData)}${doc.content}`
      )
    )
    writeFile(
      `${dir}/meta-tree.json`,
      JSON.stringify(
        docs.map(({ id, folders, metaData, location }) => ({
          id,
          folders,
          content: { metaData },
          location
        }))
      )
    )
  })
  return docs
}
