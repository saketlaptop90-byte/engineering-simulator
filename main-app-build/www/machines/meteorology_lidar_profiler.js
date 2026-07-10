import { materials } from '../utils/materials.js';

export function createLidarProfiler(THREE) {
    const group = new THREE.Group();

    // Base container
    const baseGeo = new THREE.BoxGeometry(4, 2, 4);
    const base = new THREE.Mesh(baseGeo, materials.metallic);
    base.position.y = 1;
    group.add(base);

    // Scanner mount
    const mountGeo = new THREE.CylinderGeometry(1.5, 1.5, 1, 16);
    const mount = new THREE.Mesh(mountGeo, materials.metallic);
    mount.position.y = 2.5;
    group.add(mount);

    // Rotating scanner head
    const scannerHead = new THREE.Group();
    scannerHead.position.y = 3;
    group.add(scannerHead);

    const headGeo = new THREE.SphereGeometry(1.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const headMat = materials.accent || new THREE.MeshStandardMaterial({ color: 0x222222 });
    const head = new THREE.Mesh(headGeo, headMat);
    scannerHead.add(head);

    // Lidar Laser Beam (Conical)
    const beamGeo = new THREE.CylinderGeometry(0.05, 1.5, 20, 32);
    beamGeo.translate(0, 10, 0); // Translate so bottom is at 0
    const beamMat = new THREE.MeshBasicMaterial({ 
        color: 0x00ff88, 
        transparent: true, 
        opacity: 0.4, 
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    // Tilt the beam for conical scan
    beam.rotation.z = Math.PI / 6;
    scannerHead.add(beam);

    // Animations
    const animationClips = [];

    // Continuous 360 degree rotation for conical scan
    const rotTrack = new THREE.NumberKeyframeTrack(
        `${scannerHead.uuid}.rotation[y]`,
        [0, 1.5, 3],
        [0, Math.PI, Math.PI * 2]
    );

    // Vary the beam cone angle slightly
    const tiltTrack = new THREE.NumberKeyframeTrack(
        `${beam.uuid}.rotation[z]`,
        [0, 1.5, 3],
        [Math.PI/6, Math.PI/4, Math.PI/6]
    );

    const clip = new THREE.AnimationClip('LidarScan', 3, [rotTrack, tiltTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
