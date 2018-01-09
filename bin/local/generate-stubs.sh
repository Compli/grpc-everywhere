#!/bin/bash

# Use this script to use the proper version of PHP in Docker

docker run -it --rm -v $(pwd):/code:rw --user $(id -u) --workdir /code --entrypoint protoc snarlysodboxer/php-protoc:7.2.0 \
    --proto_path=protos \
    --php_out=generated \
    --grpc_out=generated \
    --plugin=protoc-gen-grpc=/opt/grpc_php_plugin \
    ./protos/user.proto
