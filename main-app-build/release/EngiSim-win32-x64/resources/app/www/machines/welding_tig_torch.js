import * as materials from '../utils/materials.js';

export function createTigWeldingTorch(THREE) {
    const group = new THREE.Group();

    // Handle
    const handleGeo = new THREE.CylinderGeometry(0.15, 0.2, 1.5, 16);
    const handleMesh = new THREE.Mesh(handleGeo, materials.plasticDark || new THREE.MeshStandardMaterial({ color: 0x222222 }));
    handleMesh.position.y = 0.75;
    group.add(handleMesh);

    // Nozzle
    const nozzleGeo = new THREE.CylinderGeometry(0.1, 0.15, 0.4, 16);
    const nozzleMesh = new THREE.Mesh(nozzleGeo, materials.ceramic || new THREE.MeshStandardMaterial({ color: 0xffcccc }));
    nozzleMesh.position.y = -0.2;
    group.add(nozzleMesh);

    // Tungsten Electrode
    const electrodeGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8);
    const electrodeMesh = new THREE.Mesh(electrodeGeo, materials.tungsten || new THREE.MeshStandardMaterial({ color: 0xaaaaaa }));
    electrodeMesh.position.y = -0.4;
    group.add(electrodeMesh);

    // Arc Glow
    const arcGeo = new THREE.ConeGeometry(0.05, 0.2, 8);
    const arcMat = new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.8 });
    const arcMesh = new THREE.Mesh(arcGeo, arcMat);
    arcMesh.position.y = -0.65;
    arcMesh.rotation.x = Math.PI;
    arcMesh.name = 'arc';
    group.add(arcMesh);

    // Animation: Welding Motion and Arc Flicker
    const times = [0, 0.5, 1, 1.5, 2];
    const positions = [
        0, 0, 0,
        0.5, 0, 0,
        0.5, 0, 0.5,
        0, 0, 0.5,
        0, 0, 0
    ];
    const positionTrack = new THREE.VectorKeyframeTrack('.position', times, positions);

    const arcScales = [];
    for(let i=0; i<=20; i++) {
        let s = 0.8 + Math.random() * 0.4;
        arcScales.push(s, s, s);
    }
    const arcTimes = Array.from({length: 21}, (_, i) => i * 0.1);
    const arcFlickerTrack = new THREE.VectorKeyframeTrack(`arc.scale`, arcTimes, arcScales);

    const clip = new THREE.AnimationClip('TigWelding', 2, [positionTrack, arcFlickerTrack]);

    return { group, animationClips: [clip] };
}
