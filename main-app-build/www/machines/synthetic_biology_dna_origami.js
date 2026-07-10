export function createDnaOrigami(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const mat = new THREE.MeshStandardMaterial({ color: 0x9b59b6, wireframe: true });
    
    // Base Box
    const boxGeo = new THREE.BoxGeometry(4, 2, 4);
    const box = new THREE.Mesh(boxGeo, mat);
    box.position.y = 1;
    group.add(box);

    // Lid
    const lidGeo = new THREE.BoxGeometry(4, 0.2, 4);
    // Pivot at edge
    const lidGroup = new THREE.Group();
    const lid = new THREE.Mesh(lidGeo, mat);
    lid.position.set(0, 0.1, 2); // offset so pivot is at edge
    lidGroup.position.set(0, 2, -2);
    lidGroup.add(lid);
    lidGroup.name = 'OrigamiLid';
    group.add(lidGroup);

    // Animation: Lid opening
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI/2.5);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0);

    const values = [...q1.toArray(), ...q2.toArray(), ...q3.toArray()];
    const rotTrack = new THREE.QuaternionKeyframeTrack('OrigamiLid.quaternion', [0, 2, 4], values);
    
    const clip = new THREE.AnimationClip('OpenClose', 4, [rotTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
