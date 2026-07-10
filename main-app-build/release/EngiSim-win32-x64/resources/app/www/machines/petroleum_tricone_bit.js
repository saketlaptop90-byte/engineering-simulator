import * as materials from '../utils/materials.js';

export function createTriconeDrillBit(THREE) {
    const group = new THREE.Group();
    group.name = 'TriconeRotaryDrillBit';

    const metalMat = materials.metalSteel || new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });
    const goldMat = materials.metalGold || new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.3 });

    // Main Body
    const bodyGeo = new THREE.CylinderGeometry(1, 1.2, 2, 16);
    const body = new THREE.Mesh(bodyGeo, metalMat);
    body.position.y = 1;
    group.add(body);

    // Drill String Connector
    const connectorGeo = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
    const connector = new THREE.Mesh(connectorGeo, metalMat);
    connector.position.y = 2.5;
    group.add(connector);

    // Cones
    const conesGroup = new THREE.Group();
    group.add(conesGroup);

    const coneGeo = new THREE.ConeGeometry(0.8, 1.5, 12);
    
    const cone1 = new THREE.Mesh(coneGeo, goldMat);
    cone1.position.set(0.6, -0.5, 0.6);
    cone1.rotation.x = -Math.PI / 4;
    cone1.rotation.z = Math.PI / 4;
    conesGroup.add(cone1);

    const cone2 = new THREE.Mesh(coneGeo, goldMat);
    cone2.position.set(-0.6, -0.5, 0.6);
    cone2.rotation.x = -Math.PI / 4;
    cone2.rotation.z = -Math.PI / 4;
    conesGroup.add(cone2);

    const cone3 = new THREE.Mesh(coneGeo, goldMat);
    cone3.position.set(0, -0.5, -0.8);
    cone3.rotation.x = Math.PI / 4;
    conesGroup.add(cone3);

    // Animations: Main group spins, cones spin
    const duration = 1;
    const times = [0, duration];
    
    // Main bit rotating
    const mainValues = [0, -Math.PI * 2];
    const mainTrack = new THREE.NumberKeyframeTrack(`${group.uuid}.rotation[y]`, times, mainValues);
    
    // Cones rotating
    const coneValues = [0, Math.PI * 4];
    const cone1Track = new THREE.NumberKeyframeTrack(`${cone1.uuid}.rotation[y]`, times, coneValues);
    const cone2Track = new THREE.NumberKeyframeTrack(`${cone2.uuid}.rotation[y]`, times, coneValues);
    const cone3Track = new THREE.NumberKeyframeTrack(`${cone3.uuid}.rotation[y]`, times, coneValues);

    const clip = new THREE.AnimationClip('DrillBitSpin', duration, [mainTrack, cone1Track, cone2Track, cone3Track]);

    return { group, animationClips: [clip] };
}
