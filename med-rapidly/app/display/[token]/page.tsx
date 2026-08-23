"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface QueueDisplay {
  department: string;
  doctorName: string;
  room: string;
  nowServing: string;
  nextQueue: string;
}

export default function WaitingRoomDisplay() {
  const params = useParams();
  const token = params.token as string;
  const [queues, setQueues] = useState<QueueDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  useEffect(() => {
    const fetchQueueData = async () => {
      try {
        const response = await fetch(`/api/queue/display/${token}`);
        if (response.ok) {
          const data = await response.json();
          setQueues(data);
          setLastUpdate(new Date().toLocaleTimeString());
        }
      } catch (error) {
        console.error("Failed to fetch queue data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQueueData();

    // Refresh every 3 seconds
    const interval = setInterval(fetchQueueData, 3000);
    return () => clearInterval(interval);
  }, [token]);

  if (loading) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-blue-900 to-blue-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-blue-300 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-2xl">Loading queue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-900 to-blue-800 text-white p-8 overflow-hidden">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold mb-2">Queue Status</h1>
        <p className="text-xl text-blue-200">
          Last updated: {lastUpdate}
        </p>
      </div>

      {/* Queue Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 h-[calc(100vh-200px)]">
        {queues.length > 0 ? (
          queues.map((queue, idx) => (
            <div
              key={idx}
              className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 border border-white border-opacity-20 flex flex-col justify-between"
            >
              {/* Department & Doctor */}
              <div>
                <h2 className="text-3xl font-bold mb-2">{queue.department}</h2>
                <p className="text-xl text-blue-200">{queue.doctorName}</p>
                <p className="text-lg text-blue-300">Room {queue.room}</p>
              </div>

              {/* Now Serving */}
              <div className="my-8 text-center">
                <p className="text-sm uppercase tracking-wide text-blue-200 mb-2">
                  Now Serving
                </p>
                <p className="text-6xl font-bold text-yellow-300 font-mono">
                  {queue.nowServing}
                </p>
              </div>

              {/* Next Queue */}
              <div className="text-center">
                <p className="text-sm uppercase tracking-wide text-blue-200 mb-2">
                  Next
                </p>
                <p className="text-4xl font-bold text-green-300 font-mono">
                  {queue.nextQueue}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl text-blue-200">
                No active queues at the moment
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="fixed bottom-8 right-8 text-sm text-blue-300 text-right">
        <p>Med Rapidly • Hospital Queue Management</p>
        <p className="text-xs mt-2">Press F11 for fullscreen</p>
      </div>
    </div>
  );
}
