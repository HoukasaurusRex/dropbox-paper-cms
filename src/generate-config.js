/**
 * @typedef {import('dropbox-paper-cms').DocWithContentAndLocation} Doc
 */
const path = require('path')
const { kebabCaseIt } = require('case-it')
const { promises } = require('fs')

const { writeFile } = promises

/**
 * Only Unique
 *
 * @description Used with the filter prototype to return
 * only unique values in an array.
 * @param {*} value
 * @param {number} index
 * @param {[]} self
 * @returns {boolean} Is Unique
 */
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index
}

/**
 * Return Pages List
 *
 * @description returns a list of page titles
 * @param {[Doc]} docs
 * @param {String} tab
 * @returns {[String]} Pages List
 */
const returnPagesList = (docs, tab) => {
  const pages = ['']
  docs
    .filter(doc => doc.folders[1].name === tab)
    .forEach(doc => {
      const title = kebabCaseIt(doc.metaData.title)
      pages.push(title)
    })
  // TODO: provide custom sort options
  pages.sort()
  return pages
}

/**
 * Update Sidebar
 *
 * @description updates vueConfig with pages tabs and arrays
 * @param {[String]} pageLists
 * @param {JSON} vueConfig
 */
const updateSidebar = (pageLists, vueConfig) => {
  pageLists.forEach(list => {
    vueConfig.themeConfig.sidebar[list.tab] = list.pages
  })
}

/**
 * Generate Config File
 *
 * @description Generates a list of tabs from doc folder names
 * and writes individual page names and tabs to provided config file
 * in JSON format after a 'module.exports = ' method
 * @param {[Doc]} docs
 * @param {String} dir
 * @param {JSON} config
 * @returns {[Doc]} Docs
 */
module.exports = async (docs, dir, config) => {
  // TODO: support more static site generator config files
  if (!config) {
    throw new Error('Must provide a valid static site generator config file')
  }
  const tabs = docs.map(doc => doc.folders[1].name).filter(onlyUnique)
  const pageLists = tabs.map(tab => ({
    tab: `/${tab}/`,
    pages: returnPagesList(docs, tab)
  }))
  updateSidebar(pageLists, config)
  await writeFile(
    path.join(dir, 'vuepress/config.js'),
    `module.exports = ${JSON.stringify(config, undefined, 2)}`
  )
  return docs
}
