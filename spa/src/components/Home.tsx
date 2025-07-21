export function Home() {
  return (
    <div className="hero min-h-[70vh] bg-base-200 rounded-lg">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Statistical Drafting</h1>
          <p className="py-6">
            A tool for Magic: The Gathering players to optimize their draft picks and deck building
            using machine learning models trained on real draft data.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a href="/pick-order" className="btn btn-primary">Get Pick Order</a>
            <a href="/build-deck" className="btn btn-secondary">Build a Deck</a>
          </div>
        </div>
      </div>
    </div>
  );
}