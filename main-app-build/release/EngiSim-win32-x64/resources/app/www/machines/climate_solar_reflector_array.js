import { aluminum, titanium, glass } from '../utils/materials.js';

export function createSolarReflectorArray(THREE) {
    const group = new THREE.Group();
    group.name = 'SolarReflectorArray';

    // Central Hub
    const hubGeo = new THREE.CylinderGeometry(2, 2, 1, 32);
    const hub = new THREE.Mesh(hubGeo, titanium);
    group.add(hub);

    // Mirrors folding/unfolding
    const mirrors = new THREE.Group();
    mirrors.name = 'MirrorsGroup';
    group.add(mirrors);

    const numMirrors = 6;
    const tracks = [];

    for(let i=0; i<numMirrors; i++) {
        const pivot = new THREE.Group();
        pivot.rotation.y = (Math.PI * 2 / numMirrors) * i;
        
        const mirrorPivot = new THREE.Group();
        mirrorPivot.name = `MirrorPivot_${i}`;
        mirrorPivot.position.z = 2; // offset from hub
        
        const mirrorGeo = new THREE.PlaneGeometry(3, 6);
        const mirror = new THREE.Mesh(mirrorGeo, glass);
        mirror.rotation.x = -Math.PI / 2;
        mirror.position.z = 3;
        
        mirrorPivot.add(mirror);
        pivot.add(mirrorPivot);
        mirrors.add(pivot);

        // Animation: Unfold from folded state
        const qFolded = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
        const qUnfolded = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
        
        const track = new THREE.QuaternionKeyframeTrack(`MirrorPivot_${i}.quaternion`, [0, 5, 10], [
            qFolded.x, qFolded.y, qFolded.z, qFolded.w,
            qUnfolded.x, qUnfolded.y, qUnfolded.z, qUnfolded.w,
            qFolded.x, qFolded.y, qFolded.z, qFolded.w
        ]);
        tracks.push(track);
    }
    
    // Rotate entire array
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);
    
    const arrayTrack = new THREE.QuaternionKeyframeTrack('MirrorsGroup.quaternion', [0, 5, 10], [
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w
    ]);
    tracks.push(arrayTrack);

    const clip = new THREE.AnimationClip('DeployAndRotate', 10, tracks);

    return { group, animationClips: [clip] };
}
