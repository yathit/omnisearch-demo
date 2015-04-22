# Demo app for Omnisearch package

To install local package, we still require old [meteriote](https://github.com/oortcloud/meteorite), `npm install -g meteorite`.

Register omnisearch package as local by giving absolute folder location.

    mrt link-package ~/gp/omnisearch

It is consumed by `meteor add kyawtun:omnisearch`. But in this pre-configure app, you will just run `meteor`.

For testing, add symbolic link to api keys file in the package:

    ln -s packages/omnisearch/server/key-store.js ./key-store.js

