import { aluminum, titanium, glass, gold } from '../utils/materials.js';

export function createCentrifugeHabitat(THREE) {
    const group = new THREE.Group();
    group.name = 'CentrifugeHabitat';

    // Central hub
    const hubGeo = new THREE.CylinderGeometry(1.5, 1.5, 6, 16);
    const hub = new THREE.Mesh(hubGeo, titanium);
    group.add(hub);

    // Rotating habitat ring
    const ringGroup = new THREE.Group();
    ringGroup.name = 'RotatingRing';
    
    // The torus representing the living quarters
    const ringGeo = new THREE.TorusGeometry(8, 2, 32, 64);
    const ring = new THREE.Mesh(ringGeo, aluminum);
    ring.rotation.x = Math.PI / 2;
    ringGroup.add(ring);

    // Spokes connecting the central hub to the outer ring
    for (let i = 0; i < 4; i++) {
        const spokeGeo = new THREE.CylinderGeometry(0.5, 0.5, 7, 8);
        const spoke = new THREE.Mesh(spokeGeo, aluminum);
        
        // Orient and position spokes radially
        spoke.rotation.z = Math.PI / 2;
        spoke.rotation.y = (i * Math.PI) / 2;
        spoke.position.x = Math.cos((i * Math.PI) / 2) * 4;
        spoke.position.z = Math.sin((i * Math.PI) / 2) * 4;
        
        ringGroup.add(spoke);
    }

    group.add(ringGroup);

    // Animation: Centrifuge rotating continuously for artificial gravity
    const times = [0, 5, 10];
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);
    
    const quatValues = [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ];

    const track = new THREE.QuaternionKeyframeTrack('RotatingRing.quaternion', times, quatValues);
    const clip = new THREE.AnimationClip('ArtificialGravitySpin', 10, [track]);

    return { group, animationClips: [clip] };
}
