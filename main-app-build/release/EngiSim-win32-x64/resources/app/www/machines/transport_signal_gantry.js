import { materials } from '../utils/materials.js';

export function createTrafficSignalGantry(THREE) {
    const group = new THREE.Group();
    group.name = 'TrafficSignalGantry';
    const animationClips = [];

    const metalMat = materials.steel || new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.7, roughness: 0.3 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x222222 });

    const pillarGeo = new THREE.CylinderGeometry(0.5, 0.5, 12, 16);
    const leftPillar = new THREE.Mesh(pillarGeo, metalMat);
    leftPillar.position.set(-15, 6, 0);
    group.add(leftPillar);

    const rightPillar = new THREE.Mesh(pillarGeo, metalMat);
    rightPillar.position.set(15, 6, 0);
    group.add(rightPillar);

    const trussBaseGeo = new THREE.BoxGeometry(31, 1.5, 1.5);
    const trussBase = new THREE.Mesh(trussBaseGeo, metalMat);
    trussBase.position.set(0, 11, 0);
    group.add(trussBase);

    const topTrussGeo = new THREE.BoxGeometry(31, 0.5, 0.5);
    const topTruss = new THREE.Mesh(topTrussGeo, metalMat);
    topTruss.position.set(0, 12.5, 0);
    group.add(topTruss);

    for(let x = -14.5; x <= 14.5; x += 1) {
        const braceGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.8);
        braceGeo.rotateZ(Math.PI / 4);
        const brace = new THREE.Mesh(braceGeo, metalMat);
        brace.position.set(x, 11.75, 0);
        group.add(brace);
        
        const brace2Geo = new THREE.CylinderGeometry(0.1, 0.1, 1.8);
        brace2Geo.rotateZ(-Math.PI / 4);
        const brace2 = new THREE.Mesh(brace2Geo, metalMat);
        brace2.position.set(x, 11.75, 0);
        group.add(brace2);
    }

    const createTrafficLight = (xPos) => {
        const tlGroup = new THREE.Group();
        tlGroup.position.set(xPos, 9, 0.8);
        
        const boxGeo = new THREE.BoxGeometry(1, 3, 1);
        const box = new THREE.Mesh(boxGeo, darkMat);
        tlGroup.add(box);
        
        const lightGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16);
        lightGeo.rotateX(Math.PI / 2);
        
        const redMat = new THREE.MeshStandardMaterial({ color: 0x330000, emissive: 0xff0000, emissiveIntensity: 0 });
        const redLight = new THREE.Mesh(lightGeo, redMat);
        redLight.position.set(0, 1, 0.55);
        redLight.name = `RedLight_${xPos}`;
        tlGroup.add(redLight);
        
        const yellowMat = new THREE.MeshStandardMaterial({ color: 0x333300, emissive: 0xffff00, emissiveIntensity: 0 });
        const yellowLight = new THREE.Mesh(lightGeo, yellowMat);
        yellowLight.position.set(0, 0, 0.55);
        yellowLight.name = `YellowLight_${xPos}`;
        tlGroup.add(yellowLight);
        
        const greenMat = new THREE.MeshStandardMaterial({ color: 0x003300, emissive: 0x00ff00, emissiveIntensity: 1 });
        const greenLight = new THREE.Mesh(lightGeo, greenMat);
        greenLight.position.set(0, -1, 0.55);
        greenLight.name = `GreenLight_${xPos}`;
        tlGroup.add(greenLight);

        return tlGroup;
    };

    group.add(createTrafficLight(-8));
    group.add(createTrafficLight(0));
    group.add(createTrafficLight(8));

    const vmsGroup = new THREE.Group();
    vmsGroup.position.set(0, 13.5, 0.5);
    const vmsBoxGeo = new THREE.BoxGeometry(12, 3, 1);
    const vmsBox = new THREE.Mesh(vmsBoxGeo, darkMat);
    vmsGroup.add(vmsBox);
    
    const vmsScreenGeo = new THREE.PlaneGeometry(11.5, 2.5);
    const vmsScreenMat = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x001100, emissiveIntensity: 1 });
    const vmsScreen = new THREE.Mesh(vmsScreenGeo, vmsScreenMat);
    vmsScreen.position.set(0, 0, 0.51);
    vmsScreen.name = 'VMSScreen';
    vmsGroup.add(vmsScreen);
    group.add(vmsGroup);

    const times = [0, 5, 5.1, 7, 7.1, 10, 10.1, 12];
    
    const greenIntensities = [1, 1, 0, 0, 0, 0, 1, 1];
    const yellowIntensities = [0, 0, 1, 1, 0, 0, 0, 0];
    const redIntensities = [0, 0, 0, 0, 1, 1, 0, 0];

    const tracks = [];
    [-8, 0, 8].forEach(xPos => {
        tracks.push(new THREE.NumberKeyframeTrack(`GreenLight_${xPos}.material.emissiveIntensity`, times, greenIntensities));
        tracks.push(new THREE.NumberKeyframeTrack(`YellowLight_${xPos}.material.emissiveIntensity`, times, yellowIntensities));
        tracks.push(new THREE.NumberKeyframeTrack(`RedLight_${xPos}.material.emissiveIntensity`, times, redIntensities));
    });

    const vmsTimes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const vmsValues = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0];
    tracks.push(new THREE.NumberKeyframeTrack('VMSScreen.material.emissiveIntensity', vmsTimes, vmsValues));

    const clip = new THREE.AnimationClip('TrafficCycle', 12, tracks);
    animationClips.push(clip);

    return { group, animationClips };
}
