# Share Webtask

This webtask gives you the possibility to create a PRs against [hawkeye-recipes](https://github.com/jcenturion/hawkeye-recipes).

## Prerequisites

To deploy **Share Webtask**, you'll need the following:

* [Node JS](http://nodejs.org/)
* [NPM](https://npmjs.org/)
* Install Webtask CLI - `npm install wt-cli -g`
* Follow the [getting started](https://webtask.io/docs/101) with webtaks document

## How to deploy

```
wt create share.js --name share-task --secret GITHUB_TOKEN=[YOUR-TOKEN-HERE] 
```

## How to make a request

`POST` to [WEBTASK-URL] with the following body:

``` javascript
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "id": "http://jsonschema.net",
  "type": "object",
  "properties": {
    "recipe": {
      "id": "http://jsonschema.net/recipe",
      "type": "string"
    },
    "userInfo": {
      "id": "http://jsonschema.net/userInfo",
      "type": "string"
    },
    "content": {
      "id": "http://jsonschema.net/content",
      "type": "object",
      "properties": {
        "name": {
          "id": "http://jsonschema.net/content/name",
          "type": "string"
        },
        "strategy": {
          "id": "http://jsonschema.net/content/strategy",
          "type": "string"
        },
        "options": {
          "id": "http://jsonschema.net/content/options",
          "type": "object",
          "properties": {
            "authorizationURL": {
              "id": "http://jsonschema.net/content/options/authorizationURL",
              "type": "string"
            },
            "tokenURL": {
              "id": "http://jsonschema.net/content/options/tokenURL",
              "type": "string"
            },
            "scope": {
              "id": "http://jsonschema.net/content/options/scope",
              "type": "string"
            },
            "scripts": {
              "id": "http://jsonschema.net/content/options/scripts",
              "type": "object",
              "properties": {
                "fetchUserProfile": {
                  "id": "http://jsonschema.net/content/options/scripts/fetchUserProfile",
                  "type": "string"
                }
              },
              "additionalProperties": false
            }
          },
          "additionalProperties": false
        }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false,
  "required": [
    "recipe",
    "userInfo",
    "content"
  ]
}
```
