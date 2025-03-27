import Link from "next/link";

export default function SecondpageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="secondpage-layout">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-slate-700/20 rounded-lg p-6 shadow-lg">
          <h1 className="text-3xl font-bold mb-6 border-b pb-4 border-slate-700/30">
            Second Page Section
          </h1>

          {/* Navigation to separate pages */}
          <nav className="mb-8">
            <ul className="flex gap-4 text-sm">
              <li>
                <Link
                  href="/secondpage"
                  className="text-blue-400 hover:underline"
                >
                  Overview
                </Link>
              </li>
              <li>
                <Link
                  href="/secondpage/section1"
                  className="text-blue-400 hover:underline"
                >
                  Section 1
                </Link>
              </li>
              <li>
                <Link
                  href="/secondpage/section2"
                  className="text-blue-400 hover:underline"
                >
                  Section 2
                </Link>
              </li>
              <li>
                <Link
                  href="/secondpage/section3"
                  className="text-blue-400 hover:underline"
                >
                  Section 3
                </Link>
              </li>
            </ul>
          </nav>

          {children}
        </div>
      </div>
    </div>
  );
}
