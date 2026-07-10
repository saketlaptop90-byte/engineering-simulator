import { steel, iron, wood, redAccent, blackPlastic } from '../utils/materials.js';

export function createWoodLathe(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Stand
    const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2.5, 0.8), iron);
    leg1.position.set(-2, 1.25, 0);
    group.add(leg1);

    const leg2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2.5, 0.8), iron);
    leg2.position.set(2, 1.25, 0);
    group.add(leg2);

    // Bed
    const bed = new THREE.Mesh(new THREE.BoxGeometry(5, 0.3, 0.8), steel);
    bed.position.set(0, 2.65, 0);
    group.add(bed);

    // Headstock
    const headstock = new THREE.Mesh(new THREE.BoxGeometry(1, 0.8, 0.8), redAccent);
    headstock.position.set(-2, 3.2, 0);
    group.add(headstock);

    // Tailstock
    const tailstock = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.7, 0.8), iron);
    tailstock.position.set(1.5, 3.15, 0);
    group.add(tailstock);

    // Tool Rest
    const toolRestBase = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), blackPlastic);
    toolRestBase.position.set(-0.5, 3.0, 0.3);
    group.add(toolRestBase);
    
    const toolRestBar = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 0.1), steel);
    toolRestBar.position.set(-0.5, 3.3, 0.3);
    group.add(toolRestBar);

    // Spindle / Rotating Group
    const spindleGroup = new THREE.Group();
    spindleGroup.position.set(-1.5, 3.2, 0);
    spindleGroup.name = "latheSpindle";
    
    // Chuck
    const chuck = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.3, 16), steel);
    chuck.rotation.z = Math.PI / 2;
    chuck.position.set(0.15, 0, 0);
    spindleGroup.add(chuck);

    // Wood piece
    const woodGeo = new THREE.CylinderGeometry(0.25, 0.25, 2.5, 16);
    const woodMesh = new THREE.Mesh(woodGeo, wood);
    woodMesh.rotation.z = Math.PI / 2;
    woodMesh.position.set(1.55, 0, 0); // Spans from chuck to tailstock
    spindleGroup.add(woodMesh);

    group.add(spindleGroup);

    // Animation: Spindle spinning
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI);
    const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI * 2);

    const qTrack = new THREE.QuaternionKeyframeTrack(
        `${spindleGroup.name}.quaternion`,
        [0, 0.2, 0.4],
        [
            q0.x, q0.y, q0.z, q0.w,
            q1.x, q1.y, q1.z, q1.w,
            q2.x, q2.y, q2.z, q2.w
        ]
    );

    const clip = new THREE.AnimationClip('LatheSpin', 0.4, [qTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
