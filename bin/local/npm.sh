#!/bin/bash

echo "Running the command 'docker run -it -v $(pwd):/code:rw --workdir /code --entrypoint npm ${NODE_IMAGE} $@'"
echo

docker run -i -v $(pwd):/code:rw --workdir /code --entrypoint npm node:latest $@

