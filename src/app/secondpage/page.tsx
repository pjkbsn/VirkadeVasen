export default function SecondPageOverview() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Overview</h2>
      <p className="mb-6">
        Welcome to the Second Page section. This area contains multiple sections
        with different content. Use the navigation above to explore each
        section.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-slate-800/20 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Section 1</h3>
          <p className="text-sm">Brief description of what section 1 covers.</p>
          <div className="mt-4">
            <a
              href="/secondpage/section1"
              className="text-blue-400 text-sm hover:underline"
            >
              View Section 1 →
            </a>
          </div>
        </div>

        <div className="bg-slate-800/20 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Section 2</h3>
          <p className="text-sm">Brief description of what section 2 covers.</p>
          <div className="mt-4">
            <a
              href="/secondpage/section2"
              className="text-blue-400 text-sm hover:underline"
            >
              View Section 2 →
            </a>
          </div>
        </div>

        <div className="bg-slate-800/20 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Section 3</h3>
          <p className="text-sm">Brief description of what section 3 covers.</p>
          <div className="mt-4">
            <a
              href="/secondpage/section3"
              className="text-blue-400 text-sm hover:underline"
            >
              View Section 3 →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
