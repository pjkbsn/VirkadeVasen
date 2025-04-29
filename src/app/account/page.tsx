"use client";

export default function AccountPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 mt-24">
      <h1 className="text-3xl font-bold mb-8">Mitt konto</h1>

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
        {/* Main content */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-medium mb-6">Min profil</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
