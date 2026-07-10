import * as materials from '../utils/materials.js';

export function createStewartPlatform(THREE) {
    const group = new THREE.Group();

    const aluminum = materials.aluminum || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
    const steel = materials.steel || new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.9, roughness: 0.3 });
    const brass = materials.brass || new THREE.MeshStandardMaterial({ color: 0xb5a642, metalness: 0.8, roughness: 0.3 });

    const baseRadius = 3;
    const baseGeometry = new THREE.CylinderGeometry(baseRadius, baseRadius, 0.4, 32);
    const basePlate = new THREE.Mesh(baseGeometry, aluminum);
    group.add(basePlate);

    const topRadius = 2.5;
    const topGeometry = new THREE.CylinderGeometry(topRadius, topRadius, 0.4, 32);
    const topPlate = new THREE.Mesh(topGeometry, aluminum);
    group.add(topPlate);

    const legs = [];
    for(let i=0; i<6; i++) {
        const angleBase = (i * Math.PI / 3) + (i%2 === 0 ? 0.2 : -0.2);
        const angleTop = (i * Math.PI / 3) + (i%2 === 0 ? -0.2 : 0.2);

        const bx = Math.cos(angleBase) * (baseRadius - 0.2);
        const bz = Math.sin(angleBase) * (baseRadius - 0.2);
        
        const tx = Math.cos(angleTop) * (topRadius - 0.2);
        const tz = Math.sin(angleTop) * (topRadius - 0.2);

        const legGroup = new THREE.Group();
        legGroup.position.set(bx, 0.2, bz);
        group.add(legGroup);

        const piston = new THREE.Group();
        legGroup.add(piston);

        const lowerLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1, 8), steel);
        lowerLeg.position.y = 0.5;
        piston.add(lowerLeg);

        const upperLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1, 8), brass);
        upperLeg.position.y = 1.5;
        piston.add(upperLeg);

        legs.push({ 
            basePos: new THREE.Vector3(bx, 0.2, bz), 
            topOffset: new THREE.Vector3(tx, -0.2, tz), 
            legGroup,
            piston
        });
    }

    const times = [0, 1, 2, 3, 4, 5, 6];
    
    const topPosData = [
        new THREE.Vector3(0, 4, 0),
        new THREE.Vector3(0, 4.5, 0),
        new THREE.Vector3(0.5, 4, 0),
        new THREE.Vector3(-0.5, 4, 0),
        new THREE.Vector3(0, 3.5, 0),
        new THREE.Vector3(0, 4, 0),
        new THREE.Vector3(0, 4, 0)
    ];
    
    const euler = new THREE.Euler();
    const topRotData = [
        new THREE.Quaternion().setFromEuler(euler.set(0, 0, 0)),
        new THREE.Quaternion().setFromEuler(euler.set(0, 0, 0)),
        new THREE.Quaternion().setFromEuler(euler.set(0.3, 0, 0)),
        new THREE.Quaternion().setFromEuler(euler.set(0, 0, 0.3)),
        new THREE.Quaternion().setFromEuler(euler.set(0, 0.4, 0)),
        new THREE.Quaternion().setFromEuler(euler.set(-0.2, 0.2, -0.2)),
        new THREE.Quaternion().setFromEuler(euler.set(0, 0, 0))
    ];

    const topPosValues = [];
    const topRotValues = [];
    
    const legRotValues = Array(6).fill().map(() => []);
    const legScaleValues = Array(6).fill().map(() => []);

    for(let i=0; i<times.length; i++) {
        const tPos = topPosData[i];
        const tRot = topRotData[i];

        topPosValues.push(tPos.x, tPos.y, tPos.z);
        topRotValues.push(tRot.x, tRot.y, tRot.z, tRot.w);

        const topMatrix = new THREE.Matrix4().compose(tPos, tRot, new THREE.Vector3(1,1,1));

        for(let j=0; j<6; j++) {
            const leg = legs[j];
            const targetPos = leg.topOffset.clone().applyMatrix4(topMatrix);
            
            const dir = new THREE.Vector3().subVectors(targetPos, leg.basePos);
            const dist = dir.length();
            
            legScaleValues[j].push(1, dist / 2, 1); 

            dir.normalize();
            const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);

            legRotValues[j].push(q.x, q.y, q.z, q.w);
        }
    }

    const tracks = [];
    tracks.push(new THREE.VectorKeyframeTrack(topPlate.uuid + '.position', times, topPosValues));
    tracks.push(new THREE.QuaternionKeyframeTrack(topPlate.uuid + '.quaternion', times, topRotValues));

    for(let j=0; j<6; j++) {
        tracks.push(new THREE.QuaternionKeyframeTrack(legs[j].legGroup.uuid + '.quaternion', times, legRotValues[j]));
        tracks.push(new THREE.VectorKeyframeTrack(legs[j].piston.uuid + '.scale', times, legScaleValues[j]));
    }

    const clip = new THREE.AnimationClip('StewartMotion', 6, tracks);

    return { group, animationClips: [clip] };
}
