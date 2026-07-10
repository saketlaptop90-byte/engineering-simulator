import { materials } from '../utils/materials.js';

export function createWireDrawingMachine(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const frameMat = materials.frame || new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.5, roughness: 0.6 });
    const dieMat = materials.die || new THREE.MeshStandardMaterial({ color: 0xdddd00, metalness: 0.9, roughness: 0.1 });
    const wireMat = materials.copper || new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.8, roughness: 0.3 });

    const baseGeo = new THREE.BoxGeometry(6, 0.5, 2);
    const base = new THREE.Mesh(baseGeo, frameMat);
    base.position.y = -1;
    group.add(base);

    // Dies
    const dieGeo = new THREE.BoxGeometry(0.5, 1, 1);
    for(let i=0; i<3; i++) {
        const die = new THREE.Mesh(dieGeo, dieMat);
        die.position.set(-2 + i*2, 0, 0);
        group.add(die);
    }

    // Wire segments
    const wireSegments = [];
    const radii = [0.15, 0.1, 0.06, 0.03]; // progressively thinner
    for(let i=0; i<4; i++) {
        const wireGeo = new THREE.CylinderGeometry(radii[i], radii[i], 2, 16);
        const wire = new THREE.Mesh(wireGeo, wireMat);
        wire.rotation.z = Math.PI / 2;
        wire.position.set(-3 + i*2, 0, 0);
        group.add(wire);
        wireSegments.push(wire);
    }

    // Capstans (pulling wheels)
    const capstanGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32);
    const capstans = [];
    for(let i=0; i<3; i++) {
        const capstan = new THREE.Mesh(capstanGeo, frameMat);
        capstan.rotation.x = Math.PI / 2;
        capstan.position.set(-1 + i*2, -0.4, 0);
        group.add(capstan);
        capstans.push(capstan);
    }

    // Animation: Capstans rotating
    const tracks = [];
    capstans.forEach((capstan, index) => {
        const qStart = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI/2, 0, 0));
        const qHalf = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI/2, Math.PI, 0));
        const qEnd = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI/2, Math.PI * 2, 0));
        
        const timesQ = [0, 0.5, 1];
        const valuesQ = [
            qStart.x, qStart.y, qStart.z, qStart.w,
            qHalf.x, qHalf.y, qHalf.z, qHalf.w,
            qEnd.x, qEnd.y, qEnd.z, qEnd.w
        ];

        const kf = new THREE.QuaternionKeyframeTrack(capstan.uuid + '.quaternion', timesQ, valuesQ);
        tracks.push(kf);
    });

    const clip = new THREE.AnimationClip('DrawWire', 1, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
