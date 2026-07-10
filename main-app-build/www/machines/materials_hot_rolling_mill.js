import * as materials from '../utils/materials.js';

export function createHotRollingMill(THREE) {
    const group = new THREE.Group();
    group.name = 'HotRollingMill';

    const steelMat = materials.steel || new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.2 });
    const darkMat = materials.darkMetal || new THREE.MeshStandardMaterial({ color: 0x2a2a2a });

    // Frames
    const frameL = new THREE.Mesh(new THREE.BoxGeometry(1, 4, 1), darkMat);
    frameL.position.set(0, 2, -1.5);
    group.add(frameL);
    
    const frameR = new THREE.Mesh(new THREE.BoxGeometry(1, 4, 1), darkMat);
    frameR.position.set(0, 2, 1.5);
    group.add(frameR);

    // Rollers
    const rollerGeo = new THREE.CylinderGeometry(0.6, 0.6, 2.5, 32);
    
    const topRoller = new THREE.Mesh(rollerGeo, steelMat);
    topRoller.name = 'topRoller';
    topRoller.rotation.x = Math.PI / 2;
    topRoller.position.y = 2.65;
    group.add(topRoller);

    const bottomRoller = new THREE.Mesh(rollerGeo, steelMat);
    bottomRoller.name = 'bottomRoller';
    bottomRoller.rotation.x = Math.PI / 2;
    bottomRoller.position.y = 1.35;
    group.add(bottomRoller);

    // Glowing metal sheet entering
    const sheetGeo = new THREE.BoxGeometry(3, 0.4, 1.2);
    const sheetMat = materials.glowingMetal || new THREE.MeshStandardMaterial({ color: 0xff3300, emissive: 0xcc2200 });
    const sheet = new THREE.Mesh(sheetGeo, sheetMat);
    sheet.name = 'metalSheet';
    sheet.position.set(-3, 2, 0);
    group.add(sheet);
    
    // Thin flattened sheet exiting
    const thinSheetGeo = new THREE.BoxGeometry(3, 0.1, 1.2);
    const thinSheet = new THREE.Mesh(thinSheetGeo, sheetMat);
    thinSheet.name = 'thinSheet';
    thinSheet.position.set(3, 2, 0);
    thinSheet.scale.set(0.01, 1, 1);
    group.add(thinSheet);

    // Animation Tracks
    const times = [0, 2, 4];
    const sheetPos = [-3, 2, 0,  -0.5, 2, 0,  -0.5, 2, 0];
    const sheetScale = [1, 1, 1,  0.01, 1, 1,  0.01, 1, 1];
    
    const thinPos = [0.5, 2, 0,  0.5, 2, 0,  3, 2, 0];
    const thinScale = [0.01, 1, 1,  0.01, 1, 1,  1, 1, 1];

    const topRollerTrack = new THREE.NumberKeyframeTrack('topRoller.rotation[y]', times, [0, -Math.PI * 2, -Math.PI * 4]);
    const bottomRollerTrack = new THREE.NumberKeyframeTrack('bottomRoller.rotation[y]', times, [0, Math.PI * 2, Math.PI * 4]);
    
    const thickPosTrack = new THREE.VectorKeyframeTrack('metalSheet.position', times, sheetPos);
    const thickScaleTrack = new THREE.VectorKeyframeTrack('metalSheet.scale', times, sheetScale);
    
    const thinPosTrack = new THREE.VectorKeyframeTrack('thinSheet.position', times, thinPos);
    const thinScaleTrack = new THREE.VectorKeyframeTrack('thinSheet.scale', times, thinScale);

    const clip = new THREE.AnimationClip('RollProcess', 4, [
        topRollerTrack, bottomRollerTrack,
        thickPosTrack, thickScaleTrack,
        thinPosTrack, thinScaleTrack
    ]);

    return { group, animationClips: [clip] };
}
