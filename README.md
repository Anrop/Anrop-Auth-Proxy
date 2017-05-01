# Anrop Auth Proxy

Validates Anrop user before accessing other HTTP service

## Requirements

Code is written in [Node.js](https://nodejs.org/).

## How To Use

Install dependences with `npm install`.

Copy `config.js.example` to `config.js` and set desired parameters

Start the API with `npm start`.
Server will be available at port chosen in config file.

## Windows Service

Install as a Windows Service with `npm run install-windows-service`.

Remove previously installed Windows Service with `npm run uninstall-windows-service`.

## Config Values

The following values should be specified in the `config.js`.

| Variable | Required | Description |
| --- | -------- | ----------- |
| cookie | Yes | Cookie to get from requests |
| group | Yes | Required User Group at Anrop to allow access |
| port | Yes | Port that should be used by Auth Proxy HTTP Server |
| target | Yes | HTTP url to forward requests to |

## Groups

Some groups which could be relevant

| Group Id | Description |
| --- | -------- |
| 4 | SFP Developers |
| 5 | SFP Testers |
| 7 | Operations Makers |
