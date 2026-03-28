import React, { createContext, useContext, useState, useEffect } from "react";

interface DataContextType {
  data: any;
  loading: boolean;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    try {
      const res = await fetch("/api/data");
      if (!res.ok) throw new Error("Failed to fetch data");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();

    // Listen for data updates from other tabs (e.g., Admin Panel)
    const channel = new BroadcastChannel("app_data_sync");
    channel.onmessage = (event) => {
      if (event.data === "refresh") {
        refreshData();
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "last_data_update") {
        refreshData();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      channel.close();
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <DataContext.Provider value={{ data, loading, refreshData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
