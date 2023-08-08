import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** "echo" takes longer to respond to longer queries. If the query is purely
 * alphabetic, it returns the input string as-is. Otherwise, it errors. */
export const echoApi = createApi({
  baseQuery: fakeBaseQuery(),
  tagTypes: [],
  endpoints: (builder) => ({
    echo: builder.query<string, string>({
      async queryFn(arg: string) {
        await delay(arg.length * 50);

        if (arg.match(/^[a-zA-Z]+$/)) {
          console.log("echo: success", arg);
          return { data: arg };
        } else {
          console.error("echo: failure", arg);
          return { error: "invalid query" };
        }
      },
    }),
  }),
});

export const { useEchoQuery } = echoApi;
