import { materials } from '../utils/materials.js';

export function createHighSpeedRailPantograph(THREE) {
    const group = new THREE.Group();
    group.name = 'Pantograph';
    const animationClips = [];

    const metalMat = materials.metal || new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.3 });
    const darkMetalMat = materials.darkMetal || new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.7, roughness: 0.5 });
    const insulatorMat = materials.ceramic || new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });

    const baseGeo = new THREE.BoxGeometry(4, 0.5, 6);
    const base = new THREE.Mesh(baseGeo, darkMetalMat);
    base.position.y = 0.25;
    group.add(base);

    const insulatorGeo = new THREE.CylinderGeometry(0.3, 0.4, 1.5, 16);
    const insulators = [
        [-1.5, 1, -2], [1.5, 1, -2],
        [-1.5, 1, 2], [1.5, 1, 2]
    ];
    insulators.forEach(pos => {
        const insulator = new THREE.Mesh(insulatorGeo, insulatorMat);
        insulator.position.set(...pos);
        group.add(insulator);
    });

    const subBaseGeo = new THREE.BoxGeometry(3.5, 0.3, 5);
    const subBase = new THREE.Mesh(subBaseGeo, metalMat);
    subBase.position.y = 1.9;
    group.add(subBase);

    const lowerArmPivot = new THREE.Group();
    lowerArmPivot.position.set(0, 2.05, -2);
    lowerArmPivot.name = 'LowerArmPivot';
    group.add(lowerArmPivot);

    const lowerArmGeo = new THREE.CylinderGeometry(0.2, 0.2, 5);
    lowerArmGeo.translate(0, 2.5, 0);
    const lowerArm = new THREE.Mesh(lowerArmGeo, metalMat);
    lowerArmPivot.add(lowerArm);

    const upperArmPivot = new THREE.Group();
    upperArmPivot.position.set(0, 5, 0);
    upperArmPivot.name = 'UpperArmPivot';
    lowerArmPivot.add(upperArmPivot);

    const upperArmGeo = new THREE.CylinderGeometry(0.15, 0.15, 4);
    upperArmGeo.translate(0, 2, 0);
    const upperArm = new THREE.Mesh(upperArmGeo, metalMat);
    upperArmPivot.add(upperArm);

    const collectorPivot = new THREE.Group();
    collectorPivot.position.set(0, 4, 0);
    collectorPivot.name = 'CollectorPivot';
    upperArmPivot.add(collectorPivot);

    const collectorGeo = new THREE.BoxGeometry(4, 0.2, 0.5);
    const collector = new THREE.Mesh(collectorGeo, darkMetalMat);
    collectorPivot.add(collector);
    
    const stripGeo = new THREE.BoxGeometry(3.8, 0.1, 0.2);
    const stripMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9, roughness: 0.8 });
    const strip = new THREE.Mesh(stripGeo, stripMat);
    strip.position.y = 0.15;
    collector.add(strip);

    lowerArmPivot.rotation.x = Math.PI / 4;
    upperArmPivot.rotation.x = -Math.PI / 2;
    collectorPivot.rotation.x = Math.PI / 4;

    const lowerArmTrack = new THREE.NumberKeyframeTrack('LowerArmPivot.rotation[x]', [0, 2, 4, 6], [Math.PI / 2.5, Math.PI / 6, Math.PI / 6, Math.PI / 2.5]);
    const upperArmTrack = new THREE.NumberKeyframeTrack('UpperArmPivot.rotation[x]', [0, 2, 4, 6], [-Math.PI / 1.2, -Math.PI / 3, -Math.PI / 3, -Math.PI / 1.2]);
    const collectorTrack = new THREE.NumberKeyframeTrack('CollectorPivot.rotation[x]', [0, 2, 4, 6], [Math.PI / 2.3, Math.PI / 6, Math.PI / 6, Math.PI / 2.3]);

    const clip = new THREE.AnimationClip('PantographOperation', 6, [lowerArmTrack, upperArmTrack, collectorTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
