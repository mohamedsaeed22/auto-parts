# Notification Polling Implementation

This document explains the comprehensive notification polling system implemented to automatically fetch notifications without requiring page refreshes.

## Overview

The notification polling system provides automatic, intelligent fetching of notifications with the following features:

- **Automatic Polling**: Fetches notifications at configurable intervals
- **Smart Triggers**: Responds to window focus, tab visibility, and authentication changes
- **Error Handling**: Implements exponential backoff and error recovery
- **Performance Optimized**: Stops polling when tab is hidden or user is not authenticated
- **Real-time Updates**: Updates notification count and list automatically

## Architecture

### 1. Core Service (`notificationPollingService.ts`)

The `NotificationPollingService` class provides the core polling functionality:

```typescript
// Configuration options
interface NotificationPollingConfig {
  baseInterval: number; // Base polling interval (default: 30s)
  maxInterval: number; // Maximum interval with backoff (default: 5m)
  useExponentialBackoff: boolean; // Enable exponential backoff on errors
  maxErrors: number; // Max errors before stopping (default: 5)
  pollWhenHidden: boolean; // Poll when tab is hidden (default: false)
  pollWhenUnauthenticated: boolean; // Poll when not authenticated (default: false)
}
```

**Key Features:**

- Configurable polling intervals
- Exponential backoff on errors
- Automatic error recovery
- Visibility and focus detection
- Authentication state awareness

### 2. React Hook (`useNotificationPollingService.ts`)

The `useNotificationPollingService` hook provides React integration:

```typescript
const { startPolling, stopPolling, fetchNow, getStatus } =
  useNotificationPollingService({
    baseInterval: 30000,
    maxInterval: 300000,
    useExponentialBackoff: true,
    maxErrors: 5,
    pollWhenHidden: false,
    pollWhenUnauthenticated: false,
    autoStart: true,
  });
```

**Features:**

- Automatic lifecycle management
- Window focus/blur handling
- Tab visibility change detection
- Authentication state monitoring
- Manual control methods

### 3. Context Integration (`notification-context.tsx`)

The notification context automatically initializes polling:

```typescript
// Automatically starts polling with smart configuration
useNotificationPollingService({
  baseInterval: 30000, // 30 seconds
  maxInterval: 300000, // 5 minutes
  useExponentialBackoff: true,
  maxErrors: 5,
  pollWhenHidden: false,
  pollWhenUnauthenticated: false,
  autoStart: true,
});
```

## Usage Patterns

### 1. Automatic Polling (Recommended)

The system automatically starts polling when the user is authenticated:

```typescript
// In your app layout or main component
<NotificationProvider>{/* Your app content */}</NotificationProvider>
```

### 2. Manual Control

For advanced use cases, you can manually control polling:

```typescript
const { startPolling, stopPolling, fetchNow, getStatus } =
  useNotificationPollingService({
    autoStart: false, // Disable automatic start
  });

// Start polling manually
startPolling();

// Stop polling
stopPolling();

// Fetch notifications immediately
await fetchNow();

// Get current status
const status = getStatus();
```

### 3. Custom Configuration

Configure polling behavior for different scenarios:

```typescript
// For high-frequency updates (e.g., chat applications)
useNotificationPollingService({
  baseInterval: 5000, // 5 seconds
  maxInterval: 30000, // 30 seconds max
  pollWhenHidden: true, // Continue polling when hidden
});

// For low-frequency updates (e.g., system notifications)
useNotificationPollingService({
  baseInterval: 60000, // 1 minute
  maxInterval: 600000, // 10 minutes max
  pollWhenHidden: false, // Stop when hidden
});
```

## Smart Triggers

The system responds to various events to provide optimal user experience:

### 1. Window Focus/Blur

- **Focus**: Immediately fetches notifications and starts polling
- **Blur**: Stops polling (if `pollWhenHidden: false`)

### 2. Tab Visibility

- **Visible**: Immediately fetches notifications and starts polling
- **Hidden**: Stops polling (if `pollWhenHidden: false`)

