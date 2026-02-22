import {
    doc, collection,
    getDoc, setDoc, deleteDoc, updateDoc,
    query, where, orderBy, limit, getDocs,
    increment, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { fetchDetails } from '../api/tmdb';

// ─────────────────────────────────────────────
// VIEW TRACKING
// When a user hits Play, increment viewCount on the content doc
// and recalculate popularity: viewCount*2 + likeCount*3
// ─────────────────────────────────────────────
export async function trackView(contentId) {
    try {
        const ref = doc(db, 'content', contentId);
        await updateDoc(ref, {
            viewCount: increment(1),
            popularity: increment(2), // each view = +2 popularity
        });
    } catch (err) {
        console.error('[trackView]', err);
    }
}

// ─────────────────────────────────────────────
// LIKE SYSTEM
// Toggle like for a user on a content item.
// Returns true if liked, false if unliked.
// ─────────────────────────────────────────────
export async function toggleLike(contentId, uid) {
    if (!uid) throw new Error('Must be signed in to like content');

    const likeId = `${uid}_${contentId}`;
    const likeRef = doc(db, 'likes', likeId);
    const contentRef = doc(db, 'content', contentId);

    const likeSnap = await getDoc(likeRef);

    if (likeSnap.exists()) {
        // Unlike: remove like doc, decrement likeCount, subtract popularity
        await deleteDoc(likeRef);
        await updateDoc(contentRef, {
            likeCount: increment(-1),
            popularity: increment(-3),
        });
        return false; // now unliked
    } else {
        // Like: create like doc, increment likeCount, add popularity
        await setDoc(likeRef, {
            userId: uid,
            contentId,
            createdAt: serverTimestamp(),
        });
        await updateDoc(contentRef, {
            likeCount: increment(1),
            popularity: increment(3),
        });
        return true; // now liked
    }
}

// Check if a user has liked a content item
export async function checkLiked(contentId, uid) {
    if (!uid) return false;
    const likeRef = doc(db, 'likes', `${uid}_${contentId}`);
    const snap = await getDoc(likeRef);
    return snap.exists();
}

// ─────────────────────────────────────────────
// WATCH HISTORY
// Upsert a watch history record. progress is 0-100 (%).
// ─────────────────────────────────────────────
export async function upsertWatchHistory(contentId, uid, progress = 0, duration = 0) {
    if (!uid) throw new Error('Must be signed in to save watch history');

    const historyId = `${uid}_${contentId}`;
    const ref = doc(db, 'watchHistory', historyId);

    await setDoc(ref, {
        userId: uid,
        contentId,
        progress,
        duration, // total duration in minutes
        lastWatched: serverTimestamp(),
        updatedAt: serverTimestamp(),
    }, { merge: true });
}

// Get full watch history for a user (most recent first)
export async function fetchWatchHistory(uid, limitCount = 20) {
    if (!uid) return [];
    const q = query(
        collection(db, 'watchHistory'),
        where('userId', '==', uid),
        orderBy('lastWatched', 'desc'),
        limit(limitCount)
    );
    const snap = await getDocs(q);

    const history = [];
    for (const d of snap.docs) {
        const data = d.data();
        try {
            const contentData = await fetchDetails(data.contentId);
            if (contentData) {
                history.push({
                    id: d.id,
                    ...data,
                    content: {
                        id: contentData.id.toString(),
                        ...contentData
                    }
                });
            }
        } catch (error) {
            console.error("Failed to fetch TMDB details for history item", error);
        }
    }
    return history;
}

// ─────────────────────────────────────────────
// PROFILE STATS
// Calculate total watch time and completed titles
// ─────────────────────────────────────────────
export async function fetchWatchStats(uid) {
    if (!uid) return { totalWatchTimeHours: 0, completedTitles: 0 };

    const q = query(collection(db, 'watchHistory'), where('userId', '==', uid));
    const snap = await getDocs(q);

    let totalMinutes = 0;
    let completed = 0;

    snap.docs.forEach(d => {
        const data = d.data();
        const progress = data.progress || 0;
        const duration = data.duration || 0;

        totalMinutes += (duration * progress) / 100;
        if (progress >= 90) completed++;
    });

    return {
        totalWatchTimeHours: Math.round(totalMinutes / 60),
        completedTitles: completed
    };
}

// ─────────────────────────────────────────────
// MY LIST SYSTEM
// ─────────────────────────────────────────────
export async function toggleMyList(contentId, uid) {
    if (!uid) throw new Error('Must be signed in to modify your list');

    const listId = `${uid}_${contentId}`;
    const ref = doc(db, 'myList', listId);
    const snap = await getDoc(ref);

    if (snap.exists()) {
        await deleteDoc(ref);
        return false; // removed
    } else {
        await setDoc(ref, {
            userId: uid,
            contentId,
            addedAt: serverTimestamp(),
        });
        return true; // added
    }
}

export async function checkInMyList(contentId, uid) {
    if (!uid) return false;
    const ref = doc(db, 'myList', `${uid}_${contentId}`);
    const snap = await getDoc(ref);
    return snap.exists();
}

// Fetch joined list (Likes or My List)
export async function fetchUserContentList(uid, collectionName) {
    if (!uid) return [];
    const q = query(
        collection(db, collectionName),
        where('userId', '==', uid),
        orderBy(collectionName === 'likes' ? 'createdAt' : 'addedAt', 'desc')
    );
    const snap = await getDocs(q);

    const list = [];
    for (const d of snap.docs) {
        const data = d.data();
        try {
            const contentData = await fetchDetails(data.contentId);
            if (contentData) {
                list.push({
                    id: contentData.id, // Ensure we use TMDB id as the primary id
                    ...contentData // Spread the full TMDB metadata so ContentCard can read it
                });
            }
        } catch (error) {
            console.error("Failed to fetch TMDB details for list item", error);
        }
    }
    return list;
}

