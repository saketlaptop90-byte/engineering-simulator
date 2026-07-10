import * as materials from '../utils/materials.js';

export function createSpectrometerGrating(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const baseGeo = new THREE.BoxGeometry(6, 0.5, 6);
    const base = new THREE.Mesh(baseGeo, materials.baseMaterial || new THREE.MeshStandardMaterial({color: 0x333333}));
    base.position.y = -0.25;
    group.add(base);

    const mountGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    const mount = new THREE.Mesh(mountGeo, materials.metalMaterial || new THREE.MeshStandardMaterial({color: 0x666666}));
    mount.position.y = 0.5;
    group.add(mount);

    const gratingGeo = new THREE.BoxGeometry(2, 2, 0.1);
    const grating = new THREE.Mesh(gratingGeo, materials.glassMaterial || new THREE.MeshStandardMaterial({color: 0xaaccff, transparent: true, opacity: 0.8, metalness: 0.5}));
    grating.position.y = 1.5;
    grating.name = "Grating";
    group.add(grating);

    const whiteBeamGeo = new THREE.CylinderGeometry(0.1, 0.1, 4);
    const whiteBeam = new THREE.Mesh(whiteBeamGeo, materials.laserMaterial || new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: 0.8}));
    whiteBeam.rotation.z = Math.PI / 2;
    whiteBeam.position.set(-2, 1.5, 0);
    group.add(whiteBeam);

    const diffractedBeams = new THREE.Group();
    diffractedBeams.name = 'DiffractedBeams';
    diffractedBeams.position.set(0, 1.5, 0);
    group.add(diffractedBeams);

    const colors = [0xff0000, 0x00ff00, 0x0000ff];
    const angles = [Math.PI/6, Math.PI/4, Math.PI/3];
    
    for(let i=0; i<3; i++) {
        const dBeamGeo = new THREE.CylinderGeometry(0.05, 0.05, 4);
        dBeamGeo.translate(0, 2, 0);
        const dBeam = new THREE.Mesh(dBeamGeo, new THREE.MeshBasicMaterial({color: colors[i], transparent: true, opacity: 0.8}));
        dBeam.rotation.z = -angles[i];
        diffractedBeams.add(dBeam);
    }

    const rotationTrack = new THREE.NumberKeyframeTrack(
        'Grating.rotation[y]',
        [0, 2, 4],
        [-0.2, 0.2, -0.2]
    );

    const beamRotationTrack = new THREE.NumberKeyframeTrack(
        'DiffractedBeams.rotation[y]',
        [0, 2, 4],
        [-0.4, 0.4, -0.4]
    );

    const clip = new THREE.AnimationClip('DiffractionScan', 4, [rotationTrack, beamRotationTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