### 3. Authentication Changes

- **Login**: Starts polling automatically
- **Logout**: Stops polling immediately

### 4. Network Reconnection

- Automatically resumes polling when network is restored

## Error Handling

The system implements robust error handling:

### 1. Exponential Backoff

```typescript
// On error, interval increases: 30s → 60s → 120s → 240s → 300s (max)
```

### 2. Error Recovery

- After 5 consecutive errors, polling stops temporarily
- Automatically resumes after 1 minute
- Resets error count on successful fetch

### 3. Network Resilience

- Handles network timeouts gracefully
- Retries with exponential backoff
- Continues polling after network recovery

## Performance Considerations

### 1. Resource Optimization

- Stops polling when tab is hidden
- Stops polling when user is not authenticated
- Uses efficient interval management
- Minimal memory footprint

### 2. Network Efficiency

- Configurable polling intervals
- Exponential backoff reduces unnecessary requests
- Smart error recovery prevents request storms

### 3. Battery Life (Mobile)

- Respects tab visibility
- Stops polling when not needed
- Efficient interval management

## Testing

Use the `NotificationPollingDemo` component to test the implementation:

```typescript
import { NotificationPollingDemo } from "@/components/NotificationPollingDemo";

// Add to your test page
<NotificationPollingDemo />;
```

**Test Scenarios:**

1. Start/stop polling manually
2. Switch tabs to test visibility changes
3. Simulate login/logout
4. Monitor error handling
5. Test network disconnection

## Configuration Examples

### 1. Real-time Chat Application

```typescript
useNotificationPollingService({
  baseInterval: 2000, // 2 seconds
  maxInterval: 10000, // 10 seconds max
  pollWhenHidden: true, // Continue when hidden
  useExponentialBackoff: true,
  maxErrors: 3,
});
```

### 2. E-commerce Notifications

```typescript
useNotificationPollingService({
  baseInterval: 30000, // 30 seconds
  maxInterval: 300000, // 5 minutes max
  pollWhenHidden: false, // Stop when hidden
  useExponentialBackoff: true,
  maxErrors: 5,
});
```

### 3. System Alerts

```typescript
useNotificationPollingService({
  baseInterval: 60000, // 1 minute
  maxInterval: 600000, // 10 minutes max
  pollWhenHidden: false, // Stop when hidden
  useExponentialBackoff: false, // No backoff for system alerts
  maxErrors: 10,
});
```

## Migration from Manual Refresh

If you're currently using manual refresh for notifications:

### Before (Manual Refresh)

```typescript
// Old approach - requires manual refresh
const handleRefresh = () => {
  refetch(); // User must click refresh button
};
```

### After (Automatic Polling)

```typescript
// New approach - automatic polling
useNotificationPollingService({
  baseInterval: 30000,
  autoStart: true,
});
// Notifications update automatically!
```

## Best Practices

1. **Choose Appropriate Intervals**: Balance between real-time updates and performance
2. **Handle Authentication**: Always check authentication state
3. **Respect User Privacy**: Stop polling when tab is hidden
4. **Monitor Performance**: Use the demo component to test behavior
5. **Configure Error Handling**: Set appropriate error thresholds
6. **Test Network Conditions**: Verify behavior with poor connectivity

## Troubleshooting

### Common Issues

1. **Polling Not Starting**

   - Check authentication state
   - Verify `autoStart: true`
   - Check browser console for errors

2. **Too Many Requests**

   - Increase `baseInterval`
   - Enable `useExponentialBackoff`
   - Reduce `maxErrors` threshold

3. **Polling Continues When Hidden**

   - Set `pollWhenHidden: false`
   - Check tab visibility detection

4. **Memory Leaks**
   - Ensure proper cleanup in useEffect
   - Check for multiple service instances

### Debug Information

Use the demo component to monitor:

- Polling status
- Error count
- Current interval
- Authentication state
- Tab visibility

This implementation provides a robust, efficient, and user-friendly notification polling system that automatically keeps your notifications up-to-date without requiring manual refreshes.
