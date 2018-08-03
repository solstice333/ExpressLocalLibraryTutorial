# Express Local Library Tutorial

## Description

MDN's Express tutorial project which is a sample local library app

## Usage

cd to project root

```
$ cd path/to/express_locallibrary_tutorial
```

install deps listed in package.json

```
$ npm install && npm install --only=dev
```

serve mongo db

```
$ mongod --dbpath db
```

run

```
$ npm start
```

or run with debugging messages on:

```
$ DEBUG=express_locallibrary_tutorial:* npm run devstart
```
