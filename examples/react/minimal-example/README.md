# Payment form from scratch with react-cli

This page explains how-to create a dynamic payment form from scratch using
React and react-cli and embedded-form-glue library.

## Requirements

You need to install [node.js LTS version](https://nodejs.org/en/).

## Create the project

First, create the react app HelloWorld project:

```sh
npx create-react-app minimal-example
```

Enter on the project

```sh
cd minimal-example
```

Add the dependency with yarn:

```bash
# with npm
npm install --save @lyracom/embedded-form-glue
# or with yarn
yarn add @lyracom/embedded-form-glue
```

Run and test it:

```sh
npm run start
```

see the result on http://localhost:3000/

For more details, see https://cli.vuejs.org/guide/creating-a-project.html

## add the payment form

First you have to add 2 theme files:

| File              | Description                                                                   |
| ----------------- | ----------------------------------------------------------------------------- |
| classic-reset.css | default style applied before the [Lyra Javascript Library][js link] is loaded |
| classic.js        | theme logic, like waiting annimation on submit button, ...                    |

Add them in public/index.html in the the HEAD section:

```javascript
<!-- theme and plugins. should be loaded in the HEAD section -->
<link rel="stylesheet"
href="~~CHANGE_ME_ENDPOINT~~/static/js/krypton-client/V4.0/ext/classic-reset.css">
<script
    src="~~CHANGE_ME_ENDPOINT~~/static/js/krypton-client/V4.0/ext/classic.js">
</script>
```

**note**: Replace **[CHANGE_ME]** with your credentials and end-points.

For more information about theming, take a look to [Lyra theming documentation][js themes]

Replace the src/App.css styles to:

```html
h1 { margin: 40px 0 20px 0; width: 100%; text-align: center; } .container {
display: flex; justify-content: center; }
```

Next, update **src/App.js** to:

```js
import React, { Component } from "react";
import KRGlue from "@lyracom/embedded-form-glue";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="form">
        <h1>Payment form</h1>
        <div className="container">
          <div id="myPaymentForm"></div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    const endpoint = "~~CHANGE_ME_ENDPOINT~~";
    const publicKey = "~~CHANGE_ME_PUBLIC_KEY~~";
    const formToken = "DEMO-TOKEN-TO-BE-REPLACED";

    KRGlue.loadLibrary(endpoint, publicKey) /* Load the remote library */
      .then(({ KR }) =>
        KR.setFormConfig({
          /* set the minimal configuration */
          formToken: formToken,
          "kr-language": "en-US" /* to update initialization parameter */
        })
      )
      .then(({ KR }) =>
        KR.addForm("#myPaymentForm")
      ) /* add a payment form  to myPaymentForm div*/
      .then(({ KR, result }) =>
        KR.showForm(result.formId)
      ); /* show the payment form */
  }
}

export default App;
```

Your payment form will be added to #myPaymentForm element.

## Your first transaction

The payment form is up and ready, you can try to make a transaction using
a test card with the debug toolbar (at the bottom of the page).

If you try to pay, you will have the following error: **CLIENT_998: Demo form, see the documentation**.
It's because the **formToken** you have defined using **KR.setFormConfig** is set to **DEMO-TOKEN-TO-BE-REPLACED**.

you have to create a **formToken** before displaying the payment form using Charge/CreatePayment web-service.
For more information, please take a look to:

- [Embedded form quick start][js quick start]
- [embedded form integration guide][js integration guide]
- [Payment REST API reference][rest api]

## Payment hash verification

Payment hash must be validated on the server side to prevent the exposure of your
personal hash key.

On the server side:

```js
const express = require('express')
const hmacSHA256 = require('crypto-js/hmac-sha256')
const Hex = require('crypto-js/enc-hex')
const app = express()

(...)
// Validates the given payment data (hash)
app.post('/validatePayment', (req, res) => {
  const answer = req.body.clientAnswer
  const hash = req.body.hash
  const answerHash = Hex.stringify(
    hmacSHA256(JSON.stringify(answer), 'CHANGE_ME: HMAC SHA256 KEY')
  )
  if (hash === answerHash) res.status(200).send('Valid payment')
  else res.status(500).send('Payment hash mismatch')
})
(...)
```

On the client side:

```js
import React, { Component } from "react";
import KRGlue from "@lyracom/embedded-form-glue";
import axios from 'axios'
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="form">
        <h1>Payment form</h1>
        <div className="container">
          <div id="myPaymentForm"></div>
        </div>
      </div>
    );
  }

  componentDidMount() {
      /* Use your endpoint and personal public key */
      const endpoint = '~~CHANGE_ME_ENDPOINT~~'
      const publicKey = '~~CHANGE_ME_PUBLIC_KEY~~'
      const formToken = 'DEMO-TOKEN-TO-BE-REPLACED'

      KRGlue.loadLibrary(endpoint, publicKey) /* Load the remote library */
        .then(({KR}) => KR.setFormConfig({  /* set the minimal configuration */
          formToken: formToken,
          'kr-language': 'en-US',
        })) /* to update initialization parameter */
        .then(({KR}) => KR.onSubmit(resp => {
          axios
            .post('http://localhost:3000/validatePayment', paymentData)
            .then(response => {
              if (response.status === 200) this.message = 'Payment successful!'
            })
          return false
        }))
        .then(({KR}) => KR.addForm('#myPaymentForm')) /* create a payment form */
        .then(({KR, result}) => KR.showForm(result.formId));  /* show the payment form */
    }
    (...)
}
```

## Run it from github

You can try the current example from the current github repository doing:

```sh
cd examples/vuejs/minimal-example
npm install
npm run start
```

You can run the example node.js server by running:

```sh
cd examples/server
npm i
npm run start
```

[js link]: https://lyra.com/fr/doc/rest/V4.0/javascript
[js themes]: https://lyra.com/fr/doc/rest/V4.0/javascript/features/themes.html
[js quick start]: https://lyra.com/fr/doc/rest/V4.0/javascript/quick_start_js.html
[js integration guide]: https://lyra.com/fr/doc/rest/V4.0/javascript/guide/start.html
[rest api]: https://lyra.com/fr/doc/rest/V4.0/api/reference.html
