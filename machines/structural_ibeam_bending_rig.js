import * as materials from '../utils/materials.js';

export function createIBeamBendingRig(THREE) {
    const group = new THREE.Group();
    group.name = "IBeamBendingRig";

    // Fallback materials if not provided by utils
    const steelMat = materials.steel || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.4 });
    const baseMat = materials.base || new THREE.MeshStandardMaterial({ color: 0x333333 });
    const hydraulicMat = materials.highlight || new THREE.MeshStandardMaterial({ color: 0xdd2222, metalness: 0.5, roughness: 0.3 });

    // Rig Base
    const rigBase = new THREE.Mesh(new THREE.BoxGeometry(6, 0.4, 2), baseMat);
    rigBase.position.y = 0.2;
    group.add(rigBase);

    // Columns
    const colGeo = new THREE.CylinderGeometry(0.15, 0.15, 4, 16);
    const colL = new THREE.Mesh(colGeo, steelMat);
    colL.position.set(-2.5, 2.4, 0);
    const colR = new THREE.Mesh(colGeo, steelMat);
    colR.position.set(2.5, 2.4, 0);
    group.add(colL, colR);

    // Top Beam
    const topBeam = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.4, 1), steelMat);
    topBeam.position.y = 4.6;
    group.add(topBeam);

    // Supports for I-Beam
    const supportGeo = new THREE.CylinderGeometry(0.1, 0.3, 0.8, 16);
    const supL = new THREE.Mesh(supportGeo, steelMat);
    supL.position.set(-1.5, 0.8, 0);
    const supR = new THREE.Mesh(supportGeo, steelMat);
    supR.position.set(1.5, 0.8, 0);
    group.add(supL, supR);

    // I-Beam Construction
    const beamGroup = new THREE.Group();
    beamGroup.position.set(0, 1.3, 0); // Resting on supports
    
    const flangeGeo = new THREE.BoxGeometry(4.5, 0.1, 0.6);
    const topFlange = new THREE.Mesh(flangeGeo, steelMat);
    topFlange.position.y = 0.35;
    const bottomFlange = new THREE.Mesh(flangeGeo, steelMat);
    bottomFlange.position.y = -0.35;
    
    const webGeo = new THREE.BoxGeometry(4.5, 0.6, 0.1);
    const web = new THREE.Mesh(webGeo, steelMat);
    
    beamGroup.add(topFlange, bottomFlange, web);
    group.add(beamGroup);

    // Hydraulic Press
    const pressGroup = new THREE.Group();
    pressGroup.position.set(0, 4.4, 0);
    const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.5, 16), hydraulicMat);
    cylinder.position.y = -0.75;
    const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1.5, 16), steelMat);
    piston.position.y = -1.5;
    const pressHead = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 0.6), hydraulicMat);
    pressHead.position.y = -2.35;
    pressGroup.add(cylinder, piston, pressHead);
    group.add(pressGroup);

    // Animations
    const pressTimes = [0, 2, 4, 6];
    const pressValues = [
        0, 4.4, 0,
        0, 3.4, 0, // Press down
        0, 3.4, 0, // Hold
        0, 4.4, 0  // Retract
    ];
    const pressTrack = new THREE.VectorKeyframeTrack(pressGroup.uuid + '.position', pressTimes, pressValues);

    const beamTimes = [0, 2, 4, 6];
    const beamValues = [
        0, 1.3, 0,
        0, 1.2, 0, // Beam drops slightly
        0, 1.2, 0,
        0, 1.3, 0  // Recovers
    ];
    const beamTrack = new THREE.VectorKeyframeTrack(beamGroup.uuid + '.position', beamTimes, beamValues);
    
    const beamScaleValues = [
        1, 1, 1,
        0.98, 0.9, 1, // Compress and bend
        0.98, 0.9, 1,
        1, 1, 1
    ];
    const beamScaleTrack = new THREE.VectorKeyframeTrack(beamGroup.uuid + '.scale', pressTimes, beamScaleValues);

    const clip = new THREE.AnimationClip('BendTest', 6, [pressTrack, beamTrack, beamScaleTrack]);

    return { group, animationClips: [clip] };
}
