import * as materials from '../utils/materials.js';

export function createHapticJoystick(THREE) {
    const group = new THREE.Group();

    const plastic = materials.plastic || new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });
    const aluminum = materials.aluminum || new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8 });
    const steel = materials.steel || new THREE.MeshStandardMaterial({ color: 0x777777, metalness: 0.9, roughness: 0.3 });
    const redGlow = materials.redGlow || new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 0.5 });

    const baseGeo = new THREE.BoxGeometry(4, 1, 4);
    const baseMesh = new THREE.Mesh(baseGeo, plastic);
    group.add(baseMesh);

    const outerRing = new THREE.Group();
    outerRing.position.y = 1;
    group.add(outerRing);

    const ringGeo = new THREE.TorusGeometry(1.2, 0.2, 16, 32);
    const ringMesh = new THREE.Mesh(ringGeo, aluminum);
    ringMesh.rotation.x = Math.PI / 2;
    outerRing.add(ringMesh);

    const innerRing = new THREE.Group();
    outerRing.add(innerRing);

    const innerRingGeo = new THREE.TorusGeometry(0.8, 0.2, 16, 32);
    const innerRingMesh = new THREE.Mesh(innerRingGeo, steel);
    innerRingMesh.rotation.x = Math.PI / 2;
    innerRing.add(innerRingMesh);

    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 4, 16), steel);
    shaft.position.y = 2; 
    innerRing.add(shaft);

    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.3, 1.5, 16), plastic);
    handle.position.y = 4;
    innerRing.add(handle);

    const button = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16), redGlow);
    button.position.y = 4.8;
    innerRing.add(button);

    const motorX = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1, 16), steel);
    motorX.rotation.z = Math.PI / 2;
    motorX.position.set(-2, 1, 0);
    group.add(motorX);

    const motorZ = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1, 16), steel);
    motorZ.rotation.x = Math.PI / 2;
    motorZ.position.set(0, 1, -2);
    group.add(motorZ);

    const times = [];
    const outerQs = [];
    const innerQs = [];
    
    let t = 0;
    const eOuter = new THREE.Euler();
    const eInner = new THREE.Euler();
    const qOuter = new THREE.Quaternion();
    const qInner = new THREE.Quaternion();

    for(let i=0; i<=40; i++) {
        t = i * 0.1;
        times.push(t);
        
        let rotX = 0; 
        let rotZ = 0; 
        
        if (t <= 1) {
            rotX = (t / 1) * 0.4;
            rotZ = (t / 1) * 0.4;
        } else if (t > 1 && t <= 2) {
            rotX = 0.4 + (Math.random() - 0.5) * 0.05;
            rotZ = 0.4 + (Math.random() - 0.5) * 0.05;
        } else if (t > 2 && t <= 3) {
            let p = (t - 2) / 1;
            rotX = 0.4 - p * 0.8; 
            rotZ = 0.4 - p * 0.8;
        } else if (t > 3) {
            let p = (t - 3) / 1;
            rotX = -0.4 + p * 0.4; 
            rotZ = -0.4 + p * 0.4;
        }

        eOuter.set(rotX, 0, 0);
        qOuter.setFromEuler(eOuter);
        outerQs.push(qOuter.x, qOuter.y, qOuter.z, qOuter.w);

        eInner.set(0, 0, rotZ);
        qInner.setFromEuler(eInner);
        innerQs.push(qInner.x, qInner.y, qInner.z, qInner.w);
    }

    const track1 = new THREE.QuaternionKeyframeTrack(outerRing.uuid + '.quaternion', times, outerQs);
    const track2 = new THREE.QuaternionKeyframeTrack(innerRing.uuid + '.quaternion', times, innerQs);

    const clip = new THREE.AnimationClip('HapticFeedback', 4, [track1, track2]);

    return { group, animationClips: [clip] };
}
