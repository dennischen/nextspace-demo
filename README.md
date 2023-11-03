
This is a demo application for nextspace(https://github.com/dennischen/nextspace) base on nextjs 

## Getting Started
Clone with nextspace submodule

```bash
git clone git@github.com:dennischen/nextspace-demo.git --recursive
```

## Directory
 * /src : The demo source code
 * /cypress : The auto test code and data
 * /nextspace : Nextspace submodule reference

## Installation
 ```bash
yarn install
 ```

## Compile nextspace submodule
```bash
cd nextspace

#installation for submodule
yarn install

yarn dist
# or watch for running nextspace in nextjs dev
yarn dist-watch
```

## Run the development demo server:
```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Auto test
Run the auto test by cypress test framework

```bash
yarn test
# or
yarn test:e2e

# or open and run manually
yarn test:e2e:open
```

## Production

```bash
# build
yarn build
# then
yarn start
# or just
yarn build-start
```

## Docker image
After build the procution (by yarn build), use docker to build a image and run demo as a container

```bash
# docker image
docker build . -t nextspace-demo
# run container
docker run -it -p 3000:3000 nextspace-demo
```

## Oneline demo
Here is a online demo at [http://www.colaorange.com:3000/](http://www.colaorange.com:3000/)