import { materials } from '../utils/materials.js';

export function createAFMCantileverArray(THREE) {
    const group = new THREE.Group();
    group.name = 'AFMCantileverArray';

    // Base support
    const supportGeo = new THREE.BoxGeometry(5, 1, 1);
    const supportMat = materials.metallic || new THREE.MeshStandardMaterial({color: 0x555555, metalness: 0.6});
    const support = new THREE.Mesh(supportGeo, supportMat);
    group.add(support);

    const tracks = [];
    
    // Create 5 cantilevers
    for(let i=0; i<5; i++) {
        const cantileverGeo = new THREE.BoxGeometry(0.2, 0.05, 2);
        const cantileverMat = materials.accent || new THREE.MeshStandardMaterial({color: 0xeeeeee, roughness: 0.3});
        
        // Pivot point
        const pivot = new THREE.Group();
        pivot.position.set(-2 + i, 0, 0.5);
        pivot.name = `CantileverPivot${i}`;
        group.add(pivot);

        const cantilever = new THREE.Mesh(cantileverGeo, cantileverMat);
        cantilever.position.z = 1;
        pivot.add(cantilever);

        const tipGeo = new THREE.ConeGeometry(0.05, 0.2, 16);
        const tipMat = materials.highlight || new THREE.MeshStandardMaterial({color: 0xff0000});
        const tip = new THREE.Mesh(tipGeo, tipMat);
        tip.position.set(0, -0.1, 0.9); // relative to cantilever
        tip.rotation.x = Math.PI;
        cantilever.add(tip);

        // Animation: Tapping
        const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0);
        const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), -0.3); // bend down
        const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0);

        const qValues = [
            q1.x, q1.y, q1.z, q1.w,
            q2.x, q2.y, q2.z, q2.w,
            q3.x, q3.y, q3.z, q3.w
        ];
        
        // Offset time so they tap like a wave
        const times = [0, 0.5, 1].map(t => t + i*0.2);
        
        const rotTrack = new THREE.QuaternionKeyframeTrack(`CantileverPivot${i}.quaternion`, times, qValues);
        tracks.push(rotTrack);
    }
    
    const clip = new THREE.AnimationClip('TapWave', 2, tracks);

    return { group, animationClips: [clip] };
}
