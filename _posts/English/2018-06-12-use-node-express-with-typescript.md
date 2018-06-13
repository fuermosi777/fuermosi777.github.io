---
title: Developing Express.js server with Typescript --- request, response check and more
layout: post
category: English
tags:
- typescript
---

After migrating to Typescript on my WordMark 3.x, I decided to migrate all my javascript codes to typescript because coding with type check feels so good. However, the migration process was absolutely painful, especially for those with large codebase. For UI such as web or React Native app, the migration is not just changing all `.js` to `.ts`, but also includes updating the compiler setup (e.g. Webpack configuration). For migration on Node.js, things can be easier as there is a useful tool called ts-node, which let developers to run Typescript code directly on local environment.

This post is not going to describe every details of the migration process, but provides soem useful tips on how to take the advantage of Typescript in the server side, thus increasing the readability, scalability, and the health of the codebase.

## Add check for Request and Response object

The Typescript version of router looks like the following:

```typescript
// routes/user.ts
router.get('/user', async (req: Request, res: Response, next: NextFunction) => {
  const id = req.query.id;
  const result = await userService.getUserBy({id});
  res.json(user);
});
```

It is difficult to know what the query looks like, and what the response json's structure. Also there is no check for these objects at all. The solution is to create two new interfaces which extend Request and Response:

```typescript
// interfaces/customRequest.ts
import { Request } from 'express';

export interface CustomRequestWithQuery<T> extends Request {
  query: T;
};

// interfaces/customResponse.ts
import { Response } from 'express';

export interface CustomResponse<T> extends Response {
  json: (body: T) => Response
};
```

After that, we can create two interfaces for the router:

```typescript
// routes/user.ts
export interface UserQuery {
  id: number,
};

export interface UserResult {
  [index: number]: UserInstance
};
```

The new signature of the router function will look like this:

```typescript
// routes/user.ts
router.get('/user', async (
  req: CustomRequestWithQuery<UserQuery>,
  res: CustomResponse<UserResult>,
  next: NextFunction) => {
    const id = req.query.id;
    const result = await userService.getUserBy({id});
    res.json(user);
});
```

Then we will have all the checks for query, and for anything passed to `res.json()`.

However, in this case we are not sure if the query has `id` attribute. Since interfaces only exists at compile stage, there is no way to check like the old Javascript ways such as `instance of` or `typeof`. But Typescript has a feature called [Type Guard](http://www.typescriptlang.org/docs/handbook/advanced-types.html).

Therefore, creating a `queryCheck` middleware:

```typescript
// routes/user.ts
// Define type guard
export function isUserQuery(query: ApplicationQuery): query is ApplicationQuery {
  return query.id !== null &&
    typeof query.id !== 'undefined';
}

// Add middleware to route
router.get('/user',
  queryCheck<UserQuery>(isUserQuery),
  // ...
);

// middlewares/queryCheck.ts
import { Response, NextFunction } from 'express';
import { CustomRequestWithQuery } from '../interfaces/customRequest';

/**
 * A middleware to check if GET request's query is an instance of a specific interface.
 * @param isType The type guard function to check query's interface.
 */
export function queryCheck<Q>(isType: (query: Q) => boolean) {
  return function(req: CustomRequestWithQuery<Q>, _res: Response, next: NextFunction) {
    if (!req.query) {
      const error = new Error('Missing query in request.');
      next(error);
    }
    if (isType(req.query)) {
      next();
    } else {
      const error = new Error('Query paramater is incorrect.');
      next(error);
    }
  }
};
```

