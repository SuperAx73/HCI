import { db } from '../config/firebase';

const collection = () => db.collection('counters');

/** Atomically returns the next value for a named sequence, starting at 1001. */
export async function nextSequence(name: string): Promise<number> {
  const ref = collection().doc(name);
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const current = snap.exists ? (snap.data()!.value as number) : 1000;
    const next = current + 1;
    tx.set(ref, { value: next }, { merge: true });
    return next;
  });
}
