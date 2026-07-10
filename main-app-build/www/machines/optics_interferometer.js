import { allMaterials as mat, tinted } from '../utils/materials.js';

export function createInterferometerSetup(THREE) {
    const group = new THREE.Group();
    group.name = "Michelson Interferometer";
    const animationClips = [];

    // Base
    const boardGeo = new THREE.BoxGeometry(10, 0.4, 10);
    const board = new THREE.Mesh(boardGeo, mat.darkSteel);
    board.position.y = -0.2;
    group.add(board);

    // Laser Source
    const laserGeo = new THREE.BoxGeometry(2, 1, 1);
    const laser = new THREE.Mesh(laserGeo, mat.redAccent);
    laser.position.set(-4, 0.5, 0);
    group.add(laser);

    // Beam Splitter
    const bsGeo = new THREE.BoxGeometry(0.1, 1, 1);
    const bs = new THREE.Mesh(bsGeo, mat.glass);
    bs.position.set(0, 0.5, 0);
    bs.rotation.y = Math.PI / 4;
    group.add(bs);

    // Fixed Mirror
    const mirrorGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
    const fixedMirror = new THREE.Mesh(mirrorGeo, mat.chrome);
    fixedMirror.position.set(0, 0.5, -4);
    fixedMirror.rotation.x = Math.PI / 2;
    group.add(fixedMirror);

    // Movable Mirror on Linear Stage
    const stageGroup = new THREE.Group();
    stageGroup.position.set(4, 0.5, 0);
    group.add(stageGroup);

    const stageGeo = new THREE.BoxGeometry(1.5, 0.2, 1.5);
    const stage = new THREE.Mesh(stageGeo, mat.aluminum);
    stageGroup.add(stage);

    const movableMirror = new THREE.Mesh(mirrorGeo, mat.chrome);
    movableMirror.position.set(0, 0.5, 0);
    movableMirror.rotation.x = Math.PI / 2;
    movableMirror.rotation.z = Math.PI / 2;
    stageGroup.add(movableMirror);

    // Detector
    const detectorGeo = new THREE.BoxGeometry(1, 1, 1);
    const detector = new THREE.Mesh(detectorGeo, mat.blackPlastic);
    detector.position.set(0, 0.5, 4);
    group.add(detector);

    // Interference Pattern Display
    const screenGeo = new THREE.PlaneGeometry(0.8, 0.8);
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xff0000, side: THREE.DoubleSide });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 0.5, 3.49);
    group.add(screen);

    // Laser beams
    const beamGeo = new THREE.CylinderGeometry(0.02, 0.02, 1, 8);
    const beamMat = tinted(mat.glass, 0xff0000);
    beamMat.emissive = new THREE.Color(0xff0000);

    const addBeam = (x, z, length, rotY) => {
        const b = new THREE.Mesh(beamGeo, beamMat);
        b.scale.set(1, length, 1);
        b.position.set(x, 0.5, z);
        b.rotation.z = Math.PI / 2;
        b.rotation.y = rotY;
        group.add(b);
    };

    addBeam(-2, 0, 4, 0); // Laser to BS
    addBeam(0, -2, 4, Math.PI/2); // BS to Fixed
    addBeam(2, 0, 4, 0); // BS to Movable
    addBeam(0, 2, 4, Math.PI/2); // BS to Detector

    // Animation
    const times = [];
    const stageVals = [];
    const intensityVals = [];

    for (let i = 0; i <= 60; i++) {
        const t = i * 0.05; // 3 seconds
        times.push(t);
        
        // Stage moves slightly
        const move = Math.sin(t * Math.PI * 2 / 3) * 0.5; 
        stageVals.push(4 + move, 0.5, 0);

        // Interference pattern intensity fluctuates based on stage movement
        // Many fringes pass as stage moves
        const fringes = Math.cos(move * 20 * Math.PI) * 0.5 + 0.5;
        intensityVals.push(fringes);
    }

    const tracks = [
        new THREE.VectorKeyframeTrack(`${stageGroup.uuid}.position`, times, stageVals),
        new THREE.NumberKeyframeTrack(`${screen.material.uuid}.emissiveIntensity`, times, intensityVals)
    ];

    const clip = new THREE.AnimationClip('InterferometerScan', 3, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
