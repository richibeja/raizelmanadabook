// lib/firebase.ts
import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  getDoc,
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
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBvQvQvQvQvQvQvQvQvQvQvQvQvQvQvQvQ",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "raizel-manadabook.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "raizel-manadabook",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "raizel-manadabook.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789012:web:abcdef1234567890",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-XXXXXXXXXX",
};

// Initialize Firebase (prevent multiple instances)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Export services
export { db, auth, storage };
export default app;

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
  REPORTS: 'reports',
  // ManadaBook Circles/Groups
  CIRCLES: 'circles',
  CIRCLE_MEMBERS: 'circle_members',
  CIRCLE_POSTS: 'circle_posts',
  MOMENTS: 'moments',
  MARKETPLACE: 'marketplace_items'
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
    status: 'active', 
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

// ========================================
// USER PROFILES MANAGEMENT
// ========================================

export interface UserProfile {
  id: string;
  uid: string; // Firebase Auth UID
  username: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  bio?: string;
  location?: {
    city: string;
    country: string;
  };
  preferences: {
    privacy: 'public' | 'friends' | 'private';
    notifications: boolean;
    language: string;
  };
  stats: {
    followersCount: number;
    followingCount: number;
    petsCount: number;
    postsCount: number;
  };
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species: 'dog' | 'cat' | 'other';
  breed?: string;
  birthDate?: Date;
  gender?: 'male' | 'female';
  weight?: number; // kg
  photoURL?: string;
  bio?: string;
  isPublic: boolean;
  medicalInfo?: {
    vaccinated: boolean;
    spayed: boolean;
    allergies?: string[];
    conditions?: string[];
  };
  stats: {
    followersCount: number;
    postsCount: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Get user profile by UID
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const profileQuery = query(
      collection(db, COLLECTIONS.USERS), 
      where('uid', '==', uid)
    );
    const snapshot = await getDocs(profileQuery);
    
    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    
    return {
      id: doc.id,
      ...data,
      createdAt: toDate(data.createdAt),
      updatedAt: toDate(data.updatedAt)
    } as UserProfile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

// Create user profile (called after Firebase Auth registration)
export async function createUserProfile(userData: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.USERS), {
      ...userData,
      createdAt: timestamp(),
      updatedAt: timestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw new Error('Failed to create user profile');
  }
}

// Update user profile
export async function updateUserProfile(profileId: string, updates: Partial<UserProfile>): Promise<void> {
  try {
    const profileRef = doc(db, COLLECTIONS.USERS, profileId);
    await updateDoc(profileRef, {
      ...updates,
      updatedAt: timestamp()
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }
}

// ========================================
// PETS MANAGEMENT
// ========================================

// Create pet
export async function createPet(petData: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.PETS), {
      ...petData,
      createdAt: timestamp(),
      updatedAt: timestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating pet:', error);
    throw new Error('Failed to create pet');
  }
}

// Get pets by owner
export function subscribeToUserPets(
  ownerId: string,
  callback: (pets: Pet[]) => void
): () => void {
  try {
    const petsQuery = query(
      collection(db, COLLECTIONS.PETS),
      where('ownerId', '==', ownerId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(petsQuery, (snapshot) => {
      const pets: Pet[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          birthDate: data.birthDate ? toDate(data.birthDate) : undefined,
          createdAt: toDate(data.createdAt),
          updatedAt: toDate(data.updatedAt)
        } as Pet;
      });
      callback(pets);
    });
  } catch (error) {
    console.error('Error setting up pets subscription:', error);
    return () => {};
  }
}

// Update pet
export async function updatePet(petId: string, updates: Partial<Pet>): Promise<void> {
  try {
    const petRef = doc(db, COLLECTIONS.PETS, petId);
    await updateDoc(petRef, {
      ...updates,
      updatedAt: timestamp()
    });
  } catch (error) {
    console.error('Error updating pet:', error);
    throw new Error('Failed to update pet');
  }
}

// Delete pet
export async function deletePet(petId: string): Promise<void> {
  try {
    const petRef = doc(db, COLLECTIONS.PETS, petId);
    await deleteDoc(petRef);
  } catch (error) {
    console.error('Error deleting pet:', error);
    throw new Error('Failed to delete pet');
  }
}

// ========================================
// CIRCLES/GROUPS MANAGEMENT
// ========================================

export interface Circle {
  id: string;
  name: string;
  description: string;
  photoURL?: string;
  coverURL?: string;
  isPrivate: boolean;
  requiresApproval: boolean;
  location?: {
    city: string;
    country: string;
  };
  tags: string[];
  rules?: string[];
  stats: {
    membersCount: number;
    postsCount: number;
    activeMembers: number;
  };
  settings: {
    allowPosts: boolean;
    allowEvents: boolean;
    allowMarketplace: boolean;
  };
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CircleMember {
  id: string;
  circleId: string;
  userId: string;
  role: 'admin' | 'moderator' | 'member';
  status: 'active' | 'pending' | 'banned';
  joinedAt: Date;
  invitedBy?: string;
  permissions?: {
    canPost: boolean;
    canInvite: boolean;
    canModerate: boolean;
  };
}

export interface CirclePost {
  id: string;
  circleId: string;
  authorId: string;
  content: string;
  mediaUrls?: string[];
  tags?: string[];
  isAnnouncement: boolean;
  isPinned: boolean;
  stats: {
    likesCount: number;
    commentsCount: number;
    sharesCount: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Create new circle
export async function createCircle(circleData: Omit<Circle, 'id' | 'createdAt' | 'updatedAt' | 'stats'>): Promise<string> {
  try {
    const newCircle = {
      ...circleData,
      stats: {
        membersCount: 1, // Creator is first member
        postsCount: 0,
        activeMembers: 1
      },
      createdAt: timestamp(),
      updatedAt: timestamp()
    };

    const docRef = await addDoc(collection(db, COLLECTIONS.CIRCLES), newCircle);
    
    // Add creator as admin member
    await addDoc(collection(db, COLLECTIONS.CIRCLE_MEMBERS), {
      circleId: docRef.id,
      userId: circleData.createdBy,
      role: 'admin',
      status: 'active',
      joinedAt: timestamp(),
      permissions: {
        canPost: true,
        canInvite: true,
        canModerate: true
      }
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating circle:', error);
    throw new Error('Failed to create circle');
  }
}

// Get circles with real-time updates
export function subscribeToCircles(
  filters: { city?: string; tags?: string[]; limit?: number } = {},
  callback: (circles: Circle[]) => void
): () => void {
  try {
    const constraints: QueryConstraint[] = [];
    
    // Filtros
    if (filters.city) {
      constraints.push(where('location.city', '==', filters.city));
    }
    
    if (filters.tags && filters.tags.length > 0) {
      constraints.push(where('tags', 'array-contains-any', filters.tags));
    }
    
    // Solo círculos públicos por defecto
    constraints.push(where('isPrivate', '==', false));
    constraints.push(orderBy('stats.membersCount', 'desc'));
    
    if (filters.limit) {
      constraints.push(limit(filters.limit));
    }

    const circlesQuery = query(collection(db, COLLECTIONS.CIRCLES), ...constraints);

    return onSnapshot(circlesQuery, (snapshot) => {
      const circles: Circle[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: toDate(data.createdAt),
          updatedAt: toDate(data.updatedAt)
        } as Circle;
      });
      callback(circles);
    });
  } catch (error) {
    console.error('Error setting up circles subscription:', error);
    return () => {};
  }
}

// Get user's circles
export function subscribeToUserCircles(
  userId: string,
  callback: (circles: Circle[]) => void
): () => void {
  try {
    // First get user's memberships
    const membershipsQuery = query(
      collection(db, COLLECTIONS.CIRCLE_MEMBERS),
      where('userId', '==', userId),
      where('status', '==', 'active')
    );

    return onSnapshot(membershipsQuery, async (membershipsSnapshot) => {
      const circleIds = membershipsSnapshot.docs.map(doc => doc.data().circleId);
      
      if (circleIds.length === 0) {
        callback([]);
        return;
      }

      // Get circles data
      const circlesQuery = query(
        collection(db, COLLECTIONS.CIRCLES),
        where('__name__', 'in', circleIds)
      );
      
      const circlesSnapshot = await getDocs(circlesQuery);
      const circles: Circle[] = circlesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: toDate(data.createdAt),
          updatedAt: toDate(data.updatedAt)
        } as Circle;
      });
      
      callback(circles);
    });
  } catch (error) {
    console.error('Error setting up user circles subscription:', error);
    return () => {};
  }
}

// Join circle
export async function joinCircle(circleId: string, userId: string): Promise<void> {
  try {
    // Check if already member
    const memberQuery = query(
      collection(db, COLLECTIONS.CIRCLE_MEMBERS),
      where('circleId', '==', circleId),
      where('userId', '==', userId)
    );
    const existingMember = await getDocs(memberQuery);
    
    if (!existingMember.empty) {
      throw new Error('Ya eres miembro de este círculo');
    }

    // Add as member
    await addDoc(collection(db, COLLECTIONS.CIRCLE_MEMBERS), {
      circleId,
      userId,
      role: 'member',
      status: 'active',
      joinedAt: timestamp(),
      permissions: {
        canPost: true,
        canInvite: false,
        canModerate: false
      }
    });

    // Update circle stats
    const circleRef = doc(db, COLLECTIONS.CIRCLES, circleId);
    const circleDoc = await getDoc(circleRef);
    if (circleDoc.exists()) {
      const currentCount = circleDoc.data().stats?.membersCount || 0;
      await updateDoc(circleRef, {
        'stats.membersCount': currentCount + 1,
        'stats.activeMembers': currentCount + 1,
        updatedAt: timestamp()
      });
    }
  } catch (error) {
    console.error('Error joining circle:', error);
    throw new Error('Failed to join circle');
  }
}

// Leave circle
export async function leaveCircle(circleId: string, userId: string): Promise<void> {
  try {
    const memberQuery = query(
      collection(db, COLLECTIONS.CIRCLE_MEMBERS),
      where('circleId', '==', circleId),
      where('userId', '==', userId)
    );
    const memberSnapshot = await getDocs(memberQuery);
    
    if (memberSnapshot.empty) {
      throw new Error('No eres miembro de este círculo');
    }

    const memberDoc = memberSnapshot.docs[0];
    const memberData = memberDoc.data();
    
    // Check if user is admin
    if (memberData.role === 'admin') {
      // Check if there are other admins
      const adminsQuery = query(
        collection(db, COLLECTIONS.CIRCLE_MEMBERS),
        where('circleId', '==', circleId),
        where('role', '==', 'admin'),
        where('status', '==', 'active')
      );
      const adminsSnapshot = await getDocs(adminsQuery);
      
      if (adminsSnapshot.docs.length <= 1) {
        throw new Error('No puedes salir: eres el único administrador del círculo');
      }
    }

    // Remove membership
    await deleteDoc(memberDoc.ref);

    // Update circle stats
    const circleRef = doc(db, COLLECTIONS.CIRCLES, circleId);
    const circleDoc = await getDoc(circleRef);
    if (circleDoc.exists()) {
      const currentCount = circleDoc.data().stats?.membersCount || 0;
      await updateDoc(circleRef, {
        'stats.membersCount': Math.max(0, currentCount - 1),
        'stats.activeMembers': Math.max(0, currentCount - 1),
        updatedAt: timestamp()
      });
    }
  } catch (error) {
    console.error('Error leaving circle:', error);
    throw new Error('Failed to leave circle');
  }
}

// Get circle members
export function subscribeToCircleMembers(
  circleId: string,
  callback: (members: CircleMember[]) => void
): () => void {
  try {
    const membersQuery = query(
      collection(db, COLLECTIONS.CIRCLE_MEMBERS),
      where('circleId', '==', circleId),
      where('status', '==', 'active'),
      orderBy('joinedAt', 'asc')
    );

    return onSnapshot(membersQuery, (snapshot) => {
      const members: CircleMember[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          joinedAt: toDate(data.joinedAt)
        } as CircleMember;
      });
      callback(members);
    });
  } catch (error) {
    console.error('Error setting up circle members subscription:', error);
    return () => {};
  }
}

