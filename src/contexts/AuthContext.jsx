import { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    signInWithPopup,
    signInAnonymously,
    GoogleAuthProvider,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Determine provider
                const provider = firebaseUser.providerData[0]?.providerId || (firebaseUser.isAnonymous ? 'anonymous' : 'email');

                // Upsert user profile in Firestore
                const userRef = doc(db, 'users', firebaseUser.uid);
                await setDoc(userRef, {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email || null,
                    displayName: firebaseUser.displayName || user?.displayName || 'Anonymous',
                    photoURL: firebaseUser.photoURL || null,
                    provider: provider,
                    updatedAt: serverTimestamp(),
                }, { merge: true });

                // Ensure createdAt is only set once
                const snap = await getDoc(userRef);
                if (!snap.data()?.createdAt) {
                    await setDoc(userRef, { createdAt: serverTimestamp() }, { merge: true });
                }

                setUser(firebaseUser);
            } else {
                setUser(null);
            }
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
    const signupWithEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);
    const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
    const logout = () => signOut(auth);
    const signInAsGuest = () => signInAnonymously(auth);

    const value = {
        user,
        authLoading,
        loginWithGoogle,
        signupWithEmail,
        loginWithEmail,
        logout,
        signInAsGuest
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
