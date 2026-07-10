import { carbonFiber, titanium, wireCoil, blueAccent } from '../utils/materials.js';

export function createBionicArm(THREE) {
    const group = new THREE.Group();
    const animationClips = [];

    // Base attachment
    const baseGeo = new THREE.CylinderGeometry(0.5, 0.6, 1, 32);
    const base = new THREE.Mesh(baseGeo, carbonFiber);
    base.position.y = 0.5;
    group.add(base);

    // Upper arm
    const upperArmGeo = new THREE.CylinderGeometry(0.4, 0.4, 2.5, 32);
    const upperArm = new THREE.Mesh(upperArmGeo, titanium);
    upperArm.position.y = 1.25;
    base.add(upperArm);
    
    // Elbow joint
    const elbowGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const elbow = new THREE.Mesh(elbowGeo, carbonFiber);
    elbow.position.y = 1.25;
    elbow.name = "Elbow";
    upperArm.add(elbow);

    // Lower arm
    const lowerArmGeo = new THREE.CylinderGeometry(0.3, 0.35, 2.5, 32);
    const lowerArm = new THREE.Mesh(lowerArmGeo, titanium);
    lowerArm.position.y = 1.25;
    elbow.add(lowerArm);
    
    // Wrist and Hand
    const wristGeo = new THREE.BoxGeometry(0.7, 0.3, 0.4);
    const wrist = new THREE.Mesh(wristGeo, carbonFiber);
    wrist.position.y = 1.25;
    lowerArm.add(wrist);

    // Fingers
    const fingerTracks = [];
    for (let i = 0; i < 4; i++) {
        const fingerGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.8);
        const finger = new THREE.Mesh(fingerGeo, titanium);
        finger.position.set(-0.25 + i * 0.16, 0.4, 0.1);
        finger.name = `Finger${i}`;
        wrist.add(finger);
        
        fingerTracks.push(new THREE.NumberKeyframeTrack(
            `${finger.name}.rotation[x]`,
            [0, 1, 2],
            [0, Math.PI / 4, 0]
        ));
    }
    
    // Thumb
    const thumbGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.7);
    const thumb = new THREE.Mesh(thumbGeo, titanium);
    thumb.position.set(0.3, 0.2, 0);
    thumb.rotation.z = Math.PI / 4;
    wrist.add(thumb);

    // Glowing LED Indicator
    const ledGeo = new THREE.SphereGeometry(0.05);
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true });
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.position.set(0, 0, 0.5);
    led.name = "LED";
    elbow.add(led);

    // Animations: Elbow flexing and fingers grasping
    const elbowTrack = new THREE.NumberKeyframeTrack(
        'Elbow.rotation[x]',
        [0, 1, 2],
        [0, Math.PI / 3, 0]
    );

    const blinkTrack = new THREE.NumberKeyframeTrack(
        'LED.material.opacity',
        [0, 0.5, 1, 1.5, 2],
        [1, 0, 1, 0, 1]
    );

    const clip = new THREE.AnimationClip('FlexAndGrasp', 2, [elbowTrack, ...fingerTracks, blinkTrack]);
    animationClips.push(clip);

    return { group, animationClips };
}
