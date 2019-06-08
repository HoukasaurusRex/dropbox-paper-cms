# Dropbox Paper CMS

[![David Dependencies Status](https://david-dm.org/pterobyte/dropbox-paper-cms.svg)](https://david-dm.org/pterobyte/dropbox-paper-cms)
[![prs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/pterobyte/dropbox-paper-cms/master)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Using [Dropbox Paper APIs](https://dropbox.github.io/dropbox-api-v2-explorer/) to generate static content your CMS website

*WARNING*: Sidebar auto-generation currently only compatible with vuepress

![dropbox](https://github.com/pterobyte/dropbox-paper-cms/assets/dropbox.png)
![vuepress](https://github.com/pterobyte/dropbox-paper-cms/assets/vuepress.png)

Dropbox Paper CMS was developed so that CMS sites could easily update their content without writing any code. One only needs to write documents in [Dropbox Paper](https://paper.dropbox.com/), and Dropbox Paper CMS  will fetche them in markdown, save them locally, then optionally update your CMS sidebar with new file paths (currently only available for vuepress, [PRs welcome](https://github.com/pterobyte/dropbox-paper-cms/.github/CONTRIBUTING.md/.github/CONTRIBUTING.md)).

## Contents  

- [Usage](#usage)
- [Examples](#examples)
- [Limitations](#limitations)
- [Contributing](#contributing)
- [Authors](#authors)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Usage

### Install

- With NPM

  ```sh
  npm install dropbox-paper-cms
  ```

- With Yarn

  ```sh
  yarn add dropbox-paper-cms
  ```

### Generate Dropbox Paper API Token

- Go to your [Dropbox App Console](https://www.dropbox.com/developers/apps)

- Create a new App

![Create App](https://github.com/pterobyte/dropbox-paper-cms/assets/create-app.png)

- Generate an access token

![Generate Access Token](https://github.com/pterobyte/dropbox-paper-cms/assets/generate-access-token.png)

### Options

Dropbox Paper CMS exports one function that takes an `options` parameter.

| Option              | Type            | Description                                                                             | Example                                               |
|-------------------  |---------------  |---------------------------------------------------------------------------------------  |------------------------------------------------------ |
| dropboxApiToken     | String          | Token generated from your Dropbox Paper App Console                                     | bwgnBMfB-LFFFYDNIYVb1zC6J6kBkvp_FwvISvJp989Tm9dx      |
| contentDir          | String          | Name or path of the directory you want dropbox-paper-cms to write markdown files to     | 'content'                                             |
| tabsList            | [String]   | An array of tab names matching the folders in your Dropbox Paper directory              | ['blog', 'portfolio', 'guide']                        |
| config (optional)   | JSON            | Optional config file to update sidebar content to. (Currently only supports vuepress)   | const config = require('./content/.vuepress/config')  |

## Examples

```js
const paperCMS = require('dropbox-paper-cms')
const vueConfig = require('./content/.vuepress/config')

const options = {
  dropboxApiToken: 'bwgnBMfB-LFFFYDNIYVb1zC6J6kBkvp_FwvISvJp989Tm9dx ', // NOTE: keep this token secret
  config: vueConfig,
  contentDir: 'content',
  tabsList: ['blog']
}

paperCMS(options)
  .then(docs => console.log(`Successfully wrote ${docs.length} docs!`))
  .catch(console.error)
```

## Limitations

- Dropbox API App tokens only support full access to dropbox paper account instead of limiting access to a single folder. This is why  you must specify the tabs to match the corresponding folders in your Dropbox Paper account.

- Sidebar content only generated in vuepress configuration files, so manual configuration is required for other CMS frameworks.

- Content is sorted alphabetically (or alphanumerically), but future versions will allow configuration.

- Paper has no webhooks or other mechanism to trigger a new publication on document changes. (See acknowledgements below for a guide on publishing through slack)

## Contributing

Please read [CONTRIBUTING.md](https://github.com/pterobyte/dropbox-paper-cms/.github/CONTRIBUTING.md/.github/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

- **JT Houk** - [Pterobyte](https://github.com/pterobyte)

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/pterobyte/dropbox-paper-cms/LICENSE) file for details

## Acknowledgments

This project was inspired by a project by [De Voorhoede](https://github.com/voorhoede/playbook) on using Dropbox Paper as a Content Management System.

[Guide To Publish Via Slack](https://www.voorhoede.nl/en/blog/dropbox-paper-as-a-headless-cms/)
