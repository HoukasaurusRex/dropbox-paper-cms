/**
 * @typedef {import('../index.js').DocWithContentAndLocation} Doc
 */
const {
  postGetPaperData,
  appendFolderInfo,
  appendDocContent,
  appendDocLocations
} = require('./fetch-content')
const { filterEmpty, filterFolders } = require('./filter-content')

const listDocsUrl = `${dropboxApiBaseUrl}/docs/list`

/**
 * Fetch Paper Docs
 *
 * @description fetches dropbox paper files and metaData from a list of dropbox folders
 * @param {{dropboxApiToken:String, contentDir:String, folders:[String] }} options
 * @returns {[Doc]} Docs
 */
module.exports = ({ dropboxApiToken, contentDir, folders }) =>
  postGetPaperData(listDocsUrl, dropboxApiToken)
    .then(docs => appendFolderInfo(docs, dropboxApiToken))
    .then(docs => filterEmpty(docs))
    .then(docs => filterFolders(docs, folders))
    .then(docs => appendDocContent(docs, dropboxApiToken, contentDir))
    .then(docs => appendDocLocations(docs, dropboxApiToken))
