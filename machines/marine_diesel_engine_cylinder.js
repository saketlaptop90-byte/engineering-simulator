import * as importedMaterials from '../utils/materials.js';
const materials = importedMaterials.default || importedMaterials;

export function createMarineDieselEngineCylinder(THREE) {
    const group = new THREE.Group();
    group.name = 'MarineDieselEngineCylinder';
    
    const fallbackMetal = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.3 });
    const fallbackSteel = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.2 });
    const fallbackGlass = new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 0.6, opacity: 1, transparent: true, roughness: 0.1 });
    const fallbackDark = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.5, roughness: 0.8 });
    
    const metalMat = materials?.metal || fallbackMetal;
    const steelMat = materials?.steel || fallbackSteel;
    const glassMat = materials?.glass || fallbackGlass;
    const darkMat = materials?.darkMetal || fallbackDark;

    const blockGeo = new THREE.CylinderGeometry(1.2, 1.2, 4, 32);
    const block = new THREE.Mesh(blockGeo, glassMat);
    group.add(block);

    const caseGeo = new THREE.BoxGeometry(3, 2, 3);
    const crankcase = new THREE.Mesh(caseGeo, darkMat);
    crankcase.position.y = -3;
    group.add(crankcase);

    const crankshaft = new THREE.Group();
    crankshaft.name = 'crankshaft';
    crankshaft.position.y = -3;
    group.add(crankshaft);

    const shaftGeo = new THREE.CylinderGeometry(0.3, 0.3, 3.5, 32);
    const mainShaft = new THREE.Mesh(shaftGeo, metalMat);
    mainShaft.rotation.z = Math.PI / 2;
    crankshaft.add(mainShaft);

    const crankWebGeo = new THREE.BoxGeometry(0.4, 1.2, 0.6);
    const crankWeb1 = new THREE.Mesh(crankWebGeo, steelMat);
    crankWeb1.position.set(-0.5, 0.5, 0);
    crankshaft.add(crankWeb1);

    const crankWeb2 = new THREE.Mesh(crankWebGeo, steelMat);
    crankWeb2.position.set(0.5, 0.5, 0);
    crankshaft.add(crankWeb2);

    const crankPinGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.4, 32);
    const crankPin = new THREE.Mesh(crankPinGeo, steelMat);
    crankPin.rotation.z = Math.PI / 2;
    crankPin.position.y = 1;
    crankshaft.add(crankPin);

    const conRod = new THREE.Group();
    conRod.name = 'conRod';
    group.add(conRod);

    const rodGeo = new THREE.BoxGeometry(0.3, 2.5, 0.4);
    const rod = new THREE.Mesh(rodGeo, metalMat);
    rod.position.y = 1.25;
    conRod.add(rod);

    const piston = new THREE.Group();
    piston.name = 'piston';
    group.add(piston);

    const pistonGeo = new THREE.CylinderGeometry(1.18, 1.18, 1, 32);
    const pistonMesh = new THREE.Mesh(pistonGeo, steelMat);
    piston.add(pistonMesh);

    const frames = 60;
    const duration = 2;
    const crankY = -3;
    const crankR = 1;
    const rodL = 2.5;

    const crankRotTimes = [];
    const crankRotValues = [];
    const pistonPosTimes = [];
    const pistonPosValues = [];
    const conRodPosTimes = [];
    const conRodPosValues = [];
    const conRodRotTimes = [];
    const conRodRotValues = [];

    for (let i = 0; i <= frames; i++) {
        const t = (i / frames) * duration;
        const angle = (i / frames) * Math.PI * 2;

        crankRotTimes.push(t);
        crankRotValues.push(angle);

        const pinY = crankY + Math.cos(angle) * crankR;
        const pinZ = Math.sin(angle) * crankR;

        const dy = Math.sqrt(rodL * rodL - pinZ * pinZ);
        const pistonY = pinY + dy;

        pistonPosTimes.push(t);
        pistonPosValues.push(0, pistonY + 0.5, 0);

        conRodPosTimes.push(t);
        conRodPosValues.push(0, pinY, pinZ);

        const rodAngle = Math.asin(-pinZ / rodL);
        conRodRotTimes.push(t);
        
        const euler = new THREE.Euler(rodAngle, 0, 0);
        const quat = new THREE.Quaternion().setFromEuler(euler);
        conRodRotValues.push(quat.x, quat.y, quat.z, quat.w);
    }

    const crankTrack = new THREE.NumberKeyframeTrack('crankshaft.rotation[x]', crankRotTimes, crankRotValues);
    const pistonTrack = new THREE.VectorKeyframeTrack('piston.position', pistonPosTimes, pistonPosValues);
    const conRodPosTrack = new THREE.VectorKeyframeTrack('conRod.position', conRodPosTimes, conRodPosValues);
    const conRodRotTrack = new THREE.QuaternionKeyframeTrack('conRod.quaternion', conRodRotTimes, conRodRotValues);

    const animationClips = [
        new THREE.AnimationClip('EngineCycle', duration, [crankTrack, pistonTrack, conRodPosTrack, conRodRotTrack])
    ];

    return { group, animationClips };
}
