import { blackPlastic, aluminum, gold, blueAccent } from '../utils/materials.js';

export function createPCIeSlot(THREE) {
    const group = new THREE.Group();
    group.name = 'PCIeSlot';

    const slotGeom = new THREE.BoxGeometry(14, 1.5, 1.5);
    const slot = new THREE.Mesh(slotGeom, blackPlastic);
    slot.position.set(0, 0.75, 0);
    group.add(slot);

    const shieldGeom = new THREE.BoxGeometry(14.2, 1.4, 1.7);
    const shield = new THREE.Mesh(shieldGeom, aluminum);
    shield.position.set(0, 0.7, 0);
    group.add(shield);
    
    const clipGroup = new THREE.Group();
    clipGroup.name = "RetentionClip";
    clipGroup.position.set(7.5, 0.75, 0);
    const clipGeom = new THREE.BoxGeometry(1.5, 1.2, 1.5);
    const clipMesh = new THREE.Mesh(clipGeom, blueAccent);
    clipMesh.position.set(0.75, 0, 0);
    clipGroup.add(clipMesh);
    group.add(clipGroup);

    const cardGroup = new THREE.Group();
    cardGroup.name = "GhostCard";
    const cardGeom = new THREE.BoxGeometry(13, 8, 0.8);
    const cardMat = new THREE.MeshStandardMaterial({ color: 0x4488cc, transparent: true, opacity: 0.3 });
    const card = new THREE.Mesh(cardGeom, cardMat);
    card.position.set(0, 4, 0);
    cardGroup.add(card);
    group.add(cardGroup);

    const pinGeom = new THREE.BoxGeometry(0.05, 1.6, 1.6);
    for(let i=0; i<82; i++) {
        const pin = new THREE.Mesh(pinGeom, gold);
        pin.position.set(-6.5 + i*0.15, 0.8, 0);
        group.add(pin);
    }

    const times = [0, 1, 1.5, 3];
    const cardPos = [
        0, 10, 0,
        0, 3, 0,
        0, 0, 0,
        0, 0, 0
    ];
    const cardTrack = new THREE.VectorKeyframeTrack("GhostCard.position", times, cardPos);

    const qOpen = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), -Math.PI/4);
    const qClosed = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0);
    const clipTimes = [0, 1, 1.4, 1.5, 3];
    const clipValues = [
        qOpen.x, qOpen.y, qOpen.z, qOpen.w,
        qOpen.x, qOpen.y, qOpen.z, qOpen.w,
        qOpen.x, qOpen.y, qOpen.z, qOpen.w,
        qClosed.x, qClosed.y, qClosed.z, qClosed.w,
        qClosed.x, qClosed.y, qClosed.z, qClosed.w
    ];
    const clipTrack = new THREE.QuaternionKeyframeTrack("RetentionClip.quaternion", clipTimes, clipValues);

    const animClip = new THREE.AnimationClip("InsertCard", 3, [cardTrack, clipTrack]);

    return { group, animationClips: [animClip] };
}
