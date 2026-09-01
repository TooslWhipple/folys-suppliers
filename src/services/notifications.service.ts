import { get } from "@/lib/api/client";

/**
 * Everything the Novu `<Inbox>` needs to mount, as returned by the backend.
 *
 * The hash is an HMAC-SHA256 of the full prefixed `subscriberId`
 * (`supplier:<id>`) and is computed in Apifoly: the Novu Secret Key never
 * reaches the browser, and the front never derives the subscriber id from the
 * auth store.
 */
export interface InboxCredentials {
  subscriberId: string;
  subscriberHash: string;
  applicationIdentifier: string;
}

export const notificationsService = {
  /**
   * Signed inbox credentials for the authenticated supplier.
   */
  async getInboxCredentials(): Promise<InboxCredentials> {
    const response = await get<{
      success: boolean;
      data: InboxCredentials;
      message?: string;
    }>(`/supplier-portal/notifications/inbox-credentials`);

    return response.data;
  },
};

export default notificationsService;
