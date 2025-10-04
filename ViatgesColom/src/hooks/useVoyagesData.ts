import { useEffect, useMemo, useState } from "react";

import { loadVoyages } from "../data/loadVoyages";
import type { Voyage } from "../types";

interface UseVoyagesData {
  voyages: Voyage[];
  loading: boolean;
  errorMessage?: string;
}

export const useVoyagesData = (): UseVoyagesData => {
  const [voyages, setVoyages] = useState<Voyage[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        const data = await loadVoyages();
        if (!cancelled) {
          setVoyages(data);
          setLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage((error as Error).message);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(
    () => ({ voyages, loading, errorMessage }),
    [voyages, loading, errorMessage],
  );
};