// Update member role (admin only)
export async function updateMemberRole(
  circleId: string,
  memberId: string,
  newRole: 'admin' | 'moderator' | 'member',
  currentUserRole: string
): Promise<void> {
  try {
    if (currentUserRole !== 'admin') {
      throw new Error('Solo los administradores pueden cambiar roles');
    }

    const memberRef = doc(db, COLLECTIONS.CIRCLE_MEMBERS, memberId);
    await updateDoc(memberRef, {
      role: newRole,
      permissions: {
        canPost: true,
        canInvite: newRole === 'admin' || newRole === 'moderator',
        canModerate: newRole === 'admin' || newRole === 'moderator'
      }
    });
  } catch (error) {
    console.error('Error updating member role:', error);
    throw new Error('Failed to update member role');
  }
}

// Kick member (admin/moderator only)  
export async function kickMember(
  circleId: string,
  memberId: string,
  currentUserRole: string
): Promise<void> {
  try {
    if (currentUserRole !== 'admin' && currentUserRole !== 'moderator') {
      throw new Error('No tienes permisos para expulsar miembros');
    }

    const memberRef = doc(db, COLLECTIONS.CIRCLE_MEMBERS, memberId);
    const memberDoc = await getDoc(memberRef);
    
    if (!memberDoc.exists()) {
      throw new Error('Miembro no encontrado');
    }
    
    const memberData = memberDoc.data();
    if (memberData.role === 'admin' && currentUserRole !== 'admin') {
      throw new Error('No puedes expulsar a un administrador');
    }

    await deleteDoc(memberRef);

    // Update circle stats
    const circleRef = doc(db, COLLECTIONS.CIRCLES, circleId);
    const circleDoc = await getDoc(circleRef);
    if (circleDoc.exists()) {
      const currentCount = circleDoc.data().stats?.membersCount || 0;
      await updateDoc(circleRef, {
        'stats.membersCount': Math.max(0, currentCount - 1),
        'stats.activeMembers': Math.max(0, currentCount - 1),
        updatedAt: timestamp()
      });
    }
  } catch (error) {
    console.error('Error kicking member:', error);
    throw new Error('Failed to kick member');
  }
}

