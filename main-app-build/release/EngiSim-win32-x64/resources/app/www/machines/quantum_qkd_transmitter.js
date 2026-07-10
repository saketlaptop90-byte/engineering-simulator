import { aluminum, copper, darkSteel } from '../utils/materials.js';

export function createQKDTransmitter(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base Chassis
    const baseGeo = new THREE.BoxGeometry(4, 0.5, 3);
    const base = new THREE.Mesh(baseGeo, darkSteel);
    group.add(base);

    // Cooling Fins
    for(let i = -1.5; i <= 1.5; i += 0.5) {
        const finGeo = new THREE.BoxGeometry(0.1, 0.8, 2.8);
        const fin = new THREE.Mesh(finGeo, aluminum);
        fin.position.set(i, 0.65, 0);
        group.add(fin);
    }

    // Laser Core
    const coreGeo = new THREE.CylinderGeometry(0.5, 0.5, 2.5, 32);
    const core = new THREE.Mesh(coreGeo, copper);
    core.position.set(0, 1.5, 0);
    core.rotation.z = Math.PI / 2;
    group.add(core);

    // Emitter Lens System
    const lensGeo = new THREE.CylinderGeometry(0.4, 0.6, 0.5, 32);
    const lensMat = new THREE.MeshPhysicalMaterial({
        transmission: 0.9, 
        opacity: 1, 
        metalness: 0, 
        roughness: 0.1, 
        ior: 1.5, 
        color: 0x88ccff 
    });
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.position.set(1.5, 1.5, 0);
    lens.rotation.z = Math.PI / 2;
    group.add(lens);

    // Photon Emitter (Inside Lens)
    const emitterGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const emitterMat = new THREE.MeshStandardMaterial({ 
        color: 0x00ffff, 
        emissive: 0x00ffff, 
        emissiveIntensity: 5 
    });
    const emitter = new THREE.Mesh(emitterGeo, emitterMat);
    emitter.position.set(1.5, 1.5, 0);
    emitter.name = "qkdEmitter";
    group.add(emitter);

    // Animation: Pulsing emitter scale simulating quantum state transmission
    const scaleTrack = new THREE.VectorKeyframeTrack(
        'qkdEmitter.scale',
        [0, 0.5, 1],
        [1, 1, 1, 1.8, 1.8, 1.8, 1, 1, 1]
    );
    const clip = new THREE.AnimationClip('QKD_Pulse', 1, [scaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
