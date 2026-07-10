import * as materials from '../utils/materials.js';

export function createCottonGin(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const baseMaterial = materials.baseMaterial || new THREE.MeshStandardMaterial({ color: 0x333333 });
    const rollerMaterial = materials.rollerMaterial || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.4 });
    const bladeMaterial = materials.bladeMaterial || new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.8 });

    // Frame
    const frameGeo = new THREE.BoxGeometry(4, 3, 2);
    const frame = new THREE.Mesh(frameGeo, baseMaterial);
    frame.position.y = 1.5;
    group.add(frame);

    // Rollers
    const rollerGroup1 = new THREE.Group();
    rollerGroup1.position.set(-0.5, 2.5, 0);
    const roller1Geo = new THREE.CylinderGeometry(0.4, 0.4, 2.2, 32);
    const roller1 = new THREE.Mesh(roller1Geo, rollerMaterial);
    roller1.rotation.x = Math.PI / 2;
    rollerGroup1.add(roller1);
    group.add(rollerGroup1);

    const rollerGroup2 = new THREE.Group();
    rollerGroup2.position.set(0.5, 2.5, 0);
    const roller2Geo = new THREE.CylinderGeometry(0.4, 0.4, 2.2, 32);
    const roller2 = new THREE.Mesh(roller2Geo, rollerMaterial);
    roller2.rotation.x = Math.PI / 2;
    rollerGroup2.add(roller2);
    group.add(rollerGroup2);

    // Saws/Blades on rollers
    for (let i = 0; i < 10; i++) {
        const bladeGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.05, 16);
        const blade = new THREE.Mesh(bladeGeo, bladeMaterial);
        blade.position.y = -1 + i * 0.22;
        roller1.add(blade.clone());
        roller2.add(blade.clone());
    }

    // Animation
    const duration = 2;
    const times = [];
    const values1 = [];
    const values2 = [];
    
    for (let i = 0; i <= 20; i++) {
        const t = (i / 20) * duration;
        times.push(t);
        const angle = (i / 20) * Math.PI * 2;
        
        const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle);
        values1.push(q1.x, q1.y, q1.z, q1.w);
        
        const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -angle);
        values2.push(q2.x, q2.y, q2.z, q2.w);
    }

    const track1 = new THREE.QuaternionKeyframeTrack(`${rollerGroup1.uuid}.quaternion`, times, values1);
    const track2 = new THREE.QuaternionKeyframeTrack(`${rollerGroup2.uuid}.quaternion`, times, values2);

    const clip = new THREE.AnimationClip('GinOperation', duration, [track1, track2]);
    animationClips.push(clip);

    return { group, animationClips };
}
