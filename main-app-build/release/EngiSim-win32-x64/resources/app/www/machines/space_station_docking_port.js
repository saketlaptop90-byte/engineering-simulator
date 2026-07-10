import { aluminum, titanium, glass, gold } from '../utils/materials.js';

export function createDockingPortAdapter(THREE) {
    const group = new THREE.Group();
    group.name = 'DockingPortAdapter';

    // Main tunnel adapter
    const tunnelGeo = new THREE.CylinderGeometry(1.2, 1.5, 3, 16);
    const tunnel = new THREE.Mesh(tunnelGeo, aluminum);
    tunnel.rotation.x = Math.PI / 2;
    group.add(tunnel);

    // Forward adapter ring
    const ringGeo = new THREE.TorusGeometry(1.2, 0.15, 16, 32);
    const ring = new THREE.Mesh(ringGeo, titanium);
    ring.position.z = 1.5;
    group.add(ring);

    // Guide petals (animated for soft docking)
    const petals = new THREE.Group();
    for (let i = 0; i < 3; i++) {
        const petalGeo = new THREE.BoxGeometry(0.4, 1.0, 0.05);
        const petal = new THREE.Mesh(petalGeo, titanium);
        
        const angle = (i * Math.PI * 2) / 3;
        petal.position.set(Math.cos(angle) * 1.2, Math.sin(angle) * 1.2, 1.6);
        petal.lookAt(0, 0, 1.6);
        petal.name = `petal_${i}`;
        petals.add(petal);
    }
    group.add(petals);

    // Animation: Docking guide petals extending and retracting
    const tracks = [];
    for (let i = 0; i < 3; i++) {
        const initialPos = petals.children[i].position;
        const angle = (i * Math.PI * 2) / 3;
        const extendedPos = new THREE.Vector3(
            Math.cos(angle) * 1.5,
            Math.sin(angle) * 1.5,
            1.8
        );

        const times = [0, 2, 4];
        const values = [
            initialPos.x, initialPos.y, initialPos.z,
            extendedPos.x, extendedPos.y, extendedPos.z,
            initialPos.x, initialPos.y, initialPos.z
        ];
        tracks.push(new THREE.VectorKeyframeTrack(`petal_${i}.position`, times, values));
    }
    const clip = new THREE.AnimationClip('DockingSequence', 4, tracks);

    return { group, animationClips: [clip] };
}
