/**
 * @typedef {import('../index').folders} folders
 * @typedef {import('../index').folderInfo} folderInfo
 * @typedef {import('../index').BasicDoc} BasicDoc
 * @typedef {import('../index').DocWithFolderInfo} DocWithFolderInfo
 * @typedef {import('../index').DocWithContent} DocWithContent
 * @typedef {import('../index').DocWithContentAndLocation} DocWithContentAndLocation
 *
 */
const path = require('path')
const fetch = require('node-fetch')
const promiseAllProps = require('promise-all-props')
const caseIt = require('case-it')

const { kebabCaseIt } = caseIt
const dropboxApiBaseUrl = 'https://api.dropboxapi.com/2/paper'
const getFolderInfoUrl = `${dropboxApiBaseUrl}/docs/get_folder_info`
const getMetaDataUrl = `${dropboxApiBaseUrl}/docs/get_metadata`
const downloadContentUrl = `${dropboxApiBaseUrl}/docs/download`

/**
 * Get Folder Name
 *
 * @description gets first-nested folder name from an array of folders
 * @param {folders} folders
 * @returns {String} Folder Name
 */
const getFolderName = folders => folders.slice(1)[0].name // ignore parent directories

/**
 *  Get Folder Path
 *
 * @description returns a path string from a paper api folderInfo object
 * @param {String} dir Path to content directory
 * @param {folderInfo} folderInfo
 * @returns {String} Path
 */
const getFolderPath = (dir, folderInfo) =>
  path.join(dir, getFolderName(folderInfo.folders))

/**
 * Paper API
 *
 * @description Fetches from Dropbox Paper API Endpoints.
 * This function should be able to be reusable across
 * all Dropbox Paper APIs.
 * @param {String} url API Endpoint URL
 * @param {String} token Dropbox API Generated Token
 * @param {{}} [body] Fetch Body
 * @param {{}} [headers] Fetch Headers
 * @returns {{}} Paper Data
 * @throws Fetch Error
 */
const paperAPI = async (
  url,
  token,
  body,
  headers = { 'Content-Type': 'application/json' }
) => {
  const options = {
    method: 'POST',
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`
    }
  }
  if (body) {
    options.body = JSON.stringify(body)
  }
  const res = await fetch(url, options)
  if (res.ok && body) {
    return res.json()
  } else if (res.ok) {
    return res.text()
  } else {
    const errorMsg = await res.text()
    throw new Error(errorMsg)
  }
}

/**
 * Append Folder Info
 *
 * @description appends folder info to docs
 * @param {[BasicDoc]} docs
 * @param {String} token Dropbox API Generated Token
 * @returns {Promise<DocWithFolderInfo>} Docs
 */
exports.appendFolderInfo = (docs, token) =>
  Promise.all(
    docs.doc_ids.map(id =>
      promiseAllProps({
        id,
        folderInfo: paperAPI(getFolderInfoUrl, token, { doc_id: id })
      })
    )
  )

/**
 * Append Doc Content
 *
 * @description appends content to docs
 * @param {[DocWithFolderInfo]} docs
 * @param {String} token Dropbox API Generated Token
 * @param {String} dir Path to content directory
 * @returns {Promise<[DocWithContent]>} Docs
 */
exports.appendDocContent = (docs, token, dir) =>
  Promise.all(
    docs.map(({ id, folderInfo }) => {
      const downloadContentHeaders = {
        'Dropbox-API-Arg': JSON.stringify({
          doc_id: id,
          export_format: 'markdown'
        })
      }
      return promiseAllProps({
        id,
        folders: folderInfo.folders,
        directory: getFolderPath(dir, folderInfo),
        metaData: paperAPI(getMetaDataUrl, token, { doc_id: id }),
        content: paperAPI(
          downloadContentUrl,
          token,
          undefined,
          downloadContentHeaders
        )
      })
    })
  )

/**
 * Append Doc Locations
 *
 * @description appends file locations to docs
 * @param {[DocWithContent]} docs
 * @returns {[DocWithContentAndLocation]} Docs
 */
exports.appendDocLocations = docs =>
  docs.map(doc => ({
    ...doc,
    location: path.join(doc.directory, `${kebabCaseIt(doc.metaData.title)}.md`)
  }))

exports.paperAPI = paperAPI
