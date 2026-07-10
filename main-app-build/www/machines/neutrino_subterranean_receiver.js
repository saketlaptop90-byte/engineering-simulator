import { materials } from '../utils/materials.js';

export function createSubterraneanReceiver(THREE) {
    const group = new THREE.Group();
    group.name = 'SubterraneanReceiver';
    const animationClips = [];

    // Rock cavern
    const cavernGeo = new THREE.SphereGeometry(6, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const cavernMat = materials?.rock || new THREE.MeshStandardMaterial({ color: 0x332222, roughness: 0.9, side: THREE.BackSide });
    const cavern = new THREE.Mesh(cavernGeo, cavernMat);
    group.add(cavern);

    // Spherical Detector Tank
    const tankGeo = new THREE.SphereGeometry(4, 32, 32);
    const tankMat = materials?.glass || new THREE.MeshPhysicalMaterial({ transmission: 0.8, transparent: true, opacity: 0.4, color: 0x112244, roughness: 0.1 });
    const tank = new THREE.Mesh(tankGeo, tankMat);
    group.add(tank);

    // PMT array group
    const pmtGroup = new THREE.Group();
    pmtGroup.name = 'PMTArray';
    tank.add(pmtGroup);

    // Light ring for Cherenkov event animation
    const ringGeo = new THREE.TorusGeometry(3.9, 0.05, 8, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.name = 'DetectionRing';
    group.add(ring);

    // Animation: Expanding Cherenkov ring
    const ringScaleTrack = new THREE.VectorKeyframeTrack(
        `DetectionRing.scale`,
        [0, 1, 2],
        [0.1, 0.1, 0.1, 1, 1, 1, 1.2, 1.2, 1.2]
    );
    const ringOpacityTrack = new THREE.NumberKeyframeTrack(
        `DetectionRing.material.opacity`,
        [0, 0.2, 1, 2],
        [0, 1, 0.5, 0]
    );
    
    // Rotate tank slowly
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI * 2);
    
    const tankRotTrack = new THREE.QuaternionKeyframeTrack(
        `PMTArray.quaternion`,
        [0, 5, 10],
        [q1.x, q1.y, q1.z, q1.w, q2.x, q2.y, q2.z, q2.w, q3.x, q3.y, q3.z, q3.w]
    );

    const eventClip = new THREE.AnimationClip('EventDetection', 2, [ringScaleTrack, ringOpacityTrack]);
    const idleClip = new THREE.AnimationClip('TankIdle', 10, [tankRotTrack]);
    
    animationClips.push(eventClip, idleClip);

    return { group, animationClips };
}
