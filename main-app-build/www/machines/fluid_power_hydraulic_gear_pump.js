import { steel, castIron, brass, tinted, glass, redAccent } from '../utils/materials.js';

export function createHydraulicGearPump(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Pump Housing (cutaway)
    const housingShape = new THREE.Shape();
    housingShape.absarc(-1.2, 0, 1.8, Math.PI/2, Math.PI*1.5, false);
    housingShape.absarc(1.2, 0, 1.8, -Math.PI/2, Math.PI/2, false);
    
    const extrudeSettings = { depth: 2, bevelEnabled: false };
    const housingGeo = new THREE.ExtrudeGeometry(housingShape, extrudeSettings);
    
    const housingMat = glass.clone();
    housingMat.opacity = 0.3;
    const housing = new THREE.Mesh(housingGeo, housingMat);
    housing.position.z = -1;
    group.add(housing);
    
    // Back plate
    const backGeo = new THREE.ExtrudeGeometry(housingShape, { depth: 0.2, bevelEnabled: false });
    const backPlate = new THREE.Mesh(backGeo, castIron);
    backPlate.position.z = -1.2;
    group.add(backPlate);

    // Gears
    function createGearGeo() {
        const gearShape = new THREE.Shape();
        const teeth = 12;
        const outerR = 1.6;
        const innerR = 1.2;
        for (let i = 0; i < teeth * 2; i++) {
            const r = (i % 2 === 0) ? outerR : innerR;
            const angle = (i / (teeth * 2)) * Math.PI * 2;
            if (i === 0) gearShape.moveTo(Math.cos(angle)*r, Math.sin(angle)*r);
            else gearShape.lineTo(Math.cos(angle)*r, Math.sin(angle)*r);
        }
        return new THREE.ExtrudeGeometry(gearShape, { depth: 1.8, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 });
    }

    const gearGeo = createGearGeo();
    const gear1 = new THREE.Mesh(gearGeo, steel);
    gear1.position.set(-1.2, 0, -0.9);
    group.add(gear1);

    const gear2 = new THREE.Mesh(gearGeo, steel);
    gear2.position.set(1.2, 0, -0.9);
    gear2.rotation.z = Math.PI / 12;
    group.add(gear2);

    // Shafts
    const shaftGeo = new THREE.CylinderGeometry(0.4, 0.4, 3, 16);
    const shaft1 = new THREE.Mesh(shaftGeo, brass);
    shaft1.rotation.x = Math.PI/2;
    gear1.add(shaft1);
    
    const shaft2 = new THREE.Mesh(shaftGeo, brass);
    shaft2.rotation.x = Math.PI/2;
    gear2.add(shaft2);

    // Fluid particles representing flow
    const fluidMat = redAccent.clone();
    const particleGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const particles = new THREE.Group();
    group.add(particles);

    for (let i=0; i<40; i++) {
        const p = new THREE.Mesh(particleGeo, fluidMat);
        particles.add(p);
    }

    // Gear rotation
    const qStart1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), 0);
    const qEnd1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), -Math.PI*2);
    const qMid1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), -Math.PI);

    const gear1Track = new THREE.QuaternionKeyframeTrack(
        gear1.uuid + '.quaternion',
        [0, 1, 2],
        [
            qStart1.x, qStart1.y, qStart1.z, qStart1.w,
            qMid1.x, qMid1.y, qMid1.z, qMid1.w,
            qStart1.x, qStart1.y, qStart1.z, qStart1.w
        ]
    );

    const qStart2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI/12);
    const qMid2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), Math.PI + Math.PI/12);
    const gear2Track = new THREE.QuaternionKeyframeTrack(
        gear2.uuid + '.quaternion',
        [0, 1, 2],
        [
            qStart2.x, qStart2.y, qStart2.z, qStart2.w,
            qMid2.x, qMid2.y, qMid2.z, qMid2.w,
            qStart2.x, qStart2.y, qStart2.z, qStart2.w
        ]
    );

    const clip = new THREE.AnimationClip('PumpCycle', 2, [gear1Track, gear2Track]);
    
    particles.children.forEach((p, i) => {
        const isLeft = i % 2 === 0;
        let pTimes = [0, 0.5, 1.0, 1.5, 2.0];
        let pVals = [];
        
        for (let t=0; t<=2.0; t+=0.5) {
            let phase = (t/2 + i/40) % 1.0; 
            let angle;
            if (isLeft) {
                angle = -Math.PI/2 + phase * Math.PI; 
                pVals.push(-1.2 + Math.cos(angle)*1.5, Math.sin(angle)*1.5, 0);
            } else {
                angle = -Math.PI/2 - phase * Math.PI; 
                pVals.push(1.2 + Math.cos(angle)*1.5, Math.sin(angle)*1.5, 0);
            }
        }
        
        const zipped = pTimes.map((t, idx) => ({ t, v: [pVals[idx*3], pVals[idx*3+1], pVals[idx*3+2]] }));
        zipped.sort((a,b) => a.t - b.t);
        const sortedTimes = zipped.map(z => z.t);
        const sortedVals = zipped.flatMap(z => z.v);

        const pTrack = new THREE.VectorKeyframeTrack(
            p.uuid + '.position',
            sortedTimes,
            sortedVals
        );
        clip.tracks.push(pTrack);
    });

    animationClips.push(clip);

    return { group, animationClips };
}
