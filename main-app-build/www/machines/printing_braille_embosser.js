import { steel, aluminum, blackPlastic, rubber } from '../utils/materials.js';

export function createBrailleEmbosser(THREE) {
    const group = new THREE.Group();
    group.name = "BrailleEmbosser";
    const animationClips = [];

    // Casing
    const casingGeo = new THREE.BoxGeometry(5, 2, 4);
    const casing = new THREE.Mesh(casingGeo, aluminum);
    casing.position.y = 1;
    group.add(casing);

    // Paper insertion slot
    const slotGeo = new THREE.BoxGeometry(3.2, 0.1, 4.2);
    const slotMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
    const slot = new THREE.Mesh(slotGeo, slotMat);
    slot.position.y = 1.5;
    group.add(slot);

    // Paper
    const paperGroup = new THREE.Group();
    paperGroup.name = "paperGroup";
    paperGroup.position.set(0, 1.5, 2);
    group.add(paperGroup);

    const paperGeo = new THREE.PlaneGeometry(3, 4);
    const paperMat = new THREE.MeshLambertMaterial({ color: 0xddddcc, side: THREE.DoubleSide });
    const paper = new THREE.Mesh(paperGeo, paperMat);
    paper.rotation.x = -Math.PI / 2;
    paperGroup.add(paper);

    // Embossing Head
    const headGroup = new THREE.Group();
    headGroup.name = "headGroup";
    headGroup.position.set(-1.5, 1.7, 0);
    group.add(headGroup);

    const headBoxGeo = new THREE.BoxGeometry(0.6, 0.4, 0.6);
    const headBox = new THREE.Mesh(headBoxGeo, blackPlastic);
    headGroup.add(headBox);

    // Pins
    const pinGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.3);
    const pins = [];
    for(let i=0; i<3; i++) {
        const pin = new THREE.Mesh(pinGeo, steel);
        pin.name = `pin${i}`;
        pin.position.set((i-1)*0.1, -0.15, 0);
        headGroup.add(pin);
        pins.push(pin);
    }

    // Animations
    const duration = 2;

    const headTimes = [0, 0.5, 1, 1.5, 2];
    const headPos = [
        -1.5, 1.7, 0,
        -0.5, 1.7, 0,
        0.5, 1.7, 0,
        1.5, 1.7, 0,
        -1.5, 1.7, 0
    ];
    const headTrack = new THREE.VectorKeyframeTrack('headGroup.position', headTimes, headPos);

    const paperTimes = [0, 2];
    const paperPosVec = [0, 1.5, 2, 0, 1.5, -2];
    const paperTrack = new THREE.VectorKeyframeTrack('paperGroup.position', paperTimes, paperPosVec);

    const pinTimes = [];
    const pin1Pos = [];
    const pin2Pos = [];
    const pin3Pos = [];
    for(let i=0; i<=20; i++) {
        const t = i * 0.1;
        pinTimes.push(t);
        const p1y = (i%2 === 0) ? -0.25 : -0.15;
        const p2y = (i%3 === 0) ? -0.25 : -0.15;
        const p3y = (i%4 === 0) ? -0.25 : -0.15;

        pin1Pos.push(-0.1, p1y, 0);
        pin2Pos.push(0, p2y, 0);
        pin3Pos.push(0.1, p3y, 0);
    }
    const p1Track = new THREE.VectorKeyframeTrack('pin0.position', pinTimes, pin1Pos);
    const p2Track = new THREE.VectorKeyframeTrack('pin1.position', pinTimes, pin2Pos);
    const p3Track = new THREE.VectorKeyframeTrack('pin2.position', pinTimes, pin3Pos);

    const clip = new THREE.AnimationClip('Emboss', duration, [headTrack, paperTrack, p1Track, p2Track, p3Track]);
    animationClips.push(clip);

    return { group, animationClips };
}
