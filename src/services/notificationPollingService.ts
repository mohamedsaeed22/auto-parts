import { getNotifications } from "@/services/api/notifications";

export interface NotificationPollingConfig {
  /** Base polling interval in milliseconds */
  baseInterval: number;
  /** Maximum interval when using exponential backoff */
  maxInterval: number;
  /** Whether to use exponential backoff on errors */
  useExponentialBackoff: boolean;
  /** Maximum number of consecutive errors before stopping */
  maxErrors: number;
  /** Whether to poll when tab is hidden */
  pollWhenHidden: boolean;
  /** Whether to poll when user is not authenticated */
  pollWhenUnauthenticated: boolean;
}

export class NotificationPollingService {
  private intervalId: NodeJS.Timeout | null = null;
  private errorCount = 0;
  private currentInterval: number;
  private isPolling = false;
  private config: NotificationPollingConfig;
  private onUpdate?: () => void;
  private onError?: (error: Error) => void;

  constructor(config: Partial<NotificationPollingConfig> = {}) {
    this.config = {
      baseInterval: 30000, // 30 seconds
      maxInterval: 300000, // 5 minutes
      useExponentialBackoff: true,
      maxErrors: 5,
      pollWhenHidden: false,
      pollWhenUnauthenticated: false,
      ...config,
    };
    this.currentInterval = this.config.baseInterval;
  }

  /**
   * Set callback for when notifications are updated
   */
  setOnUpdate(callback: () => void) {
    this.onUpdate = callback;
  }

  /**
   * Set callback for when errors occur
   */
  setOnError(callback: (error: Error) => void) {
    this.onError = callback;
  }

  /**
   * Start polling for notifications
   */
  start(isAuthenticated: boolean = true) {
    if (this.isPolling) return;

    if (!isAuthenticated && !this.config.pollWhenUnauthenticated) {
      return;
    }

    this.isPolling = true;
    this.scheduleNextFetch();
  }

  /**
   * Stop polling for notifications
   */
  stop() {
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
    this.isPolling = false;
  }

  /**
   * Force an immediate fetch of notifications
   */
  async fetchNow(isAuthenticated: boolean = true): Promise<void> {
    if (!isAuthenticated && !this.config.pollWhenUnauthenticated) {
      return;
    }

    try {
      await getNotifications(1, 5);
      this.errorCount = 0;
      this.currentInterval = this.config.baseInterval;
      this.onUpdate?.();
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  /**
   * Handle visibility change (tab becomes visible/hidden)
   */
  handleVisibilityChange(isVisible: boolean, isAuthenticated: boolean = true) {
    if (isVisible && isAuthenticated) {
      // Tab became visible, fetch immediately and start polling
      this.fetchNow(isAuthenticated);
      if (!this.isPolling) {
        this.start(isAuthenticated);
      }
    } else if (!isVisible && !this.config.pollWhenHidden) {
      // Tab became hidden, stop polling
      this.stop();
    }
  }

  /**
   * Handle window focus/blur
   */
  handleWindowFocus(isFocused: boolean, isAuthenticated: boolean = true) {
    if (isFocused && isAuthenticated) {
      // Window gained focus, fetch immediately
      this.fetchNow(isAuthenticated);
      if (!this.isPolling) {
        this.start(isAuthenticated);
      }
    } else if (!isFocused && !this.config.pollWhenHidden) {
      // Window lost focus, stop polling
      this.stop();
    }
  }

  /**
   * Get current polling status
   */
  getStatus() {
    return {
      isPolling: this.isPolling,
      errorCount: this.errorCount,
      currentInterval: this.currentInterval,
    };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<NotificationPollingConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.currentInterval = this.config.baseInterval;
  }

  private scheduleNextFetch() {
    if (!this.isPolling) return;

    this.intervalId = setTimeout(async () => {
      if (!this.isPolling) return;

      try {
        await getNotifications(1, 5);
        this.errorCount = 0;
        this.currentInterval = this.config.baseInterval;
        this.onUpdate?.();
      } catch (error) {
        this.handleError(error as Error);
      }

      // Schedule next fetch
      this.scheduleNextFetch();
    }, this.currentInterval);
  }

  private handleError(error: Error) {
    this.errorCount++;
    this.onError?.(error);

    if (this.errorCount >= this.config.maxErrors) {
      console.warn(
        "Too many notification polling errors, stopping temporarily"
      );
      this.stop();

      // Restart after a longer delay
      setTimeout(() => {
        this.errorCount = 0;
        this.currentInterval = this.config.baseInterval;
        if (this.isPolling) {
          this.start();
        }
      }, 60000); // 1 minute delay
      return;
    }

    if (this.config.useExponentialBackoff) {
      // Increase interval exponentially, but cap at maxInterval
      this.currentInterval = Math.min(
        this.currentInterval * 2,
        this.config.maxInterval
      );
    }
  }
}

// Singleton instance for global use
export const notificationPollingService = new NotificationPollingService();
