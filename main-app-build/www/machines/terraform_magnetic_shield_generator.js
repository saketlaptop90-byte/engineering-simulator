import { materials } from '../utils/materials.js';

export function createMagneticShieldGenerator(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base structure
    const baseGeo = new THREE.OctahedronGeometry(20, 1);
    const base = new THREE.Mesh(baseGeo, materials.metallicDark || new THREE.MeshStandardMaterial({color: 0x222222}));
    group.add(base);

    // Emitting Rings
    const ringGeo = new THREE.TorusGeometry(30, 2, 16, 100);
    const ringMat = materials.energy || new THREE.MeshBasicMaterial({color: 0x0055ff, transparent: true, opacity: 0.8});
    
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 2;
    ring1.name = 'ring1';
    group.add(ring1);
    
    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.y = Math.PI / 2;
    ring2.name = 'ring2';
    group.add(ring2);

    // Magnetic Shield bubble
    const shieldGeo = new THREE.SphereGeometry(50, 32, 32);
    const shieldMat = new THREE.MeshBasicMaterial({color: 0x00aaff, transparent: true, opacity: 0.2, wireframe: true});
    const shield = new THREE.Mesh(shieldGeo, shieldMat);
    shield.name = 'shield';
    group.add(shield);

    // Animation tracks
    const times = [0, 2];
    const qStart1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI/2, 0, 0));
    const qEnd1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI/2, 0, Math.PI*2));
    
    const qStart2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI/2, 0));
    const qEnd2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI*2, Math.PI/2, 0));
    
    const track1 = new THREE.QuaternionKeyframeTrack(`ring1.quaternion`, times, [
        qStart1.x, qStart1.y, qStart1.z, qStart1.w,
        qEnd1.x, qEnd1.y, qEnd1.z, qEnd1.w
    ]);
    const track2 = new THREE.QuaternionKeyframeTrack(`ring2.quaternion`, times, [
        qStart2.x, qStart2.y, qStart2.z, qStart2.w,
        qEnd2.x, qEnd2.y, qEnd2.z, qEnd2.w
    ]);

    // Shield pulsing scale
    const scaleTrack = new THREE.VectorKeyframeTrack(`shield.scale`, [0, 1, 2], [
        1, 1, 1,
        1.1, 1.1, 1.1,
        1, 1, 1
    ]);

    const activeClip = new THREE.AnimationClip('ShieldActive', 2, [track1, track2, scaleTrack]);
    animationClips.push(activeClip);

    return { group, animationClips };
}
