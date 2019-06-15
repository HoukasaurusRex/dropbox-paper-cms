const dotenv = require('dotenv-defaults')
const paperCMS = require('dropbox-paper-cms')
const vueConfig = require('../content/.vuepress/config')

dotenv.config()

const contentDir = '../content'
const options = {
  dropboxApiToken: process.env.DROPBOX_API_TOKEN,
  contentDir,
  folders: ['players', 'adventures', 'items']
}

paperCMS
  .fetchPaperDocs(options)
  .then(docs => paperCMS.generateContent(docs, contentDir))
  .then(docs => paperCMS.generateConfig(docs, contentDir, vueConfig))
  .then(console.log)
  .catch(console.error)
