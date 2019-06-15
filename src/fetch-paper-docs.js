/**
 * @typedef {import('../index.js').DocWithContentAndLocation} Doc
 */
const dotenv = require('dotenv-defaults')
const {
  paperAPI,
  appendFolderInfo,
  appendDocContent,
  appendDocLocations
} = require('./fetch-content')
const { filterEmpty, filterFolders } = require('./filter-content')

dotenv.config()
const dropboxApiBaseUrl = process.env.DROPBOX_API_BASE_URL
const listDocsUrl = `${dropboxApiBaseUrl}/docs/list`

/**
 * Fetch Paper Docs
 *
 * @description Fetches dropbox paper files and metaData from a list of dropbox folders.
 * Builds and returns a schema for Dropbox Paper documents that's easily integratable with most
 * static site generators.
 * @param {{dropboxApiToken:String, contentDir:String, folders:[String] }} options
 * @returns {[Doc]} Docs
 */
module.exports = ({ dropboxApiToken, contentDir, folders }) =>
  paperAPI(listDocsUrl, dropboxApiToken, {})
    .then(docs => appendFolderInfo(docs, dropboxApiToken))
    .then(docs => filterEmpty(docs))
    .then(docs => filterFolders(docs, folders))
    .then(docs => appendDocContent(docs, dropboxApiToken, contentDir))
    .then(docs => appendDocLocations(docs, dropboxApiToken))
