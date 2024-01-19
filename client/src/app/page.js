import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex h-screen w-screen justify-center items-center flex-row">
        <Link href="/playOnline">
          <button className="bg-blue-500 text-white px-8 py-4 rounded-md mr-4 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300">
            Play Online
          </button>
        </Link>
        <Link href="/playOffline">
          <button className="bg-green-500 text-white px-8 py-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:border-green-300">
            Play Offline
          </button>
        </Link>
      </div>
    </>
  );
}
