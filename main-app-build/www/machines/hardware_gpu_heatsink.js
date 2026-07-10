import { copper, aluminum, blackPlastic, steel } from '../utils/materials.js';

export function createGPUHeatsink(THREE) {
    const group = new THREE.Group();
    group.name = 'GPUHeatsink';

    const baseGeom = new THREE.BoxGeometry(4, 0.4, 4);
    const basePlate = new THREE.Mesh(baseGeom, copper);
    basePlate.name = "BasePlate";
    group.add(basePlate);

    const pipeGeom = new THREE.CylinderGeometry(0.15, 0.15, 10, 16);
    const pipeGroup = new THREE.Group();
    pipeGroup.name = "PipeGroup";
    for(let i=0; i<4; i++) {
        const pipe = new THREE.Mesh(pipeGeom, copper);
        pipe.rotation.z = Math.PI / 2;
        pipe.position.set(0, 0.3, -1.5 + i);
        pipeGroup.add(pipe);
    }
    group.add(pipeGroup);

    const finGroup = new THREE.Group();
    finGroup.name = "FinStack";
    const finGeom = new THREE.BoxGeometry(9, 2, 0.05);
    for(let i=0; i<40; i++) {
        const fin = new THREE.Mesh(finGeom, aluminum);
        fin.position.set(0, 1.5, -2 + i*0.1);
        finGroup.add(fin);
    }
    group.add(finGroup);

    const shroudGroup = new THREE.Group();
    shroudGroup.name = "Shroud";
    const shroudGeom = new THREE.BoxGeometry(9.5, 0.5, 4.5);
    const shroud = new THREE.Mesh(shroudGeom, blackPlastic);
    shroud.position.set(0, 2.75, 0);
    shroudGroup.add(shroud);

    const fanHubGeom = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16);
    const bladeGeom = new THREE.BoxGeometry(1.2, 0.05, 0.4);
    
    for(let f=0; f<2; f++) {
        const fan = new THREE.Group();
        fan.position.set(f===0 ? -2.5 : 2.5, 3.0, 0);
        fan.name = `Fan${f}`;
        const hub = new THREE.Mesh(fanHubGeom, blackPlastic);
        fan.add(hub);
        for(let b=0; b<9; b++) {
            const blade = new THREE.Mesh(bladeGeom, blackPlastic);
            blade.position.x = 0.8;
            blade.rotation.x = 0.2;
            const pivot = new THREE.Group();
            pivot.rotation.y = (b/9) * Math.PI * 2;
            pivot.add(blade);
            fan.add(pivot);
        }
        shroudGroup.add(fan);
    }
    group.add(shroudGroup);

    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI/2);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI);
    const q3 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI * 1.5);
    const q4 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI * 2);

    const fanTimes = [0, 0.25, 0.5, 0.75, 1];
    const fanValues = [
        q0.x, q0.y, q0.z, q0.w,
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w,
        q3.x, q3.y, q3.z, q3.w,
        q4.x, q4.y, q4.z, q4.w
    ];

    const fan0Track = new THREE.QuaternionKeyframeTrack("Fan0.quaternion", fanTimes, fanValues);
    const fan1Track = new THREE.QuaternionKeyframeTrack("Fan1.quaternion", fanTimes, fanValues);

    const explodeTimes = [0, 2, 4]; 
    
    const finStackPos = [
        0, 0, 0,
        0, 3, 0,
        0, 0, 0
    ];
    const finTrack = new THREE.VectorKeyframeTrack("FinStack.position", explodeTimes, finStackPos);

    const shroudPos = [
        0, 0, 0,
        0, 6, 0,
        0, 0, 0
    ];
    const shroudTrack = new THREE.VectorKeyframeTrack("Shroud.position", explodeTimes, shroudPos);

    const pipePos = [
        0, 0, 0,
        0, 1.5, 0,
        0, 0, 0
    ];
    const pipeTrack = new THREE.VectorKeyframeTrack("PipeGroup.position", explodeTimes, pipePos);

    const animClip = new THREE.AnimationClip("Operating", 1, [fan0Track, fan1Track]);
    const explodeClip = new THREE.AnimationClip("Explode", 4, [finTrack, shroudTrack, pipeTrack]);

    return { group, animationClips: [animClip, explodeClip] };
}
