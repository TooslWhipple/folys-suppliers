"use client";

import { useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import {
  notificationsService,
  type InboxCredentials,
} from "@/services/notifications.service";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Signed credentials of the notification inbox for the logged-in supplier.
 *
 * The signature is deterministic per supplier, so it is fetched once when the
 * bell mounts and not refreshed while the session lasts. The `supplierId` from
 * the auth store is used only to know whether there is anyone to ask for: the
 * real subscriber id comes from the backend, already prefixed.
 */
export function useInboxCredentials(): {
  credentials: InboxCredentials | null;
  loading: boolean;
} {
  const supplierId = useAuthStore((state) => state.user?.supplierId);
  const { execute, data, loading } = useApi<InboxCredentials>();

  useEffect(() => {
    if (!supplierId) return;

    // The bell fetches on its own, without the user asking for it: a failure
    // hides it instead of throwing an error notification on top of whatever
    // the supplier was doing.
    execute(() => notificationsService.getInboxCredentials(), {
      showErrorNotification: false,
    });
  }, [execute, supplierId]);

  return { credentials: data, loading };
}

export default useInboxCredentials;
