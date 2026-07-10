import * as materials from '../utils/materials.js';

export function createLaserInterferometer(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    const baseGeo = new THREE.BoxGeometry(10, 0.5, 5);
    const base = new THREE.Mesh(baseGeo, materials.baseMaterial || new THREE.MeshStandardMaterial({color: 0x333333}));
    base.position.y = -0.25;
    group.add(base);

    const sourceGeo = new THREE.BoxGeometry(2, 1, 1);
    const source = new THREE.Mesh(sourceGeo, materials.metalMaterial || new THREE.MeshStandardMaterial({color: 0x888888}));
    source.position.set(-4, 0.5, 0);
    group.add(source);

    const splitterGeo = new THREE.BoxGeometry(0.1, 1.5, 1.5);
    const splitter = new THREE.Mesh(splitterGeo, materials.glassMaterial || new THREE.MeshStandardMaterial({color: 0x88ccff, transparent: true, opacity: 0.5}));
    splitter.rotation.y = Math.PI / 4;
    splitter.position.set(0, 0.5, 0);
    group.add(splitter);

    const mirrorGeo = new THREE.BoxGeometry(0.2, 1.5, 1.5);
    const mirror1 = new THREE.Mesh(mirrorGeo, materials.mirrorMaterial || new THREE.MeshStandardMaterial({color: 0xeeeeee, metalness: 1, roughness: 0}));
    mirror1.position.set(0, 0.5, -2);
    mirror1.name = 'Mirror1';
    group.add(mirror1);

    const mirror2 = new THREE.Mesh(mirrorGeo, materials.mirrorMaterial || new THREE.MeshStandardMaterial({color: 0xeeeeee, metalness: 1, roughness: 0}));
    mirror2.position.set(4, 0.5, 0);
    mirror2.rotation.y = Math.PI / 2;
    group.add(mirror2);

    const detectorGeo = new THREE.BoxGeometry(1, 1, 1);
    const detector = new THREE.Mesh(detectorGeo, materials.darkMaterial || new THREE.MeshStandardMaterial({color: 0x111111}));
    detector.position.set(0, 0.5, 2);
    group.add(detector);

    const laserMat = materials.laserMaterial || new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.8});
    
    const beam1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 4), laserMat);
    beam1.rotation.z = Math.PI / 2;
    beam1.position.set(-2, 0.5, 0);
    group.add(beam1);

    const beam2 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2), laserMat);
    beam2.rotation.x = Math.PI / 2;
    beam2.position.set(0, 0.5, -1);
    group.add(beam2);

    const beam3 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 4), laserMat);
    beam3.rotation.z = Math.PI / 2;
    beam3.position.set(2, 0.5, 0);
    group.add(beam3);

    const beam4 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2), laserMat.clone());
    beam4.rotation.x = Math.PI / 2;
    beam4.position.set(0, 0.5, 1);
    beam4.name = 'OutputBeam';
    group.add(beam4);

    const mirrorTrack = new THREE.VectorKeyframeTrack(
        'Mirror1.position',
        [0, 1, 2],
        [0, 0.5, -2,  0, 0.5, -1.9,  0, 0.5, -2]
    );

    const opacityTrack = new THREE.NumberKeyframeTrack(
        'OutputBeam.material.opacity',
        [0, 0.5, 1, 1.5, 2],
        [0.8, 0.1, 0.8, 0.1, 0.8]
    );

    const clip = new THREE.AnimationClip('InterferenceOperation', 2, [mirrorTrack, opacityTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
