import { aluminum, copper, darkSteel } from '../utils/materials.js';

export function createQuantumRandomNumberGenerator(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base Chassis
    const chassisGeo = new THREE.BoxGeometry(3, 0.5, 3);
    const chassis = new THREE.Mesh(chassisGeo, darkSteel);
    group.add(chassis);

    // Central Beam Splitter
    const splitterGeo = new THREE.BoxGeometry(0.8, 0.8, 0.1);
    const splitterMat = new THREE.MeshPhysicalMaterial({ 
        transmission: 0.8, 
        opacity: 1, 
        color: 0xaaaaaa, 
        roughness: 0, 
        ior: 1.5 
    });
    const splitter = new THREE.Mesh(splitterGeo, splitterMat);
    splitter.position.set(0, 1, 0);
    splitter.rotation.y = Math.PI / 4;
    group.add(splitter);

    // Photonic Detectors
    const detGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 32);
    
    const det1 = new THREE.Mesh(detGeo, copper);
    det1.position.set(1.2, 1, 0);
    det1.rotation.z = Math.PI / 2;
    group.add(det1);

    const det2 = new THREE.Mesh(detGeo, aluminum);
    det2.position.set(0, 1, -1.2);
    det2.rotation.x = Math.PI / 2;
    group.add(det2);

    // Photon Source Injector
    const sourceGeo = new THREE.BoxGeometry(0.5, 0.5, 1);
    const source = new THREE.Mesh(sourceGeo, darkSteel);
    source.position.set(0, 1, 1.2);
    group.add(source);

    // Superposition Photon
    const photonGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const photonMat = new THREE.MeshStandardMaterial({ 
        color: 0x00ffcc, 
        emissive: 0x00ffcc, 
        emissiveIntensity: 3 
    });
    const photon = new THREE.Mesh(photonGeo, photonMat);
    photon.position.set(0, 1, 1.0);
    photon.name = "qrngPhoton";
    group.add(photon);

    // Animation: Photon travels from source -> splitter -> random detector
    const pTrack = new THREE.VectorKeyframeTrack(
        'qrngPhoton.position',
        [0, 0.5, 1.0, 1.5, 2.0],
        [
            0, 1, 1.0,      // Source
            0, 1, 0,        // Hits Splitter
            1.0, 1, 0,      // Collapses to Detector 1
            0, 1, 1.0,      // Resets at Source
            0, 1, -1.0      // Collapses to Detector 2
        ]
    );
    
    // Scale track to make the photon disappear inside the detectors and reset
    const scaleTrack = new THREE.VectorKeyframeTrack(
        'qrngPhoton.scale',
        [0, 0.45, 0.5, 0.95, 1.0, 1.45, 1.5, 1.95, 2.0],
        [
            1, 1, 1,
            1, 1, 1,
            0, 0, 0,
            0, 0, 0,
            1, 1, 1,
            1, 1, 1,
            0, 0, 0,
            0, 0, 0,
            1, 1, 1
        ]
    );

    const clip = new THREE.AnimationClip('QRNG_Generation', 2, [pTrack, scaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
