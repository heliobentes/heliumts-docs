export default function NotFound() {
    return (
        <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-6xl font-bold mb-6">404</h1>
            <p className="text-xl text-gray-600 mb-8">Oops! The page you're looking for doesn't exist.</p>
            <a href="/" className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition">
                Go Back Home
            </a>
        </div>
    );
}
