# Sync Webtask

This webtask was design to be used as a [Github Webhook](https://developer.github.com/webhooks/) for the repository [hawkeye-recipes](https://github.com/jcenturion/hawkeye-recipes). The goal is to update our S3 bucket with the new recipes.

## Prerequisites

To deploy **Sync Webtask**, you'll need the following:

* [Node JS](http://nodejs.org/)
* [NPM](https://npmjs.org/)
* Install Webtask CLI - `npm install wt-cli -g`
* Follow the [getting started](https://webtask.io/docs/101) with webtaks document

## How to deploy

```
wt create sync.js --secret S3_ACCESS_KEY=[YOUR-ACCESS-KEY-HERE] --secret S3_SECRET=[YOUR-SECRET-HERE]
```

## How to make a request

`POST` to [WEBTASK-URL] with the following body:

``` javascript
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "id": "http://jsonschema.net",
  "type": "object",
  "properties": {
    "action": {
      "id": "http://jsonschema.net/action",
      "type": "string"
    },
    "pull_request": {
      "id": "http://jsonschema.net/pull_request",
      "type": "object",
      "properties": {
        "merged": {
          "id": "http://jsonschema.net/pull_request/merged",
          "type": "boolean"
        }
      }
    }
  },
  "required": [
    "action",
    "pull_request"
  ]
}
```
