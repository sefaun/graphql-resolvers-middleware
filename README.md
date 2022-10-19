## GraphQL Resolvers Middleware
In GraphQL Resolvers Functions Arguments are `parent, args, context, info`. When use this package, it is provide `next, returns` functions.

### next()
This function provide to pass other to function in order. Also next functions provide to send other function in order some values like `next(1, 2)`. You can reach parameters from other order functions like `const UserList = async (one , two, parent, args, context, info, next, returns) => {}`.

### returns()
This function returns your graphql api response to front-end.

## Example
File `userListType.ts`
```ts
import { gql } from 'apollo-server-express'

export const userListType = gql`
type Query {
  userList: userListPayload
}

type userListPayload {
  result: String
}
`
```

File `resolvers.ts`
```ts
import { graphqlResolversMiddleware } from "graphql-resolvers-middleware"

import { JwtCheck } from "./JwtCheck"
import { UserList } from "./UserList"


export const resolvers = {
  Query: {
    userList: graphqlResolversMiddleware(JwtCheck, /*add some functions*/ UserList),
    //...
    //...
    //...
    other: graphqlResolversMiddleware(JwtCheck, Validation, /*add some functions*/ OtherFunction),
  }
}
```

File `JwtCheck.ts`
```ts
export const JwtCheck = async (parent, args, context, info, next, returns) => {
  try {
    const token = context.req.headers.authorization.split("Bearer ")[1]

    const _decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

    return next()
  } catch (error) {
    return returns({ result: "Invalid Token" })
  }
}
```

File `UserList.ts`
```ts
export const UserList = async (parent, args, context, info, next, returns) => {
  try {

    //Do somethings.....

    return returns({ result: "result: " + Math.floor(Math.random() * 100)})

  } catch (error) {
    return returns({ result: "error" })
  }
}
```

File `graphql.ts`
```ts
import { Application } from 'express'
import { ApolloServer } from 'apollo-server-express'

import { userListType } from './userListType'
import { resolvers } from './resolvers'


export const GraphQLApiV1 = async (app: Application) => {
  const server = new ApolloServer({
    typeDefs: userListType,
    resolvers: resolvers,
    //...
  })

  await server.start()

  server.applyMiddleware({ app, path: '/graphql/v1' })
}
```