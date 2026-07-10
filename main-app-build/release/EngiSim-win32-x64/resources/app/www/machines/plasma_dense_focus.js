import { materials } from '../utils/materials.js';

export function createDensePlasmaFocus(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const anodeMat = materials?.copper || new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.8, roughness: 0.2 });
    const cathodeMat = materials?.metal || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.3 });
    const plasmaMat = materials?.plasma_hot || new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });

    // Inner Anode
    const anodeGeo = new THREE.CylinderGeometry(0.5, 0.5, 6, 32);
    const anode = new THREE.Mesh(anodeGeo, anodeMat);
    anode.position.y = 3;
    group.add(anode);

    // Outer Cathode (array of rods)
    const cathodeGroup = new THREE.Group();
    const rodGeo = new THREE.CylinderGeometry(0.1, 0.1, 6, 8);
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const rod = new THREE.Mesh(rodGeo, cathodeMat);
        rod.position.set(Math.cos(angle) * 2, 3, Math.sin(angle) * 2);
        cathodeGroup.add(rod);
    }
    group.add(cathodeGroup);

    // Plasma Pinch
    const pinchGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const pinch = new THREE.Mesh(pinchGeo, plasmaMat);
    pinch.position.y = 6.5;
    pinch.name = "plasmaPinch";
    group.add(pinch);

    // Plasma Sheath
    const sheathGeo = new THREE.CylinderGeometry(2, 0.5, 6, 32, 1, true);
    const sheath = new THREE.Mesh(sheathGeo, new THREE.MeshBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
    sheath.position.y = 3;
    sheath.name = "plasmaSheath";
    group.add(sheath);

    // Animations
    const focusClip = new THREE.AnimationClip('PinchCycle', 1, [
        new THREE.VectorKeyframeTrack('plasmaSheath.scale', [0, 0.8, 1], [1, 1, 1,  0.2, 1, 0.2,  1, 1, 1]),
        new THREE.VectorKeyframeTrack('plasmaPinch.scale', [0, 0.8, 0.9, 1], [0.1, 0.1, 0.1,  0.1, 0.1, 0.1,  3, 3, 3,  0.1, 0.1, 0.1])
    ]);
    animationClips.push(focusClip);

    return { group, animationClips };
}
