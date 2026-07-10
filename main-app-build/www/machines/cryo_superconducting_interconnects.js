import { superconductorMaterial, copperMaterial, glassMaterial } from '../utils/materials.js';

export function createSuperconductingInterconnects(THREE) {
    const group = new THREE.Group();
    group.name = "SuperconductingInterconnects";
    const animationClips = [];

    // Shielding tube
    const tubeGeo = new THREE.CylinderGeometry(1, 1, 10, 32);
    const tubeMat = new THREE.MeshPhysicalMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.3, roughness: 0.1, transmission: 0.9 });
    const tube = new THREE.Mesh(tubeGeo, glassMaterial || tubeMat);
    tube.rotation.z = Math.PI / 2;
    group.add(tube);

    // Niobium/Titanium Wires
    const wireCount = 7;
    const wiresGroup = new THREE.Group();
    wiresGroup.name = "Wires";
    for(let i=0; i<wireCount; i++) {
        const angle = (i / wireCount) * Math.PI * 2;
        const wireGeo = new THREE.CylinderGeometry(0.05, 0.05, 10, 8);
        const wireMat = new THREE.MeshStandardMaterial({ color: 0x88aaff, emissive: 0x002288 });
        const wire = new THREE.Mesh(wireGeo, superconductorMaterial || wireMat);
        wire.position.set(0, Math.cos(angle) * 0.5, Math.sin(angle) * 0.5);
        wire.rotation.z = Math.PI / 2;
        wire.name = `wire_${i}`;
        wiresGroup.add(wire);
    }
    group.add(wiresGroup);

    // Animation: Data transfer pulses (emissive intensity or scale)
    const times = [0, 1, 2];
    const tracks = [];
    for(let i=0; i<wireCount; i++) {
        const delay = i * 0.2;
        const colorTrack = new THREE.ColorKeyframeTrack(
            `wire_${i}.material.emissive`,
            [0, delay % 2, (delay + 1) % 2, 2],
            [0,0,0, 0,0.5,1, 0,0,0, 0,0,0]
        );
        tracks.push(colorTrack);
    }
    const clip = new THREE.AnimationClip('DataFlow', 2, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
