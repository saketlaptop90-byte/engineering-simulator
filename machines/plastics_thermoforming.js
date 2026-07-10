import * as materials from '../utils/materials.js';

export function createThermoformingPlaten(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Frame
    const baseGeom = new THREE.BoxGeometry(4, 0.5, 4);
    const base = new THREE.Mesh(baseGeom, materials.steel);
    group.add(base);

    // Mold (Male)
    const moldGeom = new THREE.BoxGeometry(1.5, 1, 1.5);
    const mold = new THREE.Mesh(moldGeom, materials.aluminum);
    mold.position.y = 0.5;
    mold.name = 'moldPlaten';
    group.add(mold);

    // Plastic Sheet
    const sheetGeom = new THREE.BoxGeometry(3, 0.05, 3);
    const sheet = new THREE.Mesh(sheetGeom, materials.whitePlastic);
    sheet.position.y = 2.0;
    sheet.name = 'plasticSheet';
    group.add(sheet);

    // Heater
    const heaterGeom = new THREE.BoxGeometry(3.2, 0.2, 3.2);
    const heater = new THREE.Mesh(heaterGeom, materials.redAccent);
    heater.position.set(0, 3, -4); // Starts moved back
    heater.name = 'heaterArray';
    group.add(heater);

    // Animations
    const times = [0, 2, 4, 5, 6, 8];
    
    const heaterPos = [
        0, 3, -4, // 0: back
        0, 3, 0,  // 2: over sheet
        0, 3, 0,  // 4: hold
        0, 3, -4, // 5: back
        0, 3, -4, // 6: hold
        0, 3, -4  // 8: hold
    ];
    const heaterTrack = new THREE.VectorKeyframeTrack(`heaterArray.position`, times, heaterPos);

    const sheetPos = [
        0, 2.0, 0,   // 0
        0, 2.0, 0,   // 2
        0, 1.8, 0,   // 4: sags down
        0, 1.8, 0,   // 5
        0, 1.0, 0,   // 6: formed onto mold
        0, 1.0, 0    // 8
    ];
    const sheetTrack = new THREE.VectorKeyframeTrack(`plasticSheet.position`, times, sheetPos);

    const moldPosUp = [
        0, -0.5, 0,  // 0: lowered
        0, -0.5, 0,  // 2: lowered
        0, -0.5, 0,  // 4: lowered
        0, -0.5, 0,  // 5: lowered
        0, 1.5, 0,   // 6: raised into sheet
        0, -0.5, 0   // 8: lowered back down
    ];
    const moldTrack = new THREE.VectorKeyframeTrack(`moldPlaten.position`, times, moldPosUp);

    const sheetScale = [
        1, 1, 1,     // 0
        1, 1, 1,     // 2
        1, 0.5, 1,   // 4 (sag)
        1, 0.5, 1,   // 5
        1.1, 20, 1.1,// 6 (stretch over mold - box thickness becomes sides)
        1, 1, 1      // 8
    ];
    const sheetScaleTrack = new THREE.VectorKeyframeTrack(`plasticSheet.scale`, times, sheetScale);

    const clip = new THREE.AnimationClip('ThermoformCycle', 8, [heaterTrack, sheetTrack, moldTrack, sheetScaleTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
