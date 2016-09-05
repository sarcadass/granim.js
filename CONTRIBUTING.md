# Contributing

As `granim.js` is a small project with a few maintainers,
we'd like to make sure that it's easy for you to contribute,
and that it's easy for us to manage incoming PRs. In that interest -

1. Fork the Repo
2. Clone
3. Run `npm install`
4. Make Changes
5. You can test your modifications with the `test/` folder
6. Run `gulp` or `gulp watch` to build / watch the lib. Use `gulp buildDoc` or `gulp watchDoc` to build / watch the docs
7. Run `npm start` and check `localhost:8080` to access the doc locally, everything should be working after your changes
8. Commit and Push
9. Open a Pull Request

I was thinking of setting browser-based tests with Selenium and [Sauce labs](https://saucelabs.com/).
The details sent in the events and callback could be use to easily test the animations.

### Guidelines

We'd like to make sure your code is like our:

1. `'use strict';`
2. Use semicolons `;`
3. We prefer `'` to `"`
4. Use 1 tab for indentation, no spaces
5. The lib is coded in ES5, for code consistency, don't use ES6 please

With all of that, you should have a PR submitted and merged in no time.

Thanks for helping us out! :)
