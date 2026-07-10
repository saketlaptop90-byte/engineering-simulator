import { materials } from '../utils/materials.js';

export function createSwingBridge(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Central Pivot Pillar
    const pivotGeom = new THREE.CylinderGeometry(8, 10, 20, 32);
    const pivotPillar = new THREE.Mesh(pivotGeom, materials.concrete);
    pivotPillar.position.y = 10;
    group.add(pivotPillar);

    // Rotating Deck
    const deckGroup = new THREE.Group();
    deckGroup.position.y = 21;
    deckGroup.name = 'SwingDeck';

    const deckGeom = new THREE.BoxGeometry(60, 2, 12);
    const deckMesh = new THREE.Mesh(deckGeom, materials.darkSteel);
    deckGroup.add(deckMesh);

    // Top truss/support structure
    const supportGeom = new THREE.BoxGeometry(40, 10, 2);
    const supportMesh = new THREE.Mesh(supportGeom, materials.darkSteel);
    supportMesh.position.y = 6;
    deckGroup.add(supportMesh);

    group.add(deckGroup);

    // Animation: Swinging the bridge 90 degrees
    const rotationKF = new THREE.QuaternionKeyframeTrack(
        'SwingDeck.quaternion',
        [0, 5, 10],
        [
            ...new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0).toArray(),
            ...new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2).toArray(),
            ...new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0).toArray()
        ]
    );
    const swingClip = new THREE.AnimationClip('SwingBridge', 10, [rotationKF]);
    animationClips.push(swingClip);

    return { group, animationClips };
}
