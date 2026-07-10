import * as materials from '../utils/materials.js';

export function createAutomatedIris(THREE) {
    const group = new THREE.Group();

    const steel = materials.steel || new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.9, roughness: 0.3 });
    const brass = materials.brass || new THREE.MeshStandardMaterial({ color: 0xb5a642, metalness: 0.8, roughness: 0.3 });
    const darkMetal = materials.darkMetal || new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.7, roughness: 0.5 });

    const baseRing = new THREE.Mesh(new THREE.TorusGeometry(3, 0.2, 16, 64), darkMetal);
    group.add(baseRing);

    const driveRing = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.1, 16, 64), brass);
    driveRing.position.z = 0.2;
    group.add(driveRing);

    const numBlades = 8;
    const blades = [];
    
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, 0);
    bladeShape.quadraticCurveTo(1.5, 2, 3, 0);
    bladeShape.quadraticCurveTo(1.5, 0.5, 0, 0);
    
    const extrudeSettings = { depth: 0.05, bevelEnabled: false };
    const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, extrudeSettings);

    for(let i=0; i<numBlades; i++) {
        const angle = (i / numBlades) * Math.PI * 2;
        
        const bladeGroup = new THREE.Group();
        bladeGroup.position.set(Math.cos(angle) * 2.8, Math.sin(angle) * 2.8, 0.1 + i * 0.01);
        bladeGroup.rotation.z = angle + Math.PI / 2;
        
        const bladeMesh = new THREE.Mesh(bladeGeo, steel);
        bladeMesh.position.set(0, 0, 0);
        bladeMesh.rotation.z = -Math.PI / 6;

        bladeGroup.add(bladeMesh);
        group.add(bladeGroup);
        blades.push(bladeGroup);
    }

    const times = [0, 2, 4, 6];
    
    const driveRots = [0, Math.PI / 4, 0, -Math.PI / 8];
    const ringQs = [];
    for(let r of driveRots) {
        const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), r);
        ringQs.push(q.x, q.y, q.z, q.w);
    }
    const ringTrack = new THREE.QuaternionKeyframeTrack(driveRing.uuid + '.quaternion', times, ringQs);

    const tracks = [ringTrack];

    for(let i=0; i<numBlades; i++) {
        const baseAngle = (i / numBlades) * Math.PI * 2 + Math.PI / 2;
        const bladeQs = [];
        for(let r of driveRots) {
            const currentAngle = baseAngle + r * 1.5;
            const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), currentAngle);
            bladeQs.push(q.x, q.y, q.z, q.w);
        }
        const bTrack = new THREE.QuaternionKeyframeTrack(blades[i].uuid + '.quaternion', times, bladeQs);
        tracks.push(bTrack);
    }

    const clip = new THREE.AnimationClip('IrisActuation', 6, tracks);

    return { group, animationClips: [clip] };
}
