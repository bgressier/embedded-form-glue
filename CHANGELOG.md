# Change log

# 1.3.0

- [feat] Multiple loadLibrary method calls securization
  
# 1.2.0

- [fix] Wait for KR ready

# 1.1.0

- [feat] publicKey update with loadLibrary

# 1.0.0

- [chore] Stable version (0.3.4)

# 0.3.4

- Hash validation examples
- Server side example
- @types configuration for typescript
- Error feedback improvements
- Migration from Travis to CircleCI
- Migration from selenium to TestCafe

# 0.3.3

- Fix when the body is not inside the DOM (happen sometime with some frameworks)

# 0.3.2

- do not add script tag if already exits (when library is removed and re-added)

# 0.3.1

- Fix 'es6-promise/auto' dependency error

## 0.3.0

- Fix transpiling issue with nuxt.js

## 0.2.8

- Fix vulnerabilities
- compiled target is not transpiled to ECMA5 (to avoid IE11 issues)

## 0.2.7

- remove default credentials
- trigger a console error log if credentials are not updated

## 0.2.6

- add webpack rules to transpile en ES5
- Update Glue class to singleton pattern

## 0.2.5

- back to EC6/ app/index.js as main entry point
- fix multi-loading errors

## 0.2.4

- add kr-spa-mode to true by default
- no default formToken defined in loadLibrary
- main entry point is now the dist file en ES5

## 0.2.0

- initial version
