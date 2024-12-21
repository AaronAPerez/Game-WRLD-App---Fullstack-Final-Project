import { Clock, Gamepad2 } from 'lucide-react';

export const ActivityFeed = () => {
  return (
    <div className="bg-stone-900 rounded-xl border border-stone-800">
      <div className="divide-y divide-stone-800">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <p className="text-gray-400">
                <span className="text-white font-medium">User Name</span> started playing Game Name
              </p>
              <p className="text-sm text-gray-500">2 hours ago</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};