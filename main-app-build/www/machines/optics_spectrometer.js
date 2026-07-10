import * as sharedMaterials from '../utils/materials.js';

export function createPrismSpectrometer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const getMat = (name, fallback) => (sharedMaterials[name] || (sharedMaterials.default && sharedMaterials.default[name]) || fallback);

    const metalMat = getMat('metal', new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8, roughness: 0.4 }));
    const glassMat = getMat('glass', new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 1.0, transparent: true, roughness: 0.05 }));
    const whiteLightMat = getMat('laser', new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 }));
    
    // Base platform
    const baseGeom = new THREE.CylinderGeometry(5, 5, 0.5, 32);
    const base = new THREE.Mesh(baseGeom, metalMat);
    group.add(base);

    // Light Source Tube
    const sourceTubeGeom = new THREE.CylinderGeometry(0.3, 0.3, 3);
    const sourceTube = new THREE.Mesh(sourceTubeGeom, metalMat);
    sourceTube.rotation.z = Math.PI / 2;
    sourceTube.position.set(-3.5, 1, 0);
    group.add(sourceTube);

    // Input Beam (White)
    const inBeamGeom = new THREE.CylinderGeometry(0.1, 0.1, 2);
    const inBeam = new THREE.Mesh(inBeamGeom, whiteLightMat);
    inBeam.rotation.z = Math.PI / 2;
    inBeam.position.set(-1, 1, 0);
    group.add(inBeam);

    // Prism Stage (Rotates)
    const stage = new THREE.Group();
    stage.position.set(0, 1, 0);
    stage.name = 'PrismStage';
    group.add(stage);

    const prismGeom = new THREE.CylinderGeometry(1, 1, 2, 3); // Triangle prism
    const prism = new THREE.Mesh(prismGeom, glassMat);
    prism.rotation.y = Math.PI / 2;
    stage.add(prism);

    // Output Beams (Rainbow)
    const colors = [0xff0000, 0xff7f00, 0xffff00, 0x00ff00, 0x0000ff, 0x4b0082, 0x8b00ff];
    const beams = new THREE.Group();
    beams.position.set(0, 1, 0);
    beams.name = 'DispersedBeams';
    group.add(beams);

    colors.forEach((col, i) => {
        const mat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.6 });
        const beamGeom = new THREE.CylinderGeometry(0.05, 0.05, 4);
        const beam = new THREE.Mesh(beamGeom, mat);
        
        // Spread the beams by an angle
        const angle = -Math.PI / 6 + (i * 0.05); // slightly spreading
        beam.rotation.z = Math.PI / 2;
        beam.rotation.y = angle;
        
        // Offset so it starts from prism
        beam.translateY(-2); 
        beams.add(beam);
    });

    // Animation: Rotate the prism and wave the dispersed beams slightly
    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
    const q1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0.2);

    const stageTimes = [0, 2, 4];
    const stageValues = [
        q0.x, q0.y, q0.z, q0.w,
        q1.x, q1.y, q1.z, q1.w,
        q0.x, q0.y, q0.z, q0.w
    ];
    const stageTrack = new THREE.QuaternionKeyframeTrack('PrismStage.quaternion', stageTimes, stageValues);

    const qb1 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0.1);
    const beamsValues = [
        q0.x, q0.y, q0.z, q0.w,
        qb1.x, qb1.y, qb1.z, qb1.w,
        q0.x, q0.y, q0.z, q0.w
    ];
    const beamsTrack = new THREE.QuaternionKeyframeTrack('DispersedBeams.quaternion', stageTimes, beamsValues);

    const clip = new THREE.AnimationClip('Dispersion', 4, [stageTrack, beamsTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}

// Auto-generated missing stub
export function createSpectrometer() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
