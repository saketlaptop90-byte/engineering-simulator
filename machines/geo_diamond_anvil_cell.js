import { titanium, darkSteel, gold, glass } from '../utils/materials.js';

export function createHighPressureDiamondAnvilCell(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Frame
    const pillarGeo = new THREE.CylinderGeometry(0.2, 0.2, 6, 8);
    const pillar1 = new THREE.Mesh(pillarGeo, darkSteel);
    pillar1.position.set(1.5, 3, 0);
    const pillar2 = new THREE.Mesh(pillarGeo, darkSteel);
    pillar2.position.set(-1.5, 3, 0);
    group.add(pillar1, pillar2);

    const baseBox = new THREE.Mesh(new THREE.BoxGeometry(4, 0.5, 4), titanium);
    baseBox.position.y = 0.25;
    group.add(baseBox);

    const topBox = new THREE.Mesh(new THREE.BoxGeometry(4, 0.5, 4), titanium);
    topBox.position.y = 5.75;
    group.add(topBox);

    // Anvils
    const bottomAnvil = new THREE.Group();
    bottomAnvil.name = "bottomAnvil";
    const anvilGeo = new THREE.ConeGeometry(1, 1.5, 4);
    const bAnvilMesh = new THREE.Mesh(anvilGeo, glass);
    bAnvilMesh.position.y = 0.75;
    bAnvilMesh.rotation.y = Math.PI / 4;
    bottomAnvil.add(bAnvilMesh);
    bottomAnvil.position.y = 0.5;
    group.add(bottomAnvil);

    const topAnvil = new THREE.Group();
    topAnvil.name = "topAnvil";
    const tAnvilMesh = new THREE.Mesh(anvilGeo, glass);
    tAnvilMesh.rotation.x = Math.PI;
    tAnvilMesh.rotation.y = Math.PI / 4; 
    tAnvilMesh.position.y = -0.75;
    topAnvil.add(tAnvilMesh);
    topAnvil.position.y = 5.5;
    group.add(topAnvil);

    // Sample
    const sampleGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const sample = new THREE.Mesh(sampleGeo, gold);
    sample.name = "sample";
    sample.position.y = 3;
    group.add(sample);

    // Animation: Crushing
    const times = [0, 1.5, 3];
    const topTrack = new THREE.VectorKeyframeTrack('topAnvil.position', times, [0,5.5,0, 0,3.5,0, 0,5.5,0]);
    const bottomTrack = new THREE.VectorKeyframeTrack('bottomAnvil.position', times, [0,0.5,0, 0,2.5,0, 0,0.5,0]);
    
    const sampleScaleTimes = [0, 1.5, 3];
    const sampleScaleValues = [1,1,1,  1.8,0.2,1.8,  1,1,1];
    const sampleScaleTrack = new THREE.VectorKeyframeTrack('sample.scale', sampleScaleTimes, sampleScaleValues);

    const clip = new THREE.AnimationClip('Crush', 3, [topTrack, bottomTrack, sampleScaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
