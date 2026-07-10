import * as materials from '../utils/materials.js';

export function create3DMetalPrinterChamber(THREE) {
    const group = new THREE.Group();
    group.name = 'MetalPrinterChamber';

    const chamberGeo = new THREE.BoxGeometry(4, 3, 4);
    const chamberMat = new THREE.MeshPhysicalMaterial({
        color: 0x999999, transparent: true, opacity: 0.1, roughness: 0.1, metalness: 0.9, side: THREE.DoubleSide
    });
    const chamber = new THREE.Mesh(chamberGeo, chamberMat);
    chamber.position.y = 1.5;
    group.add(chamber);

    const frameMat = materials.darkMetal || new THREE.MeshStandardMaterial({ color: 0x333333 });
    const rails = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.1, 0.1), frameMat);
    rails.position.set(0, 2.8, 0);
    group.add(rails);

    const plateGeo = new THREE.BoxGeometry(2, 0.2, 2);
    const plate = new THREE.Mesh(plateGeo, frameMat);
    plate.name = 'buildPlate';
    plate.position.y = 0.5;
    group.add(plate);

    const partGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.01, 32);
    const partMat = materials.metal || new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const part = new THREE.Mesh(partGeo, partMat);
    part.name = 'printedPart';
    part.position.y = 0.61;
    group.add(part);

    const laserHeadGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const laserHeadMat = materials.accentColor || new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const laserHead = new THREE.Mesh(laserHeadGeo, laserHeadMat);
    laserHead.name = 'laserHead';
    laserHead.position.set(0, 2.7, 0);
    group.add(laserHead);

    const beamGeo = new THREE.CylinderGeometry(0.01, 0.01, 2.1);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8 });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.name = 'laserBeam';
    beam.position.set(0, 1.65, 0);
    group.add(beam);

    // Animation Tracks
    const times = [0, 0.5, 1, 1.5, 2, 2.5, 3];
    const headPos = [
        -0.5, 2.7, -0.5,
         0.5, 2.7, -0.5,
         0.5, 2.7,  0.5,
        -0.5, 2.7,  0.5,
         0.0, 2.7,  0.0,
        -0.5, 2.7, -0.5,
        -0.5, 2.7, -0.5
    ];
    const beamPos = [
        -0.5, 1.65, -0.5,
         0.5, 1.65, -0.5,
         0.5, 1.65,  0.5,
        -0.5, 1.65,  0.5,
         0.0, 1.65,  0.0,
        -0.5, 1.65, -0.5,
        -0.5, 1.65, -0.5
    ];
    const beamScale = [
        1, 1, 1,  1, 1, 1,  1, 1, 1,  1, 1, 1,  1, 1, 1,  1, 0.01, 1,  1, 0.01, 1
    ];
    
    // Plate drops and part prints up
    const buildTimes = [0, 3];
    const platePos = [0, 0.5, 0,  0, 0.4, 0];
    const partPos = [0, 0.61, 0,  0, 0.56, 0];
    const partScale = [1, 1, 1,  1, 10, 1];

    const headTrack = new THREE.VectorKeyframeTrack('laserHead.position', times, headPos);
    const beamPosTrack = new THREE.VectorKeyframeTrack('laserBeam.position', times, beamPos);
    const beamScaleTrack = new THREE.VectorKeyframeTrack('laserBeam.scale', times, beamScale);
    const plateTrack = new THREE.VectorKeyframeTrack('buildPlate.position', buildTimes, platePos);
    const partPosTrack = new THREE.VectorKeyframeTrack('printedPart.position', buildTimes, partPos);
    const partScaleTrack = new THREE.VectorKeyframeTrack('printedPart.scale', buildTimes, partScale);

    const clip = new THREE.AnimationClip('PrintLayer', 3, [
        headTrack, beamPosTrack, beamScaleTrack, plateTrack, partPosTrack, partScaleTrack
    ]);

    return { group, animationClips: [clip] };
}
