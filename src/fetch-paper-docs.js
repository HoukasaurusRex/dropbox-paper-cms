/**
 * @typedef {import('../index.js').DocWithContentAndLocation} Doc
 */
const {
  paperAPI,
  appendFolderInfo,
  appendDocContent,
  appendDocLocations
} = require('./fetch-content')
const { filterEmpty, filterFolders } = require('./filter-content')

const dropboxApiBaseUrl = 'https://api.dropboxapi.com/2/paper'
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
