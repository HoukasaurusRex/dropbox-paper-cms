/**
 * @typedef {import('../index').DocWithFolderInfo} Doc
 */

/**
 * Filter Empty
 *
 * @description filters out empty docs
 * @param {[Doc]} docs
 * @returns {[Doc]} Docs
 */
exports.filterEmpty = docs =>
  docs.filter(
    doc => doc.folderInfo.folders && doc.folderInfo.folders.length > 1
  )

/**
 * Filter Folders
 *
 * @description Filters out docs not included in tabs list.
 * Since Dropbox Paper API gives only Full Dropbox access tokens,
 * this step is crucial in filtering out other Paper documents
 * not related to the current project.
 * @param {[Doc]} docs
 * @param {[String]} folders
 * @returns {[Doc]} Docs
 */
exports.filterFolders = (docs, folders) =>
  docs.filter(doc => folders.includes(doc.folderInfo.folders[1].name))