// ========================================
// MOMENTS EFÍMEROS (24H TTL)
// ========================================

export interface Moment {
  id: string;
  authorId: string;
  content?: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  duration?: number; // For videos in seconds
  circleId?: string; // Optional: moment for specific circle
  location?: {
    city: string;
    country: string;
  };
  tags?: string[];
  stats: {
    viewsCount: number;
    likesCount: number;
    reactionsCount: number;
  };
  isActive: boolean;
  createdAt: Date;
  expiresAt: Date; // Auto-delete after 24h
}

export interface MomentView {
  id: string;
  momentId: string;
  viewerId: string;
  viewedAt: Date;
  completed: boolean; // If video was watched to completion
}

// Create new moment (auto-expire in 24h)
export async function createMoment(momentData: Omit<Moment, 'id' | 'createdAt' | 'expiresAt' | 'stats' | 'isActive'>): Promise<string> {
  try {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    const newMoment = {
      ...momentData,
      stats: {
        viewsCount: 0,
        likesCount: 0,
        reactionsCount: 0
      },
      isActive: true,
      createdAt: timestamp(),
      expiresAt: expiresAt
    };

    const docRef = await addDoc(collection(db, COLLECTIONS.MOMENTS), newMoment);
    return docRef.id;
  } catch (error) {
    console.error('Error creating moment:', error);
    throw new Error('Failed to create moment');
  }
}

