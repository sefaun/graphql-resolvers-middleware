export function graphqlResolverslMiddleware(...[]: Iterable<Function>): any {
  const slice = Array.prototype.slice

  const stacks = slice.call(arguments)
  const that = this

  if (!stacks.length) {
    throw new Error("There is no any argument functions.")
  }

  for (let i = 0; i < stacks.length; i++) {
    if (typeof stacks[i] !== "function") {
      throw new Error(`Arguments ${i + 1} is not a Function. All arguments have to be a Function.`)
    }
  }

  return async function () {
    var arg = 0
    var return_values = []
    var next_old_parameters = []
    const params = slice.call(arguments)

    if (!params.length) {
      throw new Error("There is no any arguments.")
    }

    function returns(data: any) {
      return_values = data;
      return return_values
    }

    async function next() {
      const next_args = slice.call(arguments)
      if (next_args.length) {
        next_old_parameters.push(...next_args, ...next_old_parameters)
      }
      arg++
      await stacks[arg].apply(that, [...next_old_parameters, ...params, next, returns])
    }

    await stacks[arg].apply(that, [...params, next, returns])

    return return_values as any
  }

}