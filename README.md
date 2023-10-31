
This is a demo application for nextspace(https://github.com/dennischen/nextspace) base on nextjs 

## Getting Started

Clone with nextspace submodule
```bash
git clone git@github.com:dennischen/nextspace-demo.git --recursive
```

Compile nextspace submodule

```bash
cd nextspace-demo/nextspace

yarn install

yarn build
# or watch for running nextspace in nextjs dev
yarn build-watch
```

Run the development demo server:

```bash
cd nextspace-demo

yarn install

yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Production

```bash
cd nextspace-demo
# build
yarn build
# then
yarn start
# or just
yarn buildstart
```

## Docker image
After build the procution (by yarn build), use docker to build a image and run demo as a container

```bash
cd nextspace-demo
# docker image
docker build . -t nextspace-demo
# run container
docker run -p 3000:3000 -it nextspace-demo
```

## Oneline demo
Here is a hosted online demo [http://www.colaorange.com:3000/](http://www.colaorange.com:3000/)