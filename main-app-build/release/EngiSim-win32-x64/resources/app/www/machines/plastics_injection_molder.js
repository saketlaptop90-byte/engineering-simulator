import * as materials from '../utils/materials.js';

export function createInjectionMoldingMachine(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base
    const baseGeom = new THREE.BoxGeometry(10, 1, 3);
    const base = new THREE.Mesh(baseGeom, materials.castIron);
    base.position.y = 0.5;
    group.add(base);

    // Barrel
    const barrelGeom = new THREE.CylinderGeometry(0.5, 0.5, 4, 16);
    barrelGeom.rotateZ(Math.PI / 2);
    const barrel = new THREE.Mesh(barrelGeom, materials.steel);
    barrel.position.set(-1, 2, 0);
    group.add(barrel);

    // Hopper
    const hopperGeom = new THREE.ConeGeometry(0.8, 1.5, 16);
    const hopper = new THREE.Mesh(hopperGeom, materials.blueAccent);
    hopper.position.set(-2.5, 3.25, 0);
    hopper.rotation.z = Math.PI; // upside down
    group.add(hopper);

    // Auger (Screw)
    const augerGroup = new THREE.Group();
    const shaftGeom = new THREE.CylinderGeometry(0.2, 0.2, 4, 8);
    shaftGeom.rotateZ(Math.PI / 2);
    const shaft = new THREE.Mesh(shaftGeom, materials.chrome);
    augerGroup.add(shaft);
    
    // Add threads to auger
    for (let i = 0; i < 20; i++) {
        const threadGeom = new THREE.TorusGeometry(0.35, 0.05, 8, 16);
        threadGeom.rotateY(Math.PI / 2);
        const thread = new THREE.Mesh(threadGeom, materials.chrome);
        thread.position.x = -1.8 + i * 0.18;
        augerGroup.add(thread);
    }
    augerGroup.position.set(-1, 2, 0);
    group.add(augerGroup);

    // Mold Fixed Half
    const fixedMoldGeom = new THREE.BoxGeometry(1, 2, 2);
    const fixedMold = new THREE.Mesh(fixedMoldGeom, materials.darkSteel);
    fixedMold.position.set(1.5, 2, 0);
    group.add(fixedMold);

    // Mold Movable Half
    const movableMoldGeom = new THREE.BoxGeometry(1, 2, 2);
    const movableMold = new THREE.Mesh(movableMoldGeom, materials.darkSteel);
    movableMold.position.set(2.5, 2, 0);
    group.add(movableMold);

    // Nozzle
    const nozzleGeom = new THREE.CylinderGeometry(0.1, 0.5, 0.5, 16);
    nozzleGeom.rotateZ(Math.PI / 2);
    const nozzle = new THREE.Mesh(nozzleGeom, materials.brass);
    nozzle.position.set(0.75, 2, 0);
    group.add(nozzle);

    // Animation: Auger rotation and injection translation
    const augerName = 'auger';
    augerGroup.name = augerName;
    const times = [0, 2, 3, 4, 5];
    // Rotate 360 deg multiple times
    const rotValues = [];
    const q = new THREE.Quaternion();
    for(let t of times) {
        q.setFromAxisAngle(new THREE.Vector3(1,0,0), t * Math.PI * 2);
        rotValues.push(q.x, q.y, q.z, q.w);
    }
    const augerRotTrack = new THREE.QuaternionKeyframeTrack(`${augerName}.quaternion`, times, rotValues);
    
    // Translate auger: retracts while rotating, then shoots forward
    const augerPosValues = [
        -1, 2, 0,
        -1.5, 2, 0, // retracted
        -1.5, 2, 0, // hold
        -1, 2, 0,   // injected
        -1, 2, 0    // hold
    ];
    const augerPosTrack = new THREE.VectorKeyframeTrack(`${augerName}.position`, times, augerPosValues);

    // Mold movement
    const moldName = 'movableMold';
    movableMold.name = moldName;
    const moldTimes = [0, 4, 4.5, 5, 6];
    const moldPosVals = [
        2.5, 2, 0, // hold closed
        2.5, 2, 0, // hold closed
        3.5, 2, 0, // open
        3.5, 2, 0, // hold open
        2.5, 2, 0  // close
    ];
    const moldPosTrack = new THREE.VectorKeyframeTrack(`${moldName}.position`, moldTimes, moldPosVals);

    const clip = new THREE.AnimationClip('InjectionCycle', 6, [augerRotTrack, augerPosTrack, moldPosTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
