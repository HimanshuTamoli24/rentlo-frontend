export default function HeadNavbar() {
  return (
    <nav className="flex items-center justify-between p-4 bg-white border-b">
      <div className="text-xl font-bold">Rentlo</div>
      <div className="space-x-4">
        <a href="#" className="text-gray-600 hover:text-gray-800">
          Home
        </a>
        <a href="#" className="text-gray-600 hover:text-gray-800">
          About
        </a>
        <a href="#" className="text-gray-600 hover:text-gray-800">
          Contact
        </a>
      </div>
    </nav>
  );
}
