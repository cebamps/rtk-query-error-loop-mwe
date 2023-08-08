import { useEchoQuery } from "./echoApi";
import { useState } from "react";

export default function App() {
  const [arg, setArg] = useState("InitialQuery");

  const { data, isFetching, isSuccess } = useEchoQuery(arg);

  return (
    <div className="app">
      <p>
        The simulated API takes longer to respond to longer queries. If the
        query is purely alphabetic, it returns the input string as-is.
        Otherwise, it errors.
      </p>
      <p>
        When we are not fetching, we render a child component regardless of
        error state. The child performs the same query as the parent.
      </p>
      <p>
        The issue comes up because the child component is mounted after the
        query errors. When mounted, it immediately tries to run the same query
        as its parent, and because it has errored, the request is retried. The
        shared query then enters a loading state again, causing the child to be
        dismounted, and remounted when the response comes in. This loops until
        the query ends up succeeding.
      </p>
      <p>
        In the happy path, the request is shared by the two components without
        an issue.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setArg(new FormData(e.currentTarget).get("arg") as string);
        }}
      >
        <input type="text" name="arg" />
        <button>set new argument</button>
      </form>

      <h3>query</h3>
      {arg}

      <h3>Response from parent</h3>
      {isSuccess ? data : <em>{isFetching ? "loading..." : "error"}</em>}

      {!isFetching && <Result arg={arg} />}
    </div>
  );
}

function Result({ arg }: { arg: string }) {
  // Rerun the same query as the parent component. This is a bit silly in this
  // MWE, but it could be more common in deeper component trees as we re-use
  // queries (e.g., `useCurrentUserQuery()`) to avoid prop drilling.
  const { data, isFetching, isSuccess } = useEchoQuery(arg);

  return (
    <>
      <h3>Response from child</h3>
      {isSuccess ? data : <em>{isFetching ? "loading..." : "error"}</em>}
    </>
  );
}
