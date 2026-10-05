/**
 * IndexedDB Permanent Storage Engine for KisanRakshak
 * Stores full-resolution video/image files and reels metadata permanently on the user's device
 * No localStorage 5MB quota restrictions; supports gigabytes of video recordings.
 */

import { DisasterReel } from '../types';

const DB_NAME = 'KisanRakshak_PermanentDB_v2';
const DB_VERSION = 1;
const STORE_REELS = 'custom_disaster_reels';
const STORE_BLOBS = 'media_video_blobs';

class IndexedDbService {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private memoryBlobUrls: Map<string, string> = new Map();

  private getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB not supported in this environment'));
        return;
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_REELS)) {
          db.createObjectStore(STORE_REELS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_BLOBS)) {
          db.createObjectStore(STORE_BLOBS);
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });

    return this.dbPromise;
  }

  /**
   * Save a user or admin uploaded reel permanently into IndexedDB
   */
  async saveReelPermanently(reel: DisasterReel, mediaBlob?: Blob | File | null): Promise<void> {
    try {
      const db = await this.getDB();

      // If a physical Blob/File was uploaded, store it in the binary store
      if (mediaBlob) {
        await new Promise<void>((resolve, reject) => {
          const tx = db.transaction([STORE_BLOBS], 'readwrite');
          const store = tx.objectStore(STORE_BLOBS);
          const putReq = store.put(mediaBlob, reel.id);
          putReq.onsuccess = () => resolve();
          putReq.onerror = () => reject(putReq.error);
        });

        // Create in-memory URL for immediate zero-lag playback
        const objectUrl = URL.createObjectURL(mediaBlob);
        this.memoryBlobUrls.set(reel.id, objectUrl);
        reel.mediaUrl = objectUrl;
      }

      // Store reel metadata in IndexedDB
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction([STORE_REELS], 'readwrite');
        const store = tx.objectStore(STORE_REELS);
        // Clean reel object before storing (don't store temporary blob: URL in metadata)
        const toStore = {
          ...reel,
          hasBlob: !!mediaBlob,
        };
        const putReq = store.put(toStore);
        putReq.onsuccess = () => resolve();
        putReq.onerror = () => reject(putReq.error);
      });
    } catch (err) {
      console.warn('Permanent IndexedDB save warning:', err);
    }
  }

  /**
   * Load all permanent user reels from IndexedDB and resolve their video blobs
   */
  async loadAllPermanentReels(): Promise<DisasterReel[]> {
    try {
      const db = await this.getDB();

      const storedReels = await new Promise<any[]>((resolve, reject) => {
        const tx = db.transaction([STORE_REELS], 'readonly');
        const store = tx.objectStore(STORE_REELS);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });

      if (!storedReels || storedReels.length === 0) {
        return [];
      }

      // Rehydrate binary blobs into valid Object URLs
      const rehydratedReels: DisasterReel[] = [];

      for (const item of storedReels) {
        let finalMediaUrl = item.mediaUrl;

        if (item.hasBlob) {
          if (this.memoryBlobUrls.has(item.id)) {
            finalMediaUrl = this.memoryBlobUrls.get(item.id)!;
          } else {
            // Fetch blob from STORE_BLOBS
            const blob = await new Promise<Blob | undefined>((resolve) => {
              const tx = db.transaction([STORE_BLOBS], 'readonly');
              const store = tx.objectStore(STORE_BLOBS);
              const req = store.get(item.id);
              req.onsuccess = () => resolve(req.result);
              req.onerror = () => resolve(undefined);
            });

            if (blob) {
              finalMediaUrl = URL.createObjectURL(blob);
              this.memoryBlobUrls.set(item.id, finalMediaUrl);
            }
          }
        }

        rehydratedReels.push({
          ...item,
          mediaUrl: finalMediaUrl || item.mediaUrl,
        });
      }

      // Sort newest first
      return rehydratedReels.sort((a, b) => {
        const timeA = parseInt(a.id.replace('reel-', '')) || 0;
        const timeB = parseInt(b.id.replace('reel-', '')) || 0;
        return timeB - timeA;
      });
    } catch (err) {
      console.warn('Permanent IndexedDB load warning:', err);
      return [];
    }
  }

  /**
   * Delete reel permanently from IndexedDB
   */
  async deleteReelPermanently(id: string): Promise<void> {
    try {
      const db = await this.getDB();
      await new Promise<void>((resolve) => {
        const tx = db.transaction([STORE_REELS, STORE_BLOBS], 'readwrite');
        tx.objectStore(STORE_REELS).delete(id);
        tx.objectStore(STORE_BLOBS).delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });

      if (this.memoryBlobUrls.has(id)) {
        URL.revokeObjectURL(this.memoryBlobUrls.get(id)!);
        this.memoryBlobUrls.delete(id);
      }
    } catch (err) {
      console.warn('Permanent IndexedDB delete warning:', err);
    }
  }
}

export const permanentMediaDb = new IndexedDbService();
