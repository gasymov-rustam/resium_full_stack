export const formatError = function (error: any) {
  const code = error?.originalError?.code || error?.originalError?.code || error?.code;
  if (code === "ERR_GRAPHQL_CONSTRAINT_VALIDATION") {
    return [
      {
        code: "ERR_GRAPHQL_CONSTRAINT_VALIDATION",
        fieldName: "email",
        context: [{ arg: "email", value: "incorrect email" }],
      },
      {
        code: "ERR_GRAPHQL_CONSTRAINT_VALIDATION",
        fieldName: "password",
        context: [{ arg: "email", value: "incorrect password" }],
      },
    ];
  }

  return error;
};
