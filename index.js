/**
 * @typedef {{id:string,folderInfo:{folders:[]}}} DocWithFolderInfo
 * @typedef {{id:string,folders:[{}],metaData:{},content:string}} DocWithContent
 * @typedef {{id:string,folders:[{}],metaData:{},content:string,location:string}} Doc
 */
const path = require('path')
const { mkdir, writeFile } = require('fs').promises
const fetch = require('node-fetch')
const promiseAllProps = require('promise-all-props')
const { kebabCaseIt } = require('case-it')

const dropboxApiBaseUrl = 'https://api.dropboxapi.com/2/paper'
const listDocsUrl = `${dropboxApiBaseUrl}/docs/list`
const getFolderInfoUrl = `${dropboxApiBaseUrl}/docs/get_folder_info`
const getMetaDataUrl = `${dropboxApiBaseUrl}/docs/get_metadata`
const downloadContentUrl = `${dropboxApiBaseUrl}/docs/download`

let token
let vueConfig
let dir
let tabs

/**
 * JSON to Frontmatter
 * 
 * @description converts json to frontmatter used in markdown headers
 * @param {{}} json 
 * @returns {String} Frontmatter String
 */
const jsonToFrontmatter = json => `---\n${ JSON.stringify(json, null, 2) }\n---\n`;

/**
 * Get Folder Name
 * 
 * @description gets first-nested folder name from array of folders
 * @param {[]} folders 
 * @returns {String} Folder Name
 */
const getFolderName = (folders) => folders.slice(1)[0].name // slice out parent directory

/**
 *  Get Folder Path
 * 
 * @description returns a path string from a paper api folderInfo object
 * @param {{ folders:[] }} folderInfo 
 * @returns {String} Path
 */
const getFolderPath = (dir, folderInfo) => path.join(dir, getFolderName(folderInfo.folders))


/**
 * POST Get Paper Content
 * 
 * @description downloads content of document in markdown
 * @param {String} url 
 * @param {String} docId 
 * @returns {Promise<String>} Content
 */
const postGetPaperContent = async(url, docId) => {
  const options = {
    method: 'POST',
    headers: { 
      'Dropbox-API-Arg': JSON.stringify({
        doc_id: docId,
        export_format: 'markdown',
      }),
      'Authorization': `Bearer ${token}`
    },
  }
  const res = await fetch(url, options)
  if (res.ok) {
    return res.text()
  }
  const errorMsg = await res.text()
  throw new Error(errorMsg)
}

/**
 * POST Get Paper Data
 * 
 * @description gets document data from paper api
 * @param {String} url 
 * @param {{}} body
 * @returns {{}} Paper Data
 */
const postGetPaperData = async(url, body = {}) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(body)
  }
  const res = await fetch(url, options)
  if (res.ok) {
    return res.json()
  }
  const errorMsg = await res.text()
  throw new Error(errorMsg)
}

/**
 * Update Sidebar
 *
 * @description updates vueConfig with pages tabs and arrays
 * @param {[String]} pageLists
 */
const updateSidebar = (pageLists) => {
  pageLists.forEach((list) => {
    vueConfig.themeConfig.sidebar[list.tab] = list.pages
  })
}

/**
 * Only Unique
 * @param {*} value 
 * @param {number} index 
 * @param {[]} self 
 * @returns {boolean} Is Unique
 */
function onlyUnique(value, index, self) { 
  return self.indexOf(value) === index;
}

/**
 * Return Pages List
 * 
 * @description returns a list of page titles
 * @param {[Doc]} docs 
 * @returns {[String]} Pages List
 */
const returnPagesList = (docs, tab) => {
  const pages = ['']
  docs
    .filter((doc) => doc.folders[1].name === tab)
    .forEach((doc) => {
      const title = kebabCaseIt(doc.metaData.title)
      pages.push(title)
    })
  pages.sort()
  return pages
}

/**
 * Append Folder Info
 * 
 * @description appends folder info to docs
 * @param {[{id:string}]} docs 
 * @returns {Promise<DocWithFolderInfo>} Docs
 */
