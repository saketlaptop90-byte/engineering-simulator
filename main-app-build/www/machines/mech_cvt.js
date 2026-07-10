import { darkSteel, aluminum, brass } from '../utils/materials.js';

export function createCVT(THREE) {
    const group = new THREE.Group();
    group.name = "CVT";

    const primary = new THREE.Group();
    primary.name = "PrimaryPulley";
    primary.position.set(-2, 0, 0);
    group.add(primary);

    const pCone1 = new THREE.Mesh(new THREE.ConeGeometry(1.5, 0.5, 32), aluminum);
    pCone1.name = "PCone1";
    pCone1.rotation.x = Math.PI / 2;
    primary.add(pCone1);

    const pCone2 = new THREE.Mesh(new THREE.ConeGeometry(1.5, 0.5, 32), aluminum);
    pCone2.name = "PCone2";
    pCone2.rotation.x = -Math.PI / 2;
    primary.add(pCone2);

    const secondary = new THREE.Group();
    secondary.name = "SecondaryPulley";
    secondary.position.set(2, 0, 0);
    group.add(secondary);

    const sCone1 = new THREE.Mesh(new THREE.ConeGeometry(1.5, 0.5, 32), darkSteel);
    sCone1.name = "SCone1";
    sCone1.rotation.x = Math.PI / 2;
    secondary.add(sCone1);

    const sCone2 = new THREE.Mesh(new THREE.ConeGeometry(1.5, 0.5, 32), darkSteel);
    sCone2.name = "SCone2";
    sCone2.rotation.x = -Math.PI / 2;
    secondary.add(sCone2);

    const duration = 4;
    const times = [0, 2, 4];
    
    const pc1Vals = [], pc2Vals = [], sc1Vals = [], sc2Vals = [];
    const pc1Z = [0.25, 0.5, 0.25];
    const pc2Z = [-0.25, -0.5, -0.25];
    const sc1Z = [0.5, 0.25, 0.5];
    const sc2Z = [-0.5, -0.25, -0.5];

    for(let i=0; i<3; i++) {
        pc1Vals.push(0, 0, pc1Z[i]);
        pc2Vals.push(0, 0, pc2Z[i]);
        sc1Vals.push(0, 0, sc1Z[i]);
        sc2Vals.push(0, 0, sc2Z[i]);
    }

    const tracks = [
        new THREE.VectorKeyframeTrack('PCone1.position', times, pc1Vals),
        new THREE.VectorKeyframeTrack('PCone2.position', times, pc2Vals),
        new THREE.VectorKeyframeTrack('SCone1.position', times, sc1Vals),
        new THREE.VectorKeyframeTrack('SCone2.position', times, sc2Vals)
    ];

    const steps = 32;
    const rotTimes = [];
    const pRotVals = [];
    const sRotVals = [];
    for(let i=0; i<=steps; i++) {
        const t = (i/steps);
        rotTimes.push(t * duration);
        const pQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), t * Math.PI * 8);
        pRotVals.push(pQ.x, pQ.y, pQ.z, pQ.w);
        const sQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1), t * Math.PI * 4);
        sRotVals.push(sQ.x, sQ.y, sQ.z, sQ.w);
    }
    tracks.push(new THREE.QuaternionKeyframeTrack('PrimaryPulley.quaternion', rotTimes, pRotVals));
    tracks.push(new THREE.QuaternionKeyframeTrack('SecondaryPulley.quaternion', rotTimes, sRotVals));

    const clip = new THREE.AnimationClip("ShiftAction", duration, tracks);

    return { group, animationClips: [clip] };
}
