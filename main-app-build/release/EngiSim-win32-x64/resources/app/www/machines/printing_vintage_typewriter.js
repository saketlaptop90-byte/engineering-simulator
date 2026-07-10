import { steel, aluminum, blackPlastic, rubber } from '../utils/materials.js';

export function createVintageTypewriter(THREE) {
    const group = new THREE.Group();
    group.name = "VintageTypewriter";
    const animationClips = [];

    // Base body
    const bodyGeo = new THREE.BoxGeometry(4, 1, 3);
    const body = new THREE.Mesh(bodyGeo, blackPlastic);
    body.position.y = 0.5;
    group.add(body);

    // Keyboard area
    const keysGroup = new THREE.Group();
    keysGroup.position.set(0, 1, 0.5);
    group.add(keysGroup);

    const keyGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.2);
    
    const activeKey1 = new THREE.Mesh(keyGeo, aluminum);
    activeKey1.name = "key1";
    activeKey1.position.set(-0.5, 0, 0);
    keysGroup.add(activeKey1);

    const activeKey2 = new THREE.Mesh(keyGeo, aluminum);
    activeKey2.name = "key2";
    activeKey2.position.set(0.5, 0, 0);
    keysGroup.add(activeKey2);

    // Carriage
    const carriageGroup = new THREE.Group();
    carriageGroup.name = "carriageGroup";
    carriageGroup.position.set(0, 1.5, -1);
    group.add(carriageGroup);

    const platenGeo = new THREE.CylinderGeometry(0.3, 0.3, 3.5, 32);
    const platen = new THREE.Mesh(platenGeo, rubber);
    platen.rotation.z = Math.PI / 2;
    carriageGroup.add(platen);

    // Paper
    const paperGroup = new THREE.Group();
    paperGroup.name = "paperGroup";
    carriageGroup.add(paperGroup);

    const paperGeo = new THREE.PlaneGeometry(2.5, 3);
    const paperMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const paper = new THREE.Mesh(paperGeo, paperMat);
    paper.rotation.x = -Math.PI / 6;
    paper.position.set(0, 1.2, 0.5);
    paperGroup.add(paper);

    // Typebars
    const typebarPivot1 = new THREE.Group();
    typebarPivot1.name = "typebarPivot1";
    typebarPivot1.position.set(-0.5, 1, -0.2);
    group.add(typebarPivot1);

    const typebar1 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1, 0.05), steel);
    typebar1.position.set(0, 0.5, 0);
    typebarPivot1.add(typebar1);

    const typebarPivot2 = new THREE.Group();
    typebarPivot2.name = "typebarPivot2";
    typebarPivot2.position.set(0.5, 1, -0.2);
    group.add(typebarPivot2);

    const typebar2 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1, 0.05), steel);
    typebar2.position.set(0, 0.5, 0);
    typebarPivot2.add(typebar2);

    // Animations
    const duration = 2;
    
    const key1Times = [0, 0.1, 0.2];
    const key1Pos = [-0.5, 0, 0, -0.5, -0.2, 0, -0.5, 0, 0];
    const k1Track = new THREE.VectorKeyframeTrack('key1.position', key1Times, key1Pos);

    const key2Times = [0.5, 0.6, 0.7];
    const key2Pos = [0.5, 0, 0, 0.5, -0.2, 0, 0.5, 0, 0];
    const k2Track = new THREE.VectorKeyframeTrack('key2.position', key2Times, key2Pos);

    const q0 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
    const qStrike = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 3);
    
    const tb1Track = new THREE.QuaternionKeyframeTrack('typebarPivot1.quaternion', key1Times, [
        q0.x, q0.y, q0.z, q0.w,
        qStrike.x, qStrike.y, qStrike.z, qStrike.w,
        q0.x, q0.y, q0.z, q0.w
    ]);

    const tb2Track = new THREE.QuaternionKeyframeTrack('typebarPivot2.quaternion', key2Times, [
        q0.x, q0.y, q0.z, q0.w,
        qStrike.x, qStrike.y, qStrike.z, qStrike.w,
        q0.x, q0.y, q0.z, q0.w
    ]);

    const carriageTimes = [0, 0.2, 0.7];
    const carriagePos = [0, 1.5, -1, -0.2, 1.5, -1, -0.4, 1.5, -1];
    const carTrack = new THREE.VectorKeyframeTrack('carriageGroup.position', carriageTimes, carriagePos);

    const paperTimes = [0, 2];
    const paperPosTrack = [0, 1.2, 0.5, 0, 1.5, 0.5];
    const papTrack = new THREE.VectorKeyframeTrack('paperGroup.position', paperTimes, paperPosTrack);

    const clip = new THREE.AnimationClip('Type', duration, [k1Track, k2Track, tb1Track, tb2Track, carTrack, papTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
