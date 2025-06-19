import { useState, useEffect, useCallback } from "react";
import { subscribeToRealtimeUpdates } from "@/lib/api";

export interface RealtimeUpdate {
  id: string;
  timestamp: string;
  type: "social_media" | "resource_status" | "official_update" | "new_report";
  data: any;
}

export const useRealtimeUpdates = () => {
  const [updates, setUpdates] = useState<RealtimeUpdate[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  const addUpdate = useCallback((update: RealtimeUpdate) => {
    setUpdates((prev) => [update, ...prev.slice(0, 49)]); // Keep last 50 updates
    setLastUpdate(update.timestamp);
  }, []);

  const clearUpdates = useCallback(() => {
    setUpdates([]);
  }, []);

  const markAsRead = useCallback((updateId: string) => {
    setUpdates((prev) =>
      prev.map((update) =>
        update.id === updateId ? { ...update, read: true } : update,
      ),
    );
  }, []);

  useEffect(() => {
    setIsConnected(true);
    const unsubscribe = subscribeToRealtimeUpdates(addUpdate);

    // Simulate connection status
    const statusInterval = setInterval(() => {
      setIsConnected(Math.random() > 0.05); // 95% uptime
    }, 10000);

    return () => {
      unsubscribe();
      clearInterval(statusInterval);
      setIsConnected(false);
    };
  }, [addUpdate]);

  return {
    updates,
    isConnected,
    lastUpdate,
    addUpdate,
    clearUpdates,
    markAsRead,
    unreadCount: updates.filter((u) => !(u as any).read).length,
  };
};

export const useSystemStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { getSystemStats } = await import("@/lib/api");
        const systemStats = await getSystemStats();
        setStats(systemStats);
      } catch (error) {
        console.error("Failed to fetch system stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return { stats, loading };
};
