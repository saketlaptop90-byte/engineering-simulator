import * as materials from '../utils/materials.js';

export function createHotRollingMillStand(THREE) {
    const group = new THREE.Group();
    group.name = 'HotRollingMill';
    const animationClips = [];

    // Frame
    const frameGeo = new THREE.BoxGeometry(4, 6, 2);
    const frameMat = materials.heavySteel || new THREE.MeshStandardMaterial({color: 0x4a4a4a, roughness: 0.6, metalness: 0.7});
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.y = 3;
    group.add(frame);

    // Opening in frame
    frame.visible = false; 

    const colGeo = new THREE.BoxGeometry(1, 6, 2);
    const colLeft = new THREE.Mesh(colGeo, frameMat);
    colLeft.position.set(-1.5, 3, 0);
    group.add(colLeft);

    const colRight = new THREE.Mesh(colGeo, frameMat);
    colRight.position.set(1.5, 3, 0);
    group.add(colRight);

    const topBeamGeo = new THREE.BoxGeometry(4, 1, 2);
    const topBeam = new THREE.Mesh(topBeamGeo, frameMat);
    topBeam.position.set(0, 5.5, 0);
    group.add(topBeam);

    // Rollers
    const rollerGeo = new THREE.CylinderGeometry(0.8, 0.8, 2, 32);
    rollerGeo.rotateZ(Math.PI / 2);
    const rollerMat = materials.shinySteel || new THREE.MeshStandardMaterial({color: 0xcccccc, roughness: 0.2, metalness: 0.9});

    const rollerTop = new THREE.Mesh(rollerGeo, rollerMat);
    rollerTop.position.set(0, 3.5, 0);
    rollerTop.name = 'RollerTop';
    group.add(rollerTop);

    const rollerBottom = new THREE.Mesh(rollerGeo, rollerMat);
    rollerBottom.position.set(0, 1.5, 0);
    rollerBottom.name = 'RollerBottom';
    group.add(rollerBottom);

    // Hot Metal Sheet moving through
    const sheetGeo = new THREE.BoxGeometry(4, 0.2, 1.8);
    const sheetMat = materials.hotSteel || new THREE.MeshStandardMaterial({color: 0xff3300, emissive: 0xcc2200, emissiveIntensity: 0.8});
    const sheet = new THREE.Mesh(sheetGeo, sheetMat);
    sheet.position.set(0, 2.5, 0);
    sheet.name = 'MetalSheet';
    group.add(sheet);

    // Animations
    const duration = 2;
    
    // Rollers rotating continuously
    const rollerTimes = [0, 1, 2];
    const topRot = new THREE.NumberKeyframeTrack('RollerTop.rotation[x]', rollerTimes, [0, Math.PI, Math.PI * 2]);
    const bottomRot = new THREE.NumberKeyframeTrack('RollerBottom.rotation[x]', rollerTimes, [0, -Math.PI, -Math.PI * 2]);
    
    // Sheet moving forward
    const sheetPos = new THREE.NumberKeyframeTrack('MetalSheet.position[x]', rollerTimes, [-3, 0, 3]);
    // Sheet expanding
    const sheetScaleTimes = [0, 1, 2];
    const sheetScales = [0.5, 1, 1,  1, 1, 1,  1.5, 1, 1]; // Stretch in X
    const sheetScale = new THREE.VectorKeyframeTrack('MetalSheet.scale', sheetScaleTimes, sheetScales);

    const clip = new THREE.AnimationClip('RollCycle', duration, [topRot, bottomRot, sheetPos, sheetScale]);
    animationClips.push(clip);

    return { group, animationClips };
}
