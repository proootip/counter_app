import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Link href="/counter" className="text-xl text-blue-600 underline">
        Go to Counter
      </Link>
    </div>
  );
}
