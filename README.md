# Lambda Toolkit

A set of tools to simplify Node Js code development specific for AWS Lambdas, including common functions and AWS SDK v3 abstractions.

## Origin

This project was created based on my personal experience after I have been working with lambdas for almost 10 years. The need to abstract the AWS SDK integration for common day-to-day tasks led me to create this library, first as a private re-usable piece of code, now as a public package. I also added together some common functions I needed the most over the years. The goal of this library is to make the developer's life easier.

## Dependencies

This project has no dependency other than the AWS SDKs. My goal is to always have the minimal number of dependencies, so commons functions in this code base, like `camelize`, `mean` or `splitBatches` were implemented instead of relying on external providers. 

As for the AWS SDK dependencies, this code is intended to run on AWS Lambda environments and __I strong suggest__ that you don't include these packages when bundling your code for deploy, as they are all available at the AWS runtime. For example, at your `webpack.config.js`, include:
```js
{
  ...,
  externals: [
    /@aws-sdk\/*/
  ],
  ...
}
```

## ES6

This codebase was written in ES5 flavor. I plan to re-write it in ES6 and then provide both ES5 and ES6 builds when publishing to npm.

## Documentation

Full documentation is available under [docs/](https://github.com/szanata/lambda-toolkit/blob/master/docs/index.md) at the repo.
