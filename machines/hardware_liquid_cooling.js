import * as materials from '../utils/materials.js';

export function createLiquidCoolingRadiator(THREE) {
    const group = new THREE.Group();
    const clips = [];

    // Radiator body
    const radGeo = new THREE.BoxGeometry(12, 1.5, 27);
    const radiator = new THREE.Mesh(radGeo, materials.aluminum);
    group.add(radiator);

    // Fans (2x 120mm fans)
    const fanCenters = [-6, 6];
    const fanGeo = new THREE.CylinderGeometry(5.5, 5.5, 1, 32);
    const bladeGeo = new THREE.BoxGeometry(10, 0.5, 2);

    fanCenters.forEach((zPos, idx) => {
        const fanGroup = new THREE.Group();
        fanGroup.position.set(0, 1.25, zPos);
        fanGroup.name = `Fan_${idx}`;

        const frame = new THREE.Mesh(new THREE.TorusGeometry(5.8, 0.2, 16, 64), materials.plastic);
        frame.rotation.x = Math.PI / 2;
        group.add(frame);
        frame.position.set(0, 1.25, zPos);

        const hub = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 1.1, 32), materials.plastic);
        fanGroup.add(hub);

        for (let i = 0; i < 7; i++) {
            const blade = new THREE.Mesh(bladeGeo, materials.plastic);
            blade.rotation.y = (i * Math.PI * 2) / 7;
            blade.rotation.x = 0.3; // pitch
            fanGroup.add(blade);
        }

        group.add(fanGroup);
    });

    // Tubes
    const tubeMat = materials.glass.clone();
    tubeMat.transparent = true;
    tubeMat.opacity = 0.5;
    
    const tubePath1 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(2, 0, 14),
        new THREE.Vector3(3, 5, 18),
        new THREE.Vector3(8, 8, 20)
    ]);
    const tubeGeo1 = new THREE.TubeGeometry(tubePath1, 20, 0.6, 16, false);
    const tube1 = new THREE.Mesh(tubeGeo1, tubeMat);
    group.add(tube1);

    const tubePath2 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2, 0, 14),
        new THREE.Vector3(-3, 5, 18),
        new THREE.Vector3(-8, 8, 20)
    ]);
    const tubeGeo2 = new THREE.TubeGeometry(tubePath2, 20, 0.6, 16, false);
    const tube2 = new THREE.Mesh(tubeGeo2, tubeMat);
    group.add(tube2);

    // Fluid particles inside tube 1
    const fluidGroup = new THREE.Group();
    fluidGroup.name = "FluidFlow";
    const fluidBlobGeo = new THREE.SphereGeometry(0.4, 8, 8);
    const fluidMat = materials.electrolyte.clone();
    fluidMat.emissive = new THREE.Color(0x0088ff);
    for(let i=0; i<3; i++) {
        const blob = new THREE.Mesh(fluidBlobGeo, fluidMat);
        blob.name = `Blob_${i}`;
        fluidGroup.add(blob);
    }
    group.add(fluidGroup);

    // Animations: Fans rotate
    const fanTracks = fanCenters.map((_, idx) => {
        const times = [0, 1];
        const qStart = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0);
        const qEnd = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 2);
        const values = [...qStart.toArray(), ...qEnd.toArray()];
        return new THREE.QuaternionKeyframeTrack(`Fan_${idx}.quaternion`, times, values);
    });

    // Fluid flow animation logic using position track
    const tracks = [...fanTracks];
    for(let i=0; i<3; i++) {
        const times = [];
        const values = [];
        const numSteps = 20;
        for(let step=0; step<=numSteps; step++) {
            let t = (step / numSteps + i*0.33) % 1.0;
            let pt = tubePath1.getPointAt(t);
            times.push(step / numSteps);
            values.push(pt.x, pt.y, pt.z);
        }
        tracks.push(new THREE.VectorKeyframeTrack(`Blob_${i}.position`, times, values));
    }

    clips.push(new THREE.AnimationClip('CoolingOperation', 1, tracks));

    return { group, animationClips: clips };
}
