# P2P exchange over Grenache

## Install project dependencies

```bash
 npm install
 ```
## Install grenache grapes

```bash
npm i -g grenache-grape
```

## boot two grape servers

```bash
grape --dp 20001 --aph 30001 --bn '127.0.0.1:20002'
grape --dp 20002 --aph 40001 --bn '127.0.0.1:20001'
```
## Run server

```bash
npm start
```

## Run client to put orders

First argument should be order type, next quantity and finally the price.

```bash
node client.js ASK 4 100000
```

```bash
node client.js BID 4 100000
```

The client receives the updated order book.


