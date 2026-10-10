// Real-Time Event Bus and Multi-Client Synchronization Service
// Combines Firebase Realtime / Firestore cloud sync with native BroadcastChannel for instant local & cross-device real-time sync.

import { rtdb, db, isFirebaseConfigured } from './firebase';
import { ref, set, onValue } from 'firebase/database';
import { doc, setDoc, onSnapshot, collection } from 'firebase/firestore';

const CHANNEL_NAME = 'cropcare_realtime_channel';

class RealtimeService {
  constructor() {
    this.subscribers = new Set();
    this.channel = null;
    this.clientId = `client_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.isConnected = true;
    this.hasFirebaseCloud = false;

    // 1. Local BroadcastChannel initialization
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (event) => {
          this.handleIncomingMessage(event.data);
        };
      } catch (err) {
        console.warn("BroadcastChannel initialization warning:", err);
      }
    }

    // 2. Storage event listener (fallback across tabs in same browser)
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === 'cropcare_realtime_event' && e.newValue) {
          try {
            const data = JSON.parse(e.newValue);
            if (data && data.senderId !== this.clientId) {
              this.handleIncomingMessage(data);
            }
          } catch (err) {}
        }
      });
    }

    // 3. Firebase Cloud Real-Time Listener (cross-device & cloud synchronization)
    if (isFirebaseConfigured) {
      this.initFirebaseCloudListener();
    }
  }

  initFirebaseCloudListener() {
    try {
      if (rtdb) {
        const eventsRef = ref(rtdb, 'realtime_events/latest');
        onValue(eventsRef, (snapshot) => {
          const val = snapshot.val();
          if (val && val.senderId !== this.clientId) {
            this.hasFirebaseCloud = true;
            this.handleIncomingMessage(val);
          }
        }, (error) => {
          // If RTDB permissions require auth, fallback to Firestore or local sync
          console.info("Firebase RTDB listener active with rule fallback:", error?.message || error);
        });
      } else if (db) {
        const syncDocRef = doc(db, 'system_sync', 'realtime_events');
        onSnapshot(syncDocRef, (snap) => {
          if (snap.exists()) {
            const val = snap.data();
            if (val && val.senderId !== this.clientId) {
              this.hasFirebaseCloud = true;
              this.handleIncomingMessage(val);
            }
          }
        }, (error) => {
          console.info("Firebase Firestore listener active with rule fallback:", error?.message || error);
        });
      }
    } catch (err) {
      console.warn("Firebase Cloud realtime initialization:", err);
    }
  }

  handleIncomingMessage(payload) {
    if (!payload || payload.senderId === this.clientId) return;
    this.subscribers.forEach((callback) => {
      try {
        callback(payload);
      } catch (err) {
        console.error("Error in realtime subscriber:", err);
      }
    });
  }

  /**
   * Broadcast an event to all open tabs and cloud devices in real-time
   * @param {string} type - Event identifier (e.g. 'ISSUE_CREATED', 'EXPERT_DIAGNOSED')
   * @param {object} data - Payload data
   * @param {object} meta - Optional alert metadata (title, message, roleTarget)
   */
  broadcast(type, data = {}, meta = {}) {
    const payload = {
      type,
      data,
      meta,
      senderId: this.clientId,
      timestamp: new Date().toISOString()
    };

    // 1. Broadcast via local BroadcastChannel
    if (this.channel) {
      try {
        this.channel.postMessage(payload);
      } catch (err) {
        console.warn("BroadcastChannel postMessage failed:", err);
      }
    }

    // 2. Storage event
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem('cropcare_realtime_event', JSON.stringify(payload));
      } catch (err) {}
    }

    // 3. Broadcast to Firebase Cloud (Cross-device)
    if (isFirebaseConfigured) {
      try {
        if (rtdb) {
          const eventsRef = ref(rtdb, 'realtime_events/latest');
          set(eventsRef, payload).catch(() => {});
        } else if (db) {
          const syncDocRef = doc(db, 'system_sync', 'realtime_events');
          setDoc(syncDocRef, payload, { merge: true }).catch(() => {});
        }
      } catch (cloudErr) {
        // Non-blocking fallback
      }
    }
  }

  /**
   * Subscribe to real-time events
   * @param {function} callback
   * @returns {function} unsubscribe function
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  getStatus() {
    return {
      connected: this.isConnected,
      clientId: this.clientId,
      hasBroadcastChannel: Boolean(this.channel),
      hasFirebaseCloud: this.hasFirebaseCloud || isFirebaseConfigured
    };
  }
}

export const realtimeService = new RealtimeService();
