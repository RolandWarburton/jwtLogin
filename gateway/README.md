# Implementing an API gateway for microservices

This is a small "for the purposes of learning" project that implements an API gateway in nodejs

In this example i want to take two clients that were originally public and make them private (not accessible from the internet). Instead make them avaliable through an [api gateway (pattern)](https://microservices.io/patterns/apigateway.html).

## Goals

[watch.rolandw.dev](watch.rolandw.dev) and [build.rolandw.dev](build.rolandw.dev) are my two "microservices".

1. Hide watch.rolandw.dev and build.rolandw.dev to make them inaccessible to the internets
2. Double down on making them better microservices
3. Put an API gateway in front of them that make them accessible through one (SSO) client

### Outcomes

After implementing this test application i hope to have achieved these things.

1. the API gateway is the only client required because its the only internet facing (gateway to watch and build) required
2. i can build queries against the gateway that require data from both services. The gateway can implement api composition pattern to make requests against unauthenticated routes (because the client browser <-> gateway is secure so gateway <-> microservices doesn't need to be, at least i think so)

## Other resources

The problem i have to overcome. \
[microservices.io/patterns/data/database-per-service](https://microservices.io/patterns/data/database-per-service.html).

A pattern to fix it. \
[microservices.io/patterns/data/saga](https://microservices.io/patterns/data/saga.html).

Another pattern to fix it. \
[microservices.io/patterns/data/api-composition](https://microservices.io/patterns/data/api-composition.html).

What im studying now to achieve this. \
[microservices.io/patterns/apigateway](https://microservices.io/patterns/apigateway.html).
