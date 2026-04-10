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
    clean: string;
    html: string;
  };
}

export function useServerStatus(
  host: string = "play.godlexsmp.com",
  port: number = 45799
) {
  return useQuery<ServerStatusResponse>({
    queryKey: ["server-status", host, port],
    queryFn: async () => {
      const res = await fetch(
        `https://api.mcstatus.io/v2/status/java/${host}:${port}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch server status");
      }
      const data = await res.json();
      return {
        online: data.online ?? false,
        ip: data.host ?? host,
        port: data.port ?? port,
        version: data.version?.name_clean ?? undefined,
        players: data.players
          ? {
              online: data.players.online ?? 0,
              max: data.players.max ?? 0,
            }
          : undefined,
        motd: data.motd
          ? {
              clean: data.motd.clean ?? "",
              html: data.motd.html ?? "",
            }
          : undefined,
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}