// Get active moments (tiempo real, auto-filter expired)
export function subscribeToMoments(
  filters: { authorId?: string; circleId?: string; limit?: number } = {},
  callback: (moments: Moment[]) => void
): () => void {
  try {
    const constraints: QueryConstraint[] = [];
    
    // Solo moments activos
    constraints.push(where('isActive', '==', true));
    
    // Filtrar por momento no expirado (server-side filter)
    const now = new Date();
    constraints.push(where('expiresAt', '>', now));
    
    // Filtros adicionales
    if (filters.authorId) {
      constraints.push(where('authorId', '==', filters.authorId));
    }
    
    if (filters.circleId) {
      constraints.push(where('circleId', '==', filters.circleId));
    }
    
    // Ordenar por más recientes
    constraints.push(orderBy('createdAt', 'desc'));
    
    if (filters.limit) {
      constraints.push(limit(filters.limit));
    }

    const momentsQuery = query(collection(db, COLLECTIONS.MOMENTS), ...constraints);

    return onSnapshot(momentsQuery, (snapshot) => {
      const moments: Moment[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: toDate(data.createdAt),
          expiresAt: toDate(data.expiresAt)
        } as Moment;
      });
      
      // Double-check expiration client-side (backup)
      const activeMoments = moments.filter(moment => moment.expiresAt > new Date());
      callback(activeMoments);
    });
  } catch (error) {
    console.error('Error setting up moments subscription:', error);
    return () => {};
  }
}

