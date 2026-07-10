import { steel, darkSteel, aluminum } from '../utils/materials.js';

export function createONeillCylinder(THREE) {
    const group = new THREE.Group();

    const cylLength = 200;
    const cylRadius = 40;

    // Cylinder A (rotates clockwise)
    const cylAGroup = new THREE.Group();
    cylAGroup.name = "CylinderA";
    cylAGroup.position.z = -110;
    
    const shellAGeo = new THREE.CylinderGeometry(cylRadius, cylRadius, cylLength, 32, 1, true);
    const shellA = new THREE.Mesh(shellAGeo, steel);
    shellA.rotation.x = Math.PI / 2;
    cylAGroup.add(shellA);
    
    const capGeo = new THREE.SphereGeometry(cylRadius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const cap1A = new THREE.Mesh(capGeo, darkSteel);
    cap1A.position.z = cylLength / 2;
    cylAGroup.add(cap1A);
    
    const cap2A = new THREE.Mesh(capGeo, darkSteel);
    cap2A.position.z = -cylLength / 2;
    cap2A.rotation.x = Math.PI;
    cylAGroup.add(cap2A);
    
    group.add(cylAGroup);

    // Cylinder B (rotates counter-clockwise)
    const cylBGroup = new THREE.Group();
    cylBGroup.name = "CylinderB";
    cylBGroup.position.z = 110;
    
    const shellB = new THREE.Mesh(shellAGeo, aluminum);
    shellB.rotation.x = Math.PI / 2;
    cylBGroup.add(shellB);
    
    const cap1B = new THREE.Mesh(capGeo, darkSteel);
    cap1B.position.z = cylLength / 2;
    cylBGroup.add(cap1B);
    
    const cap2B = new THREE.Mesh(capGeo, darkSteel);
    cap2B.position.z = -cylLength / 2;
    cap2B.rotation.x = Math.PI;
    cylBGroup.add(cap2B);

    group.add(cylBGroup);

    // Connecting Truss
    const trussGeo = new THREE.CylinderGeometry(5, 5, 20, 16);
    const truss = new THREE.Mesh(trussGeo, darkSteel);
    truss.rotation.x = Math.PI / 2;
    group.add(truss);

    // Animation for counter-rotating cylinders
    const times = [0, 2.5, 5.0, 7.5, 10.0];
    const axis = new THREE.Vector3(0, 0, 1).normalize();
    
    const valuesA = [];
    const valuesB = [];
    
    for(let i=0; i<=4; i++) {
        const angleA = (i/4) * Math.PI * 2;
        const qA = new THREE.Quaternion().setFromAxisAngle(axis, angleA);
        valuesA.push(qA.x, qA.y, qA.z, qA.w);
        
        const angleB = -(i/4) * Math.PI * 2;
        const qB = new THREE.Quaternion().setFromAxisAngle(axis, angleB);
        valuesB.push(qB.x, qB.y, qB.z, qB.w);
    }
    
    const trackA = new THREE.QuaternionKeyframeTrack('CylinderA.quaternion', times, valuesA);
    const trackB = new THREE.QuaternionKeyframeTrack('CylinderB.quaternion', times, valuesB);
    
    const clip = new THREE.AnimationClip('ONeillRotation', 10, [trackA, trackB]);

    return { group, animationClips: [clip] };
}
