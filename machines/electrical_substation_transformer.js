import * as materials from '../utils/materials.js';

export function createSubstationTransformer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Fallback materials if not provided
    const steelMaterial = materials.steel || new THREE.MeshStandardMaterial({ color: 0x778899, metalness: 0.8, roughness: 0.2 });
    const copperMaterial = materials.copper || new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.7, roughness: 0.3 });
    const ceramicMaterial = materials.ceramic || new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.1, roughness: 0.8 });

    // Main tank
    const tankGeo = new THREE.BoxGeometry(4, 5, 3);
    const tank = new THREE.Mesh(tankGeo, steelMaterial);
    tank.position.y = 2.5;
    group.add(tank);

    // Cooling fins (radiators)
    const finGeo = new THREE.BoxGeometry(0.1, 4, 1);
    for (let i = 0; i < 5; i++) {
        const finLeft = new THREE.Mesh(finGeo, steelMaterial);
        finLeft.position.set(-2.2, 2.5, -1 + i * 0.5);
        group.add(finLeft);

        const finRight = new THREE.Mesh(finGeo, steelMaterial);
        finRight.position.set(2.2, 2.5, -1 + i * 0.5);
        group.add(finRight);
    }

    // Bushings (insulators)
    const bushingGeo = new THREE.CylinderGeometry(0.2, 0.4, 2, 16);
    for (let i = -1; i <= 1; i++) {
        const bushing = new THREE.Mesh(bushingGeo, ceramicMaterial);
        bushing.position.set(i * 1.2, 6, 0);
        
        // Add copper tips
        const tipGeo = new THREE.SphereGeometry(0.25, 16, 16);
        const tip = new THREE.Mesh(tipGeo, copperMaterial);
        tip.position.y = 1;
        bushing.add(tip);
        
        bushing.name = 'bushing_' + i;
        group.add(bushing);
    }

    // Create a hum/vibration animation
    const tankScaleTrack = new THREE.VectorKeyframeTrack(
        tank.uuid + '.scale',
        [0, 0.05, 0.1],
        [1, 1, 1, 1.01, 1.01, 1.01, 1, 1, 1]
    );

    const clip = new THREE.AnimationClip('TransformerHum', 0.1, [tankScaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