// Record moment view
export async function recordMomentView(momentId: string, viewerId: string, completed: boolean = false): Promise<void> {
  try {
    // Check if already viewed by this user
    const viewQuery = query(
      collection(db, 'moment_views'),
      where('momentId', '==', momentId),
      where('viewerId', '==', viewerId)
    );
    const existingView = await getDocs(viewQuery);
    
    if (existingView.empty) {
      // Record new view
      await addDoc(collection(db, 'moment_views'), {
        momentId,
        viewerId,
        viewedAt: timestamp(),
        completed
      });

      // Update moment stats
      const momentRef = doc(db, COLLECTIONS.MOMENTS, momentId);
      const momentDoc = await getDoc(momentRef);
      if (momentDoc.exists()) {
        const currentViews = momentDoc.data().stats?.viewsCount || 0;
        await updateDoc(momentRef, {
          'stats.viewsCount': currentViews + 1
        });
      }
    } else if (completed) {
      // Update completion status
      const viewDoc = existingView.docs[0];
      await updateDoc(viewDoc.ref, { completed: true });
    }
  } catch (error) {
    console.error('Error recording moment view:', error);
  }
}

// Delete expired moments (for cleanup job)
export async function cleanupExpiredMoments(): Promise<void> {
  try {
    const now = new Date();
    const expiredQuery = query(
      collection(db, COLLECTIONS.MOMENTS),
      where('expiresAt', '<=', now),
      where('isActive', '==', true)
    );
    
    const expiredSnapshot = await getDocs(expiredQuery);
    
    // Mark as inactive instead of deleting (for analytics)
    const batch = expiredSnapshot.docs.map(doc => 
      updateDoc(doc.ref, { isActive: false })
    );
    
    await Promise.all(batch);
    console.log(`Cleaned up ${expiredSnapshot.docs.length} expired moments`);
  } catch (error) {
    console.error('Error cleaning up expired moments:', error);
  }
}

// ========================================
// MARKETPLACE ITEMS
// ========================================

export interface MarketplaceItem {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  category: 'food' | 'toys' | 'accessories' | 'health' | 'services' | 'other';
  subcategory?: string;
  price: number;
  currency: 'COP' | 'USD';
  condition: 'new' | 'like-new' | 'good' | 'fair';
  photos: string[];
  location: {
    city: string;
    country: string;
    zipCode?: string;
  };
  shipping: {
    available: boolean;
    cost?: number;
    methods: string[];
  };
  status: 'active' | 'sold' | 'reserved' | 'inactive';
  stats: {
    viewsCount: number;
    favoritesCount: number;
    inquiriesCount: number;
  };
  tags: string[];
  specifications?: Record<string, string>;
  relatedPets?: string[]; // Pet IDs this item is for
  createdAt: Date;
  updatedAt: Date;
  soldAt?: Date;
  isPromoted: boolean;
}

export interface MarketplaceFavorite {
  id: string;
  userId: string;
  itemId: string;
  createdAt: Date;
}

export interface MarketplaceInquiry {
  id: string;
  itemId: string;
  buyerId: string;
  sellerId: string;
  message: string;
  status: 'pending' | 'answered' | 'closed';
  createdAt: Date;
}

// Create marketplace item
export async function createMarketplaceItem(itemData: Omit<MarketplaceItem, 'id' | 'createdAt' | 'updatedAt' | 'stats'>): Promise<string> {
  try {
    const newItem = {
      ...itemData,
      stats: {
        viewsCount: 0,
        favoritesCount: 0,
        inquiriesCount: 0
      },
      createdAt: timestamp(),
      updatedAt: timestamp()
    };

    const docRef = await addDoc(collection(db, COLLECTIONS.MARKETPLACE), newItem);
    return docRef.id;
  } catch (error) {
    console.error('Error creating marketplace item:', error);
    throw new Error('Failed to create marketplace item');
  }
}

