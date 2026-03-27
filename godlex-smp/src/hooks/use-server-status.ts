import { useQuery } from "@tanstack/react-query";

export interface ServerStatusResponse {
  online: boolean;
  ip: string;
  port: number;
  version?: string;
  players?: {
    online: number;
    max: number;
  };
  motd?: {
    clean: string[];
    html: string[];
  };
}

export function useServerStatus(ip: string = "play.godlexsmp.com") {
  return useQuery<ServerStatusResponse>({
    queryKey: ["server-status", ip],
    queryFn: async () => {
      const res = await fetch(`https://api.mcsrvstat.us/3/${ip}`);
      if (!res.ok) {
        throw new Error("Failed to fetch server status");
      }
      return res.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}
