// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const serviceAccount = require('./serviceAccountKey.json'); // download from Firebase console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Helper: create token if not exists
async function ensureToken(uid) {
  const userRef = db.collection('users').doc(uid);
  const snap = await userRef.get();
  if (!snap.exists) return null;
  const data = snap.data();
  if (data.token) return data.token;
  const token = uuidv4();
  await userRef.update({ token, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
  return token;
}

/**
 * POST /bulk/users
 * Body: [{ uid, name, username, email, interests: [...], photoURL? }, ...]
 * This will create or update users in Firestore. Returns summary.
 */
app.post('/bulk/users', async (req, res) => {
  try {
    const list = req.body;
    if (!Array.isArray(list)) return res.status(400).json({ error: 'Expected array' });

    const batch = db.batch();
    let count = 0;
    for (const u of list) {
      const uid = u.uid || `seed-${u.username || Date.now()}-${Math.random().toString(36).slice(2,8)}`;
      const ref = db.collection('users').doc(uid);
      const doc = {
        uid,
        name: u.name || '',
        username: u.username || '',
        email: u.email || '',
        photoURL: u.photoURL || '',
        interests: u.interests || [],
        subscribers: u.subscribers || [],
        subscribedTo: u.subscribedTo || [],
        networkMode: u.networkMode || false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        token: u.token || undefined
      };
      // don't set undefined token to avoid overwriting existing token
      if (!doc.token) delete doc.token;
      batch.set(ref, doc, { merge: true });
      count++;
      // Firestore batch limit 500: commit in chunks
      if (count % 400 === 0) {
        await batch.commit();
      }
    }
    await batch.commit();
    res.json({ success: true, processed: list.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /users
 * Create single user (used by signup flow if needed)
 */
app.post('/users', async (req, res) => {
  try {
    const { uid, name, username, email, interests = [], photoURL } = req.body;
    if (!uid) return res.status(400).json({ error: 'uid required' });
    const ref = db.collection('users').doc(uid);
    await ref.set({
      uid, name, username, email, photoURL: photoURL || '',
      interests, subscribers: [], subscribedTo: [], networkMode: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      token: uuidv4()
    }, { merge: true });
    res.json({ success: true, uid });
  } catch (err) { res.status(500).json({ error: err.message }) }
});

/**
 * POST /subscribe
 * Body: { fromUid, toUid }
 * fromUid subscribes to toUid (i.e. express interest / swipe right)
 */
app.post('/subscribe', async (req, res) => {
  try {
    const { fromUid, toUid } = req.body;
    if (!fromUid || !toUid) return res.status(400).json({ error: 'fromUid,toUid required' });

    const toRef = db.collection('users').doc(toUid);
    const fromRef = db.collection('users').doc(fromUid);

    await toRef.update({
      subscribers: admin.firestore.FieldValue.arrayUnion(fromUid),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    await fromRef.update({
      subscribedTo: admin.firestore.FieldValue.arrayUnion(toUid),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Check mutual
    const [toSnap, fromSnap] = await Promise.all([toRef.get(), fromRef.get()]);
    const toData = toSnap.data();
    const fromData = fromSnap.data();

    const mutual = (toData.subscribers || []).includes(fromUid) && (fromData.subscribers || []).includes(toUid);
    res.json({ success: true, mutual });
  } catch (err) { res.status(500).json({ error: err.message }) }
});

/**
 * POST /unsubscribe
 * Body: { fromUid, toUid }
 */
app.post('/unsubscribe', async (req, res) => {
  try {
    const { fromUid, toUid } = req.body;
    if (!fromUid || !toUid) return res.status(400).json({ error: 'fromUid,toUid required' });

    const toRef = db.collection('users').doc(toUid);
    const fromRef = db.collection('users').doc(fromUid);

    await toRef.update({
      subscribers: admin.firestore.FieldValue.arrayRemove(fromUid),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    await fromRef.update({
      subscribedTo: admin.firestore.FieldValue.arrayRemove(toUid),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }) }
});

/**
 * GET /users/:uid
 * Returns user public info (no token)
 */
app.get('/users/:uid', async (req, res) => {
  try {
    const uid = req.params.uid;
    const doc = await db.collection('users').doc(uid).get();
    if (!doc.exists) return res.status(404).json({ error: 'not found' });
    const d = doc.data();
    // hide token
    delete d.token;
    res.json({ user: d });
  } catch (err) { res.status(500).json({ error: err.message }) }
});

/**
 * GET /users/:uid/token?requester=REQUESTER_UID
 * Returns token only if mutual subscription exists or requester==owner
 */
app.get('/users/:uid/token', async (req, res) => {
  try {
    const uid = req.params.uid;
    const requester = req.query.requester;
    if (!requester) return res.status(400).json({ error: 'requester required' });

    const [ownerSnap, requesterSnap] = await Promise.all([
      db.collection('users').doc(uid).get(),
      db.collection('users').doc(requester).get()
    ]);
    if (!ownerSnap.exists) return res.status(404).json({ error: 'owner not found' });
    if (!requesterSnap.exists) return res.status(404).json({ error: 'requester not found' });

    const owner = ownerSnap.data();
    const requesterData = requesterSnap.data();

    // if same user, allow
    if (uid === requester) return res.json({ token: owner.token });

    const mutual = (owner.subscribers || []).includes(requester) && (requesterData.subscribers || []).includes(uid);
    if (mutual) {
      // ensure token exists
      const token = owner.token || await ensureToken(uid);
      return res.json({ token });
    } else {
      return res.status(403).json({ error: 'token hidden until mutual subscription' });
    }
  } catch (err) { res.status(500).json({ error: err.message }) }
});


/**
 * GET /matches/:uid
 * Returns ranked matches for the user based on simple interest overlap and networkMode.
 */
app.get('/matches/:uid', async (req, res) => {
  try {
    const uid = req.params.uid;
    const userSnap = await db.collection('users').doc(uid).get();
    if (!userSnap.exists) return res.status(404).json({ error: 'user not found' });
    const user = userSnap.data();
    const userInterests = user.interests || [];

    // naive: get all users (for 500 users this is OK). For larger size create indexes and queries.
    const snaps = await db.collection('users').get();
    const candidates = [];
    snaps.forEach(s => {
      const d = s.data();
      if (d.uid === uid) return;
      if (d.networkMode === false) return; // optional: only users active on network mode
      const common = (d.interests || []).filter(i => userInterests.includes(i));
      const score = common.length; // simple score
      candidates.push({ uid: d.uid, name: d.name, username: d.username, photoURL: d.photoURL, interests: d.interests || [], score });
    });

    candidates.sort((a,b) => b.score - a.score);
    res.json({ matches: candidates.slice(0, 100) });
  } catch (err) { res.status(500).json({ error: err.message }) }
});

/**
 * POST /groups
 * Body: { creatorUid, name, memberUids: [uid,...] }
 */
app.post('/groups', async (req, res) => {
  try {
    const { creatorUid, name, memberUids = [] } = req.body;
    if (!creatorUid || !name) return res.status(400).json({ error: 'creatorUid,name required' });
    const groupId = uuidv4();
    const members = memberUids.map(uid => ({ uid, status: 'invited' }));
    members.push({ uid: creatorUid, status: 'accepted' });

    await db.collection('groups').doc(groupId).set({
      id: groupId,
      name,
      creatorUid,
      members,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.json({ success: true, groupId });
  } catch (err) { res.status(500).json({ error: err.message }) }
});

/**
 * POST /groups/:groupId/accept
 * Body: { uid } // member accepts invite
 */
app.post('/groups/:groupId/accept', async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const { uid } = req.body;
    const ref = db.collection('groups').doc(groupId);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ error: 'group not found' });
    const group = snap.data();
    const members = group.members.map(m => m.uid === uid ? { uid, status: 'accepted' } : m);
    await ref.update({ members, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }) }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