// Get marketplace items with real-time updates
export function subscribeToMarketplaceItems(
  filters: { 
    category?: string; 
    city?: string; 
    priceMin?: number; 
    priceMax?: number; 
    sellerId?: string;
    search?: string;
    limit?: number;
  } = {},
  callback: (items: MarketplaceItem[]) => void
): () => void {
  try {
    const constraints: QueryConstraint[] = [];
    
    // Solo items activos
    constraints.push(where('status', '==', 'active'));
    
    // Filtros
    if (filters.category) {
      constraints.push(where('category', '==', filters.category));
    }
    
    if (filters.city) {
      constraints.push(where('location.city', '==', filters.city));
    }
    
    if (filters.sellerId) {
      constraints.push(where('sellerId', '==', filters.sellerId));
    }
    
    // Ordenar por más recientes
    constraints.push(orderBy('createdAt', 'desc'));
    
    if (filters.limit) {
      constraints.push(limit(filters.limit));
    }

    const itemsQuery = query(collection(db, COLLECTIONS.MARKETPLACE), ...constraints);

    return onSnapshot(itemsQuery, (snapshot) => {
      const items: MarketplaceItem[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: toDate(data.createdAt),
          updatedAt: toDate(data.updatedAt),
          soldAt: data.soldAt ? toDate(data.soldAt) : undefined
        } as MarketplaceItem;
      });
      
      // Aplicar filtros de precio localmente
      let filteredItems = items;
      if (filters.priceMin !== undefined) {
        filteredItems = filteredItems.filter(item => item.price >= filters.priceMin!);
      }
      if (filters.priceMax !== undefined) {
        filteredItems = filteredItems.filter(item => item.price <= filters.priceMax!);
      }
      
      // Aplicar filtro de búsqueda localmente
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredItems = filteredItems.filter(item =>
          item.title.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }
      
      callback(filteredItems);
    });
  } catch (error) {
    console.error('Error setting up marketplace subscription:', error);
    return () => {};
  }
}

// Update item status (mark as sold)
export async function updateMarketplaceItemStatus(
  itemId: string, 
  status: MarketplaceItem['status'],
  sellerId: string
): Promise<void> {
  try {
    // Verify seller ownership
    const itemRef = doc(db, COLLECTIONS.MARKETPLACE, itemId);
    const itemDoc = await getDoc(itemRef);
    
    if (!itemDoc.exists()) {
      throw new Error('Artículo no encontrado');
    }
    
    const itemData = itemDoc.data();
    if (itemData.sellerId !== sellerId) {
      throw new Error('No tienes permisos para modificar este artículo');
    }

    const updateData: any = {
      status,
      updatedAt: timestamp()
    };
    
    if (status === 'sold') {
      updateData.soldAt = timestamp();
    }

    await updateDoc(itemRef, updateData);
  } catch (error) {
    console.error('Error updating marketplace item status:', error);
    throw new Error('Failed to update item status');
  }
}

// Add to favorites
export async function addToFavorites(itemId: string, userId: string): Promise<void> {
  try {
    // Check if already favorited
    const favoriteQuery = query(
      collection(db, 'marketplace_favorites'),
      where('itemId', '==', itemId),
      where('userId', '==', userId)
    );
    const existingFavorite = await getDocs(favoriteQuery);
    
    if (!existingFavorite.empty) {
      throw new Error('Ya está en favoritos');
    }

    // Add favorite
    await addDoc(collection(db, 'marketplace_favorites'), {
      itemId,
      userId,
      createdAt: timestamp()
    });

    // Update item stats
    const itemRef = doc(db, COLLECTIONS.MARKETPLACE, itemId);
    const itemDoc = await getDoc(itemRef);
    if (itemDoc.exists()) {
      const currentFavorites = itemDoc.data().stats?.favoritesCount || 0;
      await updateDoc(itemRef, {
        'stats.favoritesCount': currentFavorites + 1
      });
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw new Error('Failed to add to favorites');
  }
}

// Remove from favorites
export async function removeFromFavorites(itemId: string, userId: string): Promise<void> {
  try {
    const favoriteQuery = query(
      collection(db, 'marketplace_favorites'),
      where('itemId', '==', itemId),
      where('userId', '==', userId)
    );
    const favoriteSnapshot = await getDocs(favoriteQuery);
    
    if (favoriteSnapshot.empty) {
      throw new Error('No está en favoritos');
    }

    // Remove favorite
    await deleteDoc(favoriteSnapshot.docs[0].ref);

    // Update item stats
    const itemRef = doc(db, COLLECTIONS.MARKETPLACE, itemId);
    const itemDoc = await getDoc(itemRef);
    if (itemDoc.exists()) {
      const currentFavorites = itemDoc.data().stats?.favoritesCount || 0;
      await updateDoc(itemRef, {
        'stats.favoritesCount': Math.max(0, currentFavorites - 1)
      });
    }
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw new Error('Failed to remove from favorites');
  }
}

