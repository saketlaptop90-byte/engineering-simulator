import * as materials from '../utils/materials.js';

export function createPelletizingExtruderDie(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Extruder Barrel End
    const barrelGeom = new THREE.CylinderGeometry(1, 1, 3, 32);
    barrelGeom.rotateZ(Math.PI / 2);
    const barrel = new THREE.Mesh(barrelGeom, materials.steel);
    barrel.position.x = -1.5;
    group.add(barrel);

    // Die Plate
    const dieGeom = new THREE.CylinderGeometry(1.1, 1.1, 0.2, 32);
    dieGeom.rotateZ(Math.PI / 2);
    const die = new THREE.Mesh(dieGeom, materials.darkSteel);
    die.position.x = 0.1;
    group.add(die);

    // Die holes (decorative)
    for (let i = 0; i < 12; i++) {
        const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.25, 8), materials.blackPlastic);
        hole.rotation.z = Math.PI / 2;
        const angle = (i / 12) * Math.PI * 2;
        hole.position.set(0.1, 0.6 * Math.cos(angle), 0.6 * Math.sin(angle));
        group.add(hole);
    }

    // Cutter Assembly
    const cutterGroup = new THREE.Group();
    cutterGroup.position.x = 0.25;
    cutterGroup.name = 'cutterAssembly';
    group.add(cutterGroup);

    const shaftGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 16);
    shaftGeom.rotateZ(Math.PI / 2);
    const shaft = new THREE.Mesh(shaftGeom, materials.chrome);
    cutterGroup.add(shaft);

    const bladeGeom = new THREE.BoxGeometry(0.05, 1.8, 0.2);
    const blade1 = new THREE.Mesh(bladeGeom, materials.chrome);
    const blade2 = new THREE.Mesh(bladeGeom, materials.chrome);
    blade2.rotation.x = Math.PI / 2;
    cutterGroup.add(blade1, blade2);

    // Water Casing / Cover
    const coverGeom = new THREE.CylinderGeometry(1.5, 1.5, 2, 32);
    coverGeom.rotateZ(Math.PI / 2);
    const cover = new THREE.Mesh(coverGeom, materials.glass);
    cover.position.x = 1;
    group.add(cover);

    // Strands (Extruding Plastic)
    const strandGroup = new THREE.Group();
    strandGroup.name = 'strands';
    group.add(strandGroup);

    for (let i = 0; i < 12; i++) {
        const strandGeom = new THREE.CylinderGeometry(0.04, 0.04, 1, 8);
        strandGeom.rotateZ(Math.PI / 2);
        const strand = new THREE.Mesh(strandGeom, materials.plastic);
        const angle = (i / 12) * Math.PI * 2;
        strand.position.set(0.7, 0.6 * Math.cos(angle), 0.6 * Math.sin(angle));
        strandGroup.add(strand);
    }

    // Animations: Cutter spins rapidly, Strands pulse in scale-X
    const times = [0, 0.5, 1];
    
    // Cutter spinning
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI * 10); // Very fast
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI * 20);
    
    const rotVals = [
        q0.x, q0.y, q0.z, q0.w,
        q1.x, q1.y, q1.z, q1.w,
        q2.x, q2.y, q2.z, q2.w
    ];
    const cutterTrack = new THREE.QuaternionKeyframeTrack(`cutterAssembly.quaternion`, times, rotVals);

    // Strands scaling
    const sTimes = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
    const sVals = [];
    for(let i=0; i<sTimes.length; i++) {
        // scale alternates between 0.2 and 1.0
        const scaleX = (i % 2 === 0) ? 0.2 : 1.0;
        sVals.push(scaleX, 1, 1);
    }
    const strandTrack = new THREE.VectorKeyframeTrack(`strands.scale`, sTimes, sVals);

    const clip = new THREE.AnimationClip('Pelletizing', 1, [cutterTrack, strandTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
