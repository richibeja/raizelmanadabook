// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  limit,
  QueryConstraint,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup 
} from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Export services
export { db, auth, storage };

// ========================================
// TYPES & INTERFACES
// ========================================

export interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ad {
  id: string;
  ownerId: string;
  campaignName: string;
  adType: 'banner' | 'story' | 'feed';
  targetAudience: {
    species?: string[];
    ageRange?: string[];
    location?: string[];
    interests?: string[];
  };
  budget: number;
  bidType: 'CPM' | 'CPC';
  bidAmount: number;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'active' | 'paused' | 'completed' | 'rejected';
  approvalStatus: 'pending' | 'approved' | 'rejected';
  impressions: number;
  clicks: number;
  ctr: number;
  spend: number;
  creative: {
    title: string;
    description: string;
    imageUrl: string;
    ctaText: string;
    landingUrl: string;
  };
  createdAt: Date;
  updatedAt: Date;
  ownerUsername: string;
  ownerVerified: boolean;
  rejectionReason?: string;
  stripePaymentIntentId?: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  description: string;
}

// ========================================
// COLLECTION NAMES
// ========================================

export const COLLECTIONS = {
  USERS: 'users',
  ADS: 'ads',
  SPONSORS: 'sponsors',
  PETS: 'pets',
  CONVERSATIONS: 'conversations',
  ANALYTICS: 'analytics',
  REPORTS: 'reports'
} as const;

// ========================================
// HELPER FUNCTIONS
// ========================================

export const timestamp = serverTimestamp;

// Convert Firestore timestamp to Date
export const toDate = (timestamp: any): Date => {
  if (!timestamp) return new Date();
  return timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
};

// ========================================
// SPONSORS (EXISTING FUNCTIONALITY)
// ========================================

export async function getSponsors(): Promise<Sponsor[]> {
  const sponsorsCol = collection(db, COLLECTIONS.SPONSORS);
  const sponsorSnapshot = await getDocs(sponsorsCol);
  const sponsorList = sponsorSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Sponsor[];
  return sponsorList;
}

// ========================================
// ADS MANAGEMENT FUNCTIONS
// ========================================

export interface AdsFilters {
  status?: string;
  approvalStatus?: string;
  adType?: string;
  ownerId?: string;
}

// Create new ad
export async function createAd(adData: Omit<Ad, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.ADS), {
      ...adData,
      createdAt: timestamp(),
      updatedAt: timestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating ad:', error);
    throw new Error('Failed to create ad');
  }
}

// Update ad
export async function updateAd(adId: string, updates: Partial<Ad>): Promise<void> {
  try {
    const adRef = doc(db, COLLECTIONS.ADS, adId);
    await updateDoc(adRef, {
      ...updates,
      updatedAt: timestamp()
    });
  } catch (error) {
    console.error('Error updating ad:', error);
    throw new Error('Failed to update ad');
  }
}

// Delete ad  
export async function deleteAd(adId: string): Promise<void> {
  try {
    const adRef = doc(db, COLLECTIONS.ADS, adId);
    await deleteDoc(adRef);
  } catch (error) {
    console.error('Error deleting ad:', error);
    throw new Error('Failed to delete ad');
  }
}

// Get ads with real-time updates
export function subscribeToAds(
  filters: AdsFilters = {},
  callback: (ads: Ad[]) => void,
  limitCount: number = 20
): () => void {
  try {
    let adsQuery = collection(db, COLLECTIONS.ADS);
    const constraints: QueryConstraint[] = [];

    // Apply filters
    if (filters.status && filters.status !== 'all') {
      constraints.push(where('status', '==', filters.status));
    }
    if (filters.approvalStatus && filters.approvalStatus !== 'all') {
      constraints.push(where('approvalStatus', '==', filters.approvalStatus));
    }
    if (filters.adType && filters.adType !== 'all') {
      constraints.push(where('adType', '==', filters.adType));
    }
    if (filters.ownerId) {
      constraints.push(where('ownerId', '==', filters.ownerId));
    }

    // Add ordering and limit
    constraints.push(orderBy('createdAt', 'desc'));
    constraints.push(limit(limitCount));

    const q = query(adsQuery, ...constraints);

    // Subscribe to real-time updates
    return onSnapshot(q, (snapshot) => {
      const ads: Ad[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          startDate: toDate(data.startDate),
          endDate: toDate(data.endDate),
          createdAt: toDate(data.createdAt),
          updatedAt: toDate(data.updatedAt)
        } as Ad;
      });
      callback(ads);
    }, (error) => {
      console.error('Error in ads subscription:', error);
    });
  } catch (error) {
    console.error('Error setting up ads subscription:', error);
    return () => {}; // Return empty unsubscribe function
  }
}

// Ad status actions
export async function approveAd(adId: string): Promise<void> {
  await updateAd(adId, { 
    status: 'approved', 
    approvalStatus: 'approved' 
  });
}

export async function rejectAd(adId: string, reason: string): Promise<void> {
  await updateAd(adId, { 
    status: 'rejected',
    approvalStatus: 'rejected',
    rejectionReason: reason 
  });
}

export async function pauseAd(adId: string): Promise<void> {
  await updateAd(adId, { status: 'paused' });
}

export async function resumeAd(adId: string): Promise<void> {
  await updateAd(adId, { status: 'active' });
}

// ========================================
// AUTHENTICATION FUNCTIONS
// ========================================

// Sign in with email and password
export async function signInUser(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

// Register new user
export async function registerUser(email: string, password: string, userData: Partial<User>) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user document in Firestore
    await addDoc(collection(db, COLLECTIONS.USERS), {
      id: userCredential.user.uid,
      email: email,
      username: userData.username || email.split('@')[0],
      displayName: userData.displayName || '',
      isVerified: false,
      createdAt: timestamp(),
      updatedAt: timestamp()
    });

    return userCredential.user;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

// Sign in with Google
export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
}

// Sign out
export async function signOutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

// Auth state observer
export function onAuthStateChange(callback: (user: any) => void) {
  return onAuthStateChanged(auth, callback);
}

