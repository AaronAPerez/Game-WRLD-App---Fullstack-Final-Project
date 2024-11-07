// pages/HomePage.tsx
const HomePage = () => {
  return (
    <div className="space-y-8">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Our Platform</h1>
        <p className="text-xl text-gray-600">Discover amazing games and experiences</p>
      </section>

      
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Feature 1</h2>
          <p className="text-gray-600">Description of feature 1</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Feature 2</h2>
          <p className="text-gray-600">Description of feature 2</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Feature 3</h2>
          <p className="text-gray-600">Description of feature 3</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