const appendFolderInfo = (docs) => Promise.all(
  docs.doc_ids.map(id => promiseAllProps({
    id,
    folderInfo: postGetPaperData(getFolderInfoUrl, { doc_id: id })
  }))
)

/**
 * Filter Empty
 * 
 * @description filters out empty docs
 * @param {[DocWithFolderInfo]} docs 
 * @returns {[DocWithFolderInfo]} Docs
 */
const filterEmpty = (docs) => docs.filter(doc => doc.folderInfo.folders && doc.folderInfo.folders.length > 1)

/**
 * Filter Docs
 * 
 * @description filters out irrelevant docs
 * @param {[DocWithFolderInfo]} docs 
 * @returns {[DocWithFolderInfo]} Docs
 */
const filterDocs = (docs) => docs.filter(doc => tabs.includes(doc.folderInfo.folders[1].name))


/**
 * Append Doc Content
 * 
 * @description appends content to docs
 * @param {[DocWithFolderInfo]} docs
 * @returns {Promise<[DocWithContent]>}  Docs
 */
const appendDocContent = (docs) => Promise.all(
  docs.map(({ id, folderInfo }) => promiseAllProps({
    id,
    folders: folderInfo.folders,
    directory: getFolderPath(dir, folderInfo),
    metaData: postGetPaperData(getMetaDataUrl, { doc_id: id }),
    content: postGetPaperContent(downloadContentUrl, id),
  }))
)

/**
 * Append Doc Locations
 * 
 * @description appends file locations to docs
 * @param {[DocWithFolderInfo]} docs
 * @returns {[DocWithContent]}
 */
const appendDocLocations = (docs) => docs.map((doc) => ({
  ...doc,
  location: path.join(doc.directory, `${kebabCaseIt(doc.metaData.title)}.md`)
}))

/**
 * Save Docs Locally
 * 
 * @description writes docs to files locally
 * @param {[Doc]} docs 
 * @returns {[Doc]} Docs
 */
const saveDocsLocally = (docs) => {
  docs.forEach(doc => {
    mkdir(doc.directory, { recursive: true })
      .then(() => 
        writeFile(doc.location, `${jsonToFrontmatter(doc.metaData)}${doc.content}`))

    writeFile(`${dir}/meta-tree.json`, JSON.stringify(
      docs.map(({ id, folders, metaData, location }) => ({
        id,
        folders,
        content: { metaData },
        location,
      }))
    ))
  })
  return docs
}

/**
 * Generate Sidebar Content
 *
 * @description filters folders out from docs and adds page names and tabs to vueconfig
 * @param {[Doc]} docs
 * @returns {[Doc]} Docs
 */
const generateSidebarContent = async(docs) => {
  const tabs = docs
    .map(doc => doc.folders[1].name)
    .filter(onlyUnique)
  const pageLists = tabs.map((tab) => ({
    tab: `/${tab}/`,
    pages: returnPagesList(docs, tab)
  }))
  updateSidebar(pageLists)
  console.log(JSON.stringify(pageLists, undefined, 2))
  await writeFile(`${dir}/.vuepress/config.js`, `module.exports = ${JSON.stringify(vueConfig, undefined, 2)}`)
  return docs
}

/**
 * Paper CMS
 * 
 * @description fetches dropbox paper files in markdown, writes to files in contentDir, then updates CMS config sidebar with new file paths
 * @param {String} dropboxApiToken API token for Dropbox API
 * @param {JSON} config CMS JSON or JS config file
 * @param {String} contentDir relative path to content directory
 * @returns {[Doc]} Docs
 */
const paperCMS = ({dropboxApiToken, config, contentDir, tabsList}) => {
  token = dropboxApiToken
  vueConfig = config
  dir = contentDir
  tabs = tabsList
  return postGetPaperData(listDocsUrl)
    .then(appendFolderInfo)
    .then(filterEmpty)
    .then(filterDocs)
    .then(appendDocContent)
    .then(appendDocLocations)
    .then(saveDocsLocally)
    .then(generateSidebarContent)
}

module.exports = paperCMS