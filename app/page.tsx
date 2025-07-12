import Link from "next/link";
import  Hero  from "@/components/Hero";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
  
      {/* Hero Section */}
      <Hero/>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">ReWear</h3>
          <p className="text-gray-400 mb-4">
            Sustainable fashion for a better future
          </p>
          <div className="flex justify-center space-x-6">
            <Link href="/about" className="text-gray-400 hover:text-white">
              About
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-white">
              Contact
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-white">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
