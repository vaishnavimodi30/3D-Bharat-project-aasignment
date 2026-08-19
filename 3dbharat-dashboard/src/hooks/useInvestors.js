"use client";

import { useEffect, useState } from "react";
import { fetchInvestors } from "@/services/investorService";

export function useInvestors() {
  const [investors, setInvestors] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    fetchInvestors({ page: 1, pageSize: 50 })
      .then((res) => {
        if (!cancelled) {
          setInvestors(res.items);
          setStatus("succeeded");
        }
      })
      .catch(() => !cancelled && setStatus("failed"));
    return () => {
      cancelled = true;
    };
  }, []);

  return { investors, status };
}
