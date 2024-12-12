import Image from 'next/image';
import Link from "next/link";
import list from "/public/image/task.png"
import Button from "@/component/common/modules/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold mb-4">
              Simplify Your Task Management
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              Efficiently manage your tasks with our intuitive todo list application.
              Drag and drop functionality, real-time updates, and more.
            </p>
            <Link href="/todoList">
              <Button className="bg-blue-500 text-white px-6 py-3 rounded-lg">
                Get Started
              </Button>
            </Link>
          </div>
          <div className="relative h-[400px]">
            <Image
              src={list}
              alt="Task Management"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
