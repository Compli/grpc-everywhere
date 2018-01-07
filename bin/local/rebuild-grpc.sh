#!/bin/bash

# This script builds a golang reverse-proxy JSON/REST to gRPC server

set -e

docker run -it --rm -v $(pwd):/code -w /code --entrypoint /usr/bin/protoc snarlysodboxer/protoc-grpc-gateway:latest -I/usr/include -I./protos -I. -I/go/src -I/go/src/github.com/googleapis/googleapis/ --go_out=,plugins=grpc:./generated protos/cbt-reporting.proto
echo "Generated Golang grpc stub"

docker run -it --rm -v $(pwd):/code -w /code --entrypoint /usr/bin/protoc snarlysodboxer/protoc-grpc-gateway:latest -I/usr/include -I./protos -I. -I/go/src -I/go/src/github.com/grpc-ecosystem/grpc-gateway/third_party/googleapis --grpc-gateway_out=logtostderr=true:./generated protos/cbt-reporting.proto
echo "Generated Golang grpc-gateway code"

docker run -it --rm -v $(pwd):/code -w /code -e CGO_ENABLED=0 -e GOOS=linux --entrypoint go snarlysodboxer/protoc-grpc-gateway:latest build -o generated/grpc-gateway-executable -a grpc-gateway.go
echo "Built 'generated/grpc-gateway-executable' binary from 'grpc-gateway.go'"

