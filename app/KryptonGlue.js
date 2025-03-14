import 'es6-promise/auto'
import whenDefined from './tools/whenDefined'

class Glue {
  constructor() {
    // Singleton
    if (!!Glue.instance) return Glue.instance

    Glue.instance = this

    this._name = 'Krypton Glue'
    this.configuration = {}
    this.domain = null
    this.formToken = null
    this.publicKey = null
    this.loaded = false
    this.loading = false

    return this
  }

  loadLibrary(domain, publicKey, formToken = null) {
    const domainRegex = /^(?:http(s)?:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/g
    const pubKeyRegex = /^\d{2,8}:(|test)publickey_.+$/g

    if (this.loaded) return this.getKrypton(publicKey)
    if (!domain) return Promise.reject('Domain not defined')
    if (!publicKey) return Promise.reject('Public key not defined')

    if (!domainRegex.test(domain)) {
      console.error('Domain format should be https://domain.name')
      return Promise.reject(`[${domain}] is not a valid endpoint domain`)
    }

    if (!pubKeyRegex.test(publicKey)) {
      console.error('Public key format should be shopId:[test]publickey_*')
      return Promise.reject(`[${publicKey}] is not a valid public key`)
    }

    this.domain = domain
    this.publicKey = publicKey
    this.formToken = formToken

    if (this.domain && this.publicKey) return this.loadKryptonClient()

    return Promise.reject('The library cannot be loaded')
  }

  loadKryptonClient() {    
    if (!this.loading) {
      const publicKey = this.publicKey
      let domain = this.domain
      this.loading = true
   
      const script = document.createElement('script')
      script.type = 'text/javascript'

      // Domain must end with slash
      if (!/^.+\/$/.test(domain)) domain += '/'

      script.src = `${domain}static/js/krypton-client/V4.0/stable/kr-payment-form.min.js`
      script.setAttribute('kr-public-key', publicKey)
      script.setAttribute('kr-spa-mode', 'true')

      if (this.formToken) script.setAttribute('kr-form-token', this.formToken)

      // Check if the library is already present
      const $script = document.querySelector(`script[src="${script.src}"]`)

      // Append it to body if it's not already loaded
      if (!$script && document.body) document.body.appendChild(script)
      else if (!document.body) console.warn('document.body is undefined')
    }
    
    return new Promise((resolve) => {
      whenDefined(window, 'KR', () => {
        whenDefined(window.KR, 'ready', () => {
          this.loaded = true
          this.loading = false
          resolve({ KR: window.KR })
        })
      })
    })
  }

  getKrypton(publicKey) {
    return new Promise((resolve, reject) => {
      if (publicKey && publicKey !== this.publicKey) {
        window.KR.setFormConfig({ publicKey }).then(resolve).catch(reject)
      } else {
        resolve({ KR: window.KR })
      }
    })
  }
}

export default new Glue()
