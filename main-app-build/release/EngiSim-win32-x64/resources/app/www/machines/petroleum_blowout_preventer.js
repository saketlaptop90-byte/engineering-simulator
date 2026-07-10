import * as materials from '../utils/materials.js';

export function createBlowoutPreventer(THREE) {
    const group = new THREE.Group();
    group.name = "BlowoutPreventer";

    const matMetal = materials.metalMaterial || materials.metal || new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.9, roughness: 0.2 });
    const matYellow = materials.warningMaterial || materials.warning || new THREE.MeshStandardMaterial({ color: 0xffaa00, metalness: 0.3, roughness: 0.4 });
    const matDark = materials.darkMaterial || materials.dark || new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.5, roughness: 0.7 });
    const matRed = materials.errorMaterial || materials.error || new THREE.MeshStandardMaterial({ color: 0xcc0000, metalness: 0.5, roughness: 0.3 });

    // Main Wellbore Pipe
    const pipeGeo = new THREE.CylinderGeometry(1.2, 1.2, 12, 32);
    const pipe = new THREE.Mesh(pipeGeo, matMetal);
    group.add(pipe);

    // Annular BOP (Top)
    const annularGeo = new THREE.CylinderGeometry(2.5, 2.5, 2.5, 32);
    const annular = new THREE.Mesh(annularGeo, matDark);
    annular.position.y = 4.5;
    group.add(annular);
    
    // Annular detail
    const annularDetail = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.6, 0.5, 32), matRed);
    annularDetail.position.y = 4.5;
    group.add(annularDetail);

    // Pipe Rams (Upper)
    const ramHousingGeo = new THREE.BoxGeometry(8, 1.5, 3);
    const upperRamHousing = new THREE.Mesh(ramHousingGeo, matYellow);
    upperRamHousing.position.y = 1.5;
    group.add(upperRamHousing);

    // Pipe Rams Pistons
    const upperLeftRam = new THREE.Mesh(new THREE.BoxGeometry(2, 1.2, 2.8), matMetal);
    upperLeftRam.name = "upperLeftRam";
    upperLeftRam.position.set(-3.5, 1.5, 0);
    group.add(upperLeftRam);

    const upperRightRam = new THREE.Mesh(new THREE.BoxGeometry(2, 1.2, 2.8), matMetal);
    upperRightRam.name = "upperRightRam";
    upperRightRam.position.set(3.5, 1.5, 0);
    group.add(upperRightRam);

    // Blind Rams (Lower)
    const lowerRamHousing = new THREE.Mesh(ramHousingGeo, matYellow);
    lowerRamHousing.position.y = -1.5;
    group.add(lowerRamHousing);

    const lowerLeftRam = new THREE.Mesh(new THREE.BoxGeometry(2, 1.2, 2.8), matMetal);
    lowerLeftRam.name = "lowerLeftRam";
    lowerLeftRam.position.set(-3.5, -1.5, 0);
    group.add(lowerLeftRam);

    const lowerRightRam = new THREE.Mesh(new THREE.BoxGeometry(2, 1.2, 2.8), matMetal);
    lowerRightRam.name = "lowerRightRam";
    lowerRightRam.position.set(3.5, -1.5, 0);
    group.add(lowerRightRam);

    // Base Flange
    const baseFlange = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 0.5, 32), matDark);
    baseFlange.position.y = -5.75;
    group.add(baseFlange);

    // Animations: Rams closing and opening sequentially
    const times = [0, 1.5, 3, 4.5, 6, 7.5, 9]; 
    const lPosOpen = [-3.5, 1.5, 0];
    const lPosClose = [-1.5, 1.5, 0];
    const rPosOpen = [3.5, 1.5, 0];
    const rPosClose = [1.5, 1.5, 0];

    const lowerLPosOpen = [-3.5, -1.5, 0];
    const lowerLPosClose = [-1.2, -1.5, 0]; // Blind rams meet at center
    const lowerRPosOpen = [3.5, -1.5, 0];
    const lowerRPosClose = [1.2, -1.5, 0];

    const upLeftTrack = new THREE.VectorKeyframeTrack('upperLeftRam.position', times, [
        ...lPosOpen, ...lPosClose, ...lPosClose, ...lPosOpen, ...lPosOpen, ...lPosOpen, ...lPosOpen
    ]);
    const upRightTrack = new THREE.VectorKeyframeTrack('upperRightRam.position', times, [
        ...rPosOpen, ...rPosClose, ...rPosClose, ...rPosOpen, ...rPosOpen, ...rPosOpen, ...rPosOpen
    ]);

    const lowLeftTrack = new THREE.VectorKeyframeTrack('lowerLeftRam.position', times, [
        ...lowerLPosOpen, ...lowerLPosOpen, ...lowerLPosOpen, ...lowerLPosClose, ...lowerLPosClose, ...lowerLPosOpen, ...lowerLPosOpen
    ]);
    const lowRightTrack = new THREE.VectorKeyframeTrack('lowerRightRam.position', times, [
        ...lowerRPosOpen, ...lowerRPosOpen, ...lowerRPosOpen, ...lowerRPosClose, ...lowerRPosClose, ...lowerRPosOpen, ...lowerRPosOpen
    ]);

    const clip = new THREE.AnimationClip('BOP_Actuation', 9, [upLeftTrack, upRightTrack, lowLeftTrack, lowRightTrack]);

    return { group, animationClips: [clip] };
}
