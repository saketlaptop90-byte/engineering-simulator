import { materials } from '../utils/materials.js';

export function createShellAndTubeHeatExchanger(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Shell
    const shellGeom = new THREE.CylinderGeometry(3, 3, 16, 32);
    shellGeom.rotateZ(Math.PI / 2);
    const shell = new THREE.Mesh(shellGeom, materials.steel);
    
    // transparent to see tubes
    shell.material = shell.material.clone();
    shell.material.transparent = true;
    shell.material.opacity = 0.3;
    group.add(shell);

    // Tubes
    const tubesGroup = new THREE.Group();
    for(let i=0; i<15; i++) {
        const r = 2 * Math.sqrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const tubeGeom = new THREE.CylinderGeometry(0.2, 0.2, 16, 8);
        tubeGeom.rotateZ(Math.PI / 2);
        const tube = new THREE.Mesh(tubeGeom, materials.copper);
        tube.position.y = r * Math.sin(theta);
        tube.position.z = r * Math.cos(theta);
        tubesGroup.add(tube);
    }
    group.add(tubesGroup);

    // Baffles
    for(let i=-6; i<=6; i+=3) {
        const baffleGeom = new THREE.CylinderGeometry(2.9, 2.9, 0.1, 32, 1, false, 0, Math.PI * 1.5);
        baffleGeom.rotateZ(Math.PI / 2);
        const baffle = new THREE.Mesh(baffleGeom, materials.steel);
        baffle.position.x = i;
        if(i % 2 === 0) baffle.rotation.x = Math.PI;
        group.add(baffle);
    }

    // Heat transfer animation (moving fluid particles)
    const fluidGeom = new THREE.SphereGeometry(0.5, 8, 8);
    const fluid = new THREE.Mesh(fluidGeom, materials.water);
    fluid.position.set(-8, 2, 0);
    group.add(fluid);

    const fluidTrack = new THREE.VectorKeyframeTrack(
        `${fluid.uuid}.position`,
        [0, 1, 2, 3, 4],
        [
            -8, 2, 0,
            -4, -2, 0,
            0, 2, 0,
            4, -2, 0,
            8, 2, 0
        ]
    );
    const clip = new THREE.AnimationClip('Flow', 4, [fluidTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
