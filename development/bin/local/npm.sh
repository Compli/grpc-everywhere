#!/bin/bash

docker run -i -v $(pwd)/..:/code:rw --workdir /code/development --entrypoint npm node:9.2.0 $@

