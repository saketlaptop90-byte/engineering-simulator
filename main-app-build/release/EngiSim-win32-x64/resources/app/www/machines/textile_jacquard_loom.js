import * as materials from '../utils/materials.js';

export function createJacquardLoom(THREE) {
    const group = new THREE.Group();
    const animationClips = [];
    
    const matMetal = materials.metal || new THREE.MeshStandardMaterial({color: 0x777777, roughness: 0.3});
    const matWood = materials.wood || new THREE.MeshStandardMaterial({color: 0x8B5A2B});
    const matYarn = materials.yarn || new THREE.MeshStandardMaterial({color: 0xffffff});

    const frameGeo = new THREE.BoxGeometry(4, 5, 2);
    const leftPillar = new THREE.Mesh(new THREE.BoxGeometry(0.2, 5, 2), matWood);
    leftPillar.position.set(-2, 2.5, 0);
    const rightPillar = new THREE.Mesh(new THREE.BoxGeometry(0.2, 5, 2), matWood);
    rightPillar.position.set(2, 2.5, 0);
    const topBar = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.2, 2), matWood);
    topBar.position.set(0, 5, 0);
    group.add(leftPillar, rightPillar, topBar);

    const headGeo = new THREE.BoxGeometry(2, 1.5, 1.5);
    const head = new THREE.Mesh(headGeo, matWood);
    head.position.set(0, 5.8, 0);
    group.add(head);

    const cardGeo = new THREE.PlaneGeometry(1, 0.5);
    for(let i=0; i<5; i++) {
        const card = new THREE.Mesh(cardGeo, matYarn);
        card.position.set(1.1, 5.5 + i*0.1, 0);
        card.rotation.y = Math.PI/2;
        card.rotation.x = -Math.PI/4;
        group.add(card);
    }

    const beamGeo = new THREE.CylinderGeometry(0.5, 0.5, 3.8, 16);
    const warpBeam = new THREE.Mesh(beamGeo, matWood);
    warpBeam.rotation.z = Math.PI / 2;
    warpBeam.position.set(0, 1, -1);
    group.add(warpBeam);

    const clothBeam = new THREE.Mesh(beamGeo, matWood);
    clothBeam.rotation.z = Math.PI / 2;
    clothBeam.position.set(0, 1, 1);
    group.add(clothBeam);

    const harness1 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.5, 0.1), matMetal);
    harness1.position.set(0, 3, 0);
    const harness2 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.5, 0.1), matMetal);
    harness2.position.set(0, 3, 0.2);
    group.add(harness1, harness2);

    const shuttle = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.1), matWood);
    shuttle.position.set(-1.5, 2, 0.5);
    group.add(shuttle);

    const times = [0, 1, 2];
    const h1Values = [3, 3.5, 3];
    const h2Values = [3.5, 3, 3.5];
    const harness1Track = new THREE.NumberKeyframeTrack(`${harness1.uuid}.position[y]`, times, h1Values);
    const harness2Track = new THREE.NumberKeyframeTrack(`${harness2.uuid}.position[y]`, times, h2Values);
    
    const shuttleTimes = [0, 0.5, 1, 1.5, 2];
    const shuttleValues = [-1.8, 1.8, -1.8, 1.8, -1.8];
    const shuttleTrack = new THREE.NumberKeyframeTrack(`${shuttle.uuid}.position[x]`, shuttleTimes, shuttleValues);

    const clip = new THREE.AnimationClip('LoomOperation', 2, [harness1Track, harness2Track, shuttleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
