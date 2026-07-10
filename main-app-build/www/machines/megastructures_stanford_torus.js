import { steel, titanium, glass, blueAccent, darkSteel } from '../utils/materials.js';

export function createStanfordTorus(THREE) {
    const group = new THREE.Group();
    group.name = "TorusStation";

    // Main Ring
    const ringGeo = new THREE.TorusGeometry(100, 15, 32, 64);
    const ring = new THREE.Mesh(ringGeo, titanium);
    group.add(ring);

    // Glass domes/windows on the ring
    const windowGeo = new THREE.TorusGeometry(101, 5, 16, 64);
    const windows = new THREE.Mesh(windowGeo, glass);
    windows.rotation.x = Math.PI / 2;
    group.add(windows);

    // Central Hub
    const hubGeo = new THREE.CylinderGeometry(20, 20, 40, 32);
    const hub = new THREE.Mesh(hubGeo, steel);
    hub.rotation.x = Math.PI / 2;
    group.add(hub);

    // Solar mirror / shield
    const shieldGeo = new THREE.SphereGeometry(30, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const shield = new THREE.Mesh(shieldGeo, blueAccent);
    shield.position.z = 20;
    group.add(shield);

    // Spokes
    const spokeCount = 6;
    for(let i=0; i<spokeCount; i++) {
        const angle = (i / spokeCount) * Math.PI * 2;
        const spokeGeo = new THREE.CylinderGeometry(3, 3, 100, 16);
        const spoke = new THREE.Mesh(spokeGeo, darkSteel);
        
        spoke.position.x = Math.cos(angle) * 50;
        spoke.position.y = Math.sin(angle) * 50;
        spoke.rotation.z = angle + Math.PI / 2;
        
        group.add(spoke);
    }

    // Animation (rotation for artificial gravity)
    const times = [0, 5, 10, 15, 20];
    const values = [];
    const axis = new THREE.Vector3(0, 0, 1).normalize();
    for(let i=0; i<=4; i++) {
        const angle = (i/4) * Math.PI * 2;
        const q = new THREE.Quaternion().setFromAxisAngle(axis, angle);
        values.push(q.x, q.y, q.z, q.w);
    }
    const track = new THREE.QuaternionKeyframeTrack('TorusStation.quaternion', times, values);
    const clip = new THREE.AnimationClip('TorusRotation', 20, [track]);

    return { group, animationClips: [clip] };
}
