## gRPC for PHP

Original concept design by: https://github.com/shumkov

Project now maintained by: Shane Jeffery ()https://github.com/CompTrain) & David Amick (https://github.com/snarlysodboxer)

### Quick Links

- **gRPC** :: https://grpc.io/about/
- **gRPC + PHP (client side)** :: https://grpc.io/docs/tutorials/basic/php.html
- **Proto Buffers** :: https://developers.google.com/protocol-buffers/docs/overview

### Explanation

There is no native gRPC server support for PHP.  There will never will be, unless PHP figures out a way to spin up its own dameons, which we don't see happening until PHP8, if at all.

With that, we (the contributors listed above) went on the hunt for something that could possibly bridge the gap and found that Ivan Shumkov had already put most of the pieces together.  What was lacking in his repository were examples of how to get to a working solution and also how to configure your server along with PHP.  On top of that, there was significant code cleanup/optimization needed.  So, we have aimed since taking on this project of fixing things up and giving it back to the community in a way that it is usable for folks!

The basic workflow here is this:

1. Client will reach out with request to gRPC server (client will have its own proto file that will need to mimic what is on the server side, unless you are making changes one side and not the other that you don't want to be in sync as of yet).
2. The gRPC server (spun up in Node.js) will take in the request and all of the details from gRPC (including the proto file details for the service that was hit)).
3. Once the gRPC server has all of the information it needs, it will reach out to PHP over FastCGI and pass the gRPC specific details over the query string and any request params that are a part of the proto file will be sent over via the PHP input stream.
4. The PHP entry point will then do whatever business logic and then echo out a JSON encoded structure that tells gRPC that it is done and gRPC will then send the response back to the client.

### Setup

**Setup:**

1. Go into the `protos` directory and setup whatever protos you need to.
2. Create an `.env` file from the `.env.example`.  We have setup the defaults for you, so the basic use case for gRPC should be handled.
3. Take a look at the `services.yml` file and setup your references as you need (each proto you setup in Step 1 will be its own service).  From here, you will also setup your entry points for the PHP files.
4. Go into the `php` directory and create the PHP entry point files for each of your services.
5. Check out the `client.js` in the `client_example` directory and build a test that will hit your service(s).  Make sure that you make a copy of your protos in your `protos` directory at the gRPC server root and put them into the `client_example/protos` as you will need to have matching contracts for type-checking and the overall structure of your requests/responses.

**Local Development Use:**


1. `docker-compose up` -- If the command is successful, you should see that your services have spun up in the terminal output.
2. Go into the container (`docker exec -it <containerName> bash`) and execute the `client.js` that you modified in Step 5 of the Setup (`/code/client_example/client.js`) and you should see a successful response back from the gRPC service for any and all of your requests.

**Production Use:**

**COMING SOON** -- Still building out the Dockerfile.


### Issues / Questions / Concerns

David and I (Shane) are actively looking for ways to make this project better.  If you have further ideas on how to optimize / beautify, please let us know either through an issue or creating your own PR for the changes and tagging both of us for review.

### MIT License

Copyright (c) 2016-2018 Ivan Shumkov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.