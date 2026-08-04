import CommentList from "./components/CommentList";

function App() {
  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
            <span className="text-sm font-medium text-indigo-600">
              Community discussion
            </span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            Product feedback
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500 sm:text-base">
            Share feedback, respond to other contributors, and keep the
            conversation useful.
          </p>
        </header>

        <CommentList />
      </div>
    </main>
  );
}

export default App;
