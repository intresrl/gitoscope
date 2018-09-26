Gitoscope
========

Tool to learn how git manages files.

Gives detail on working copy, stagin area, head commit contents and also about internal storage, with a graphical representation of commits, trees and blobs.

# Run with docker

## Using the internal repository and the built in git version

Start the container with the following command and open the browser at http://localhost:8080

`docker container run --name gitoscope -p 8080:3000 depsir/gitoscope`

Then enter the container by running 
`docker exec -it gitoscope /bin/sh`

The repository shown in the web page and that you can manipulate is at `/repo`

## Using an external repository
Start the container giving the absolute path of the desired local repository. The web interface will be at http://localhost:8080

`docker container run --name gitoscope -p 8080:3000 -v[PathToRepo]:/repo depsir/gitoscope`

if the repository is in the current folder you can run directly

`docker container run --name gitoscope -p 8080:3000 -v`pwd`:/repo depsir/gitoscope`

Then you can manipulate the repository locally or inside the container as in the scenario above. The repository will be at `/repo` inside the container

# Build and run locally
You need to have node (with npm)
It starts on localhost:3000

* Copy config.js.template to config.js and set the path of the repo you want to explore
* run `npm install`
* run `npm run start`

## Develop
* run `npm run watch`
* activate debug on windows `set DEBUG=* & npm run watch`

## Debug
* run `npm run debug`
