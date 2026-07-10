import * as materials from '../utils/materials.js';

export function createBOP(THREE) {
    const group = new THREE.Group();
    
    // Main Body Spool
    const bodyGeo = new THREE.CylinderGeometry(1, 1, 6, 32);
    const body = new THREE.Mesh(bodyGeo, materials.blueAccent);
    body.position.y = 3;
    group.add(body);

    // Annular Preventer (Top)
    const annularGeo = new THREE.CylinderGeometry(1.5, 1.5, 1.5, 32);
    const annular = new THREE.Mesh(annularGeo, materials.darkSteel);
    annular.position.y = 6.75;
    group.add(annular);

    const rubberGeo = new THREE.CylinderGeometry(0.8, 0.8, 1, 32);
    const rubberElement = new THREE.Mesh(rubberGeo, materials.rubber);
    rubberElement.position.y = 6.75;
    rubberElement.name = 'annularRubber';
    group.add(rubberElement);

    // Rams
    function createRam(yPos, namePrefix) {
        const ramGroup = new THREE.Group();
        ramGroup.position.y = yPos;
        
        // Ram Housing
        const housingGeo = new THREE.BoxGeometry(5, 0.8, 1.2);
        const housing = new THREE.Mesh(housingGeo, materials.blueAccent);
        ramGroup.add(housing);

        // Actuators
        const actGeo = new THREE.CylinderGeometry(0.4, 0.4, 1.5);
        const act1 = new THREE.Mesh(actGeo, materials.steel);
        act1.rotation.z = Math.PI / 2;
        act1.position.set(3.25, 0, 0);
        ramGroup.add(act1);

        const act2 = new THREE.Mesh(actGeo, materials.steel);
        act2.rotation.z = Math.PI / 2;
        act2.position.set(-3.25, 0, 0);
        ramGroup.add(act2);

        // Ram blocks (moving parts)
        const blockGeo = new THREE.BoxGeometry(1.5, 0.6, 1);
        
        const blockRight = new THREE.Mesh(blockGeo, materials.steel);
        blockRight.position.set(2, 0, 0);
        blockRight.name = namePrefix + 'Right';
        ramGroup.add(blockRight);

        const blockLeft = new THREE.Mesh(blockGeo, materials.steel);
        blockLeft.position.set(-2, 0, 0);
        blockLeft.name = namePrefix + 'Left';
        ramGroup.add(blockLeft);

        return ramGroup;
    }

    const blindRams = createRam(4.5, 'blind');
    const pipeRams = createRam(2.5, 'pipe');
    group.add(blindRams);
    group.add(pipeRams);

    // Drill Pipe passing through
    const pipeGeo = new THREE.CylinderGeometry(0.3, 0.3, 10, 16);
    const drillPipe = new THREE.Mesh(pipeGeo, materials.chrome);
    drillPipe.position.y = 4;
    group.add(drillPipe);

    // Animations (Rams closing, then opening)
    const duration = 6;
    const times = [0, 1.5, 3, 4.5, 6];

    // Annular scaling (squeezing the pipe)
    const rubberScaleTrack = new THREE.VectorKeyframeTrack('annularRubber.scale', times, [
        1, 1, 1,
        0.4, 1, 0.4,
        0.4, 1, 0.4,
        1, 1, 1,
        1, 1, 1
    ]);

    // Pipe Rams closing
    const pipeRightTrack = new THREE.VectorKeyframeTrack('pipeRight.position', times, [
        2, 0, 0,
        0.3, 0, 0,
        0.3, 0, 0,
        2, 0, 0,
        2, 0, 0
    ]);
    const pipeLeftTrack = new THREE.VectorKeyframeTrack('pipeLeft.position', times, [
        -2, 0, 0,
        -0.3, 0, 0,
        -0.3, 0, 0,
        -2, 0, 0,
        -2, 0, 0
    ]);

    // Blind Rams (simulate closing completely, cutting pipe - visually just moving)
    const blindRightTrack = new THREE.VectorKeyframeTrack('blindRight.position', times, [
        2, 0, 0,
        2, 0, 0, // delay
        0, 0, 0, // close
        0, 0, 0,
        2, 0, 0
    ]);
    const blindLeftTrack = new THREE.VectorKeyframeTrack('blindLeft.position', times, [
        -2, 0, 0,
        -2, 0, 0,
        0, 0, 0,
        0, 0, 0,
        -2, 0, 0
    ]);

    const clip = new THREE.AnimationClip('BOP_Sequence', duration, [
        rubberScaleTrack, pipeRightTrack, pipeLeftTrack, blindRightTrack, blindLeftTrack
    ]);

    return { group, animationClips: [clip] };
}

// Auto-generated missing stub
export function createSubseaBOP() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
