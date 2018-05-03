import Handlebars from 'handlebars'
import helpers from './helpers'
import config from './config'
import './HandlebarsHelpers'

class Builder {
  constructor() {
    this.name = null
    this.version = null
    this.templateCache = new Map()
    this.templateOptions = { data: {} }
    helpers.loadCoreHelpers()
  }

  registerTheme(config, theme) {
    this.setThemeName(theme.name)
    this.setThemeVersion(theme.version)
    this.registerFiles(theme.files)

    let blog = config.site || {}
    blog.url = config.urls.site
    blog.cover_image = blog.cover
    blog.navigation = config.navigation || []
    blog = Object.assign({}, blog, config.socialnetwork)

    this.templateOptions = {
      data: {
        blog: blog,
      },
    }
  }

  registerFiles(themeFiles) {
    console.info('templatePlugin - Builder:registerFiles')
    console.log('templatePlugin - Builder:registerFiles', themeFiles)
    const LAYOUT_PATTERN = /{{!<\s+([A-Za-z0-9\._\-\/]+)\s*}}/
    themeFiles.forEach(file => {
      if (file.path.indexOf('partials/') === 0) {
        Handlebars.registerPartial(file.name, file.content)
      } else {
        let data = {
          name: file.name,
          template: Handlebars.compile(file.content),
        }

        let matches = file.content.match(LAYOUT_PATTERN)
        if (matches) {
          data.layout = matches[1]
        }

        this.templateCache.set(file.name, data)
      }
    })
  }

  template(templateName, data, context) {
    console.info('templatePlugin - Builder:template')
    console.log('templatePlugin - Builder:template', templateName, data, context)
    config.set(context)
    let templateCache = this.templateCache.get(templateName)
    let htmlContent = templateCache.template(data, this.templateOptions)

    if (templateCache.layout) {
      data.body = htmlContent
      templateCache = this.templateCache.get(templateCache.layout)
      htmlContent = templateCache.template(data, this.templateOptions)
    }

    return htmlContent
  }

  setThemeName(name) {
    this.name = name
  }

  getThemeName() {
    return this.name
  }

  getThemeVersion() {
    return this.version
  }
  setThemeVersion(version) {
    this.version = version
  }

  isTemplateAvailable(template) {
    return this.templateCache.get(template)
  }
}

export default new Builder()
