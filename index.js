/**
 * @typedef {String} id
 * @typedef {[{id:id,name:string}]} folders
 * @typedef {{folders:folders}} folderInfo
 * @typedef {{id:id}} BasicDoc
 * @typedef {{id:id,folderInfo:folderInfo}} DocWithFolderInfo
 * @typedef {{id:id,folders:folders,metaData:JSON,content:JSON}} DocWithContent
 * @typedef {{id:id,folders:folders,metaData:JSON,content:JSON,location:string}} DocWithContentAndLocation
 */

module.exports = {
  fetchPaperDocs: require('./src/fetch-paper-docs'),
  generateContent: require('./src/generate-content'),
  generateConfig: require('./src/generate-config')
}
